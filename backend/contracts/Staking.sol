// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./STRP.sol";
import "./STRY.sol";
import "./Strip.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/* ========== EVENTS ========== */

event YeldAdded(uint256 reward);
event Staked(address indexed user, uint256 amount);
event Withdrawn(address indexed user, uint256 amount);
event YeldPaid(address indexed user, uint256 reward);
event YeldDurationUpdated(uint256 newDuration);
event Recovered(address token, uint256 amount);

contract Staking is ReentrancyGuard, Ownable {

    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */

    IERC20 public inToken;
    IERC20 public outToken;
    Strip public stripContract;
    uint256 public periodFinish;
    /// @notice 3% per period
    uint256 public yeldRate;
    uint256 public yeldDuration = 1 minutes;
    uint256 public lastUpdateTime;
    uint256 public yeldsPerTokenStored;


    /// @notice Yealds already payed for each staked token
    mapping(address => uint) public userYeldsPerTokenPaid;
    // Yelds earned by one account
    mapping(address => uint) public yelds;

    /// @notice total supply of the STRU token
    uint private _totalSupply;
    // Total deposited amount by account
    mapping(address => uint) private _balances;

    constructor(address _inToken, address _outToken, uint256 _yeldRate, uint256 _yeldDuration) Ownable(msg.sender) {
        inToken = IERC20(_inToken);
        outToken = IERC20(_outToken);
        yeldRate = _yeldRate;
        yeldDuration=_yeldDuration;
        stripContract = new Strip();
    }

    /**
    @notice A modifier to be executed on any deposit or withdrow 
     */
    modifier resetYeld(address _account) {
        yeldsPerTokenStored = yeldPerToken();
        lastUpdateTime = lastTimeYeldApplicable();
        require (_account != address(0), "Must be a valid address");
        // Update the gains table for the given account
        yelds[_account] = earned(_account);
        // Update the payed yelds for the given user
        userYeldsPerTokenPaid[_account] = yeldsPerTokenStored;
        _;
    }

    /// @notice returns the yelds earned for each token staked
    function yeldPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return yeldsPerTokenStored;
        }
        // Since the last time we made an update
        uint periodApplicable = lastTimeYeldApplicable() - lastUpdateTime;
        // The period per rate, devided by the total supply
        return periodApplicable*yeldRate*1e18/_totalSupply;
    }

    /**
    @notice Returns the total earned by a given account 
     */
    function earned(address _account) public view returns (uint256) {
        return _balances[_account]*(yeldPerToken()-userYeldsPerTokenPaid[_account])/1e18 + yelds[_account];
    }

    /** @notice The last time the yeld was applied
        @return uint256 period (datetime)
    */
    function lastTimeYeldApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    /**
    @notice returns the total supply of the ERC20 token
    @return uint256 the total supply
     */
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    /**
    @notice Return the balance of an account
    @return uint256 the balance of the account
     */
    function balanceOf(address _account) external view returns (uint256) {
        return _balances[_account];
    }

    /**
    @notice Gets the yeld for a given duration
    @return uint256 the yeld for a given duration
     */
    function getYeldForDuration() external view returns (uint256) {
        return yeldRate*yeldDuration;
    }

    /**
    @notice
     */
    function sendInitialAmount(address _address, uint _amount) external onlyOwner nonReentrant{
        require(_amount > 0, "Amount to be initialized must be > 0");
            inToken.safeTransfer(_address,_amount);
    }

    /**
    @notice the main staking function. Stakes the ERC20 token for a given address in the smart contact
    @param _address the adress of the user that will stake his tokens
    @param _amount the amount of the tokens to be staked
     */
    function stake(address _address, uint _amount) external nonReentrant resetYeld(_address) {
        require(_amount > 0, "Amount to be staked must be > 0");
        _totalSupply = _totalSupply + _amount;
        _balances[_address] = _balances[_address] + _amount;
        outToken.safeTransferFrom(_address, address(this), _amount);
        // strips the undelying token into 2 tokens
        // stripContract.strip(_address, _amount);
        emit Staked(_address, _amount);
    }

    /**
    @notice Allows the user to withdraw the staked tokens
    @param _amount the amount to be withdrawn
     */
    function withdraw(uint _amount) public nonReentrant resetYeld(msg.sender) {
        require(_amount > 0, "Must withrow a positive value");
        _totalSupply = _totalSupply - _amount;
        _balances[msg.sender] = _balances[msg.sender] - _amount ;
        outToken.safeTransfer(msg.sender, _amount);
        emit Withdrawn(msg.sender, _amount);
    }

    /**
    @notice  Getq the yelds */
    function getYeld() public nonReentrant resetYeld(msg.sender) {
        uint256 yeld = yelds[msg.sender];
        if (yeld > 0) {
            yelds[msg.sender] = 0;
            inToken.safeTransfer(msg.sender, yeld);
            emit YeldPaid(msg.sender, yeld);
        }
    }

    /**
    @notice Withdraw the total of the amount staked */
    function exit() external {
        withdraw(_balances[msg.sender]);
        getYeld();
    }

  /*  function notifyYeldAmount(uint256 _yeld) external resetYeld(address(0)) {
        if (block.timestamp >= periodFinish) {
            yeldRate = _yeld / yeldDuration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * yeldRate;
            yeldRate = _yeld + leftover/yeldDuration;
        }

        // Ensure the provided yeld amount is not more than the balance in the contract.
        // This keeps the yeld rate in the right range, preventing overflows due to
        // very high values of yeldRate in the earned and yeldPerToken functions;
        // Yeld + leftover must be less than 2^256 / 10^18 to avoid overflow.
        uint balance = inToken.balanceOf(address(this));
        require(yeldRate <= balance / yeldDuration, "Provided amount too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + yeldDuration;
        emit YeldAdded(_yeld);
    } */


    function setYeldDuration(uint256 _yeldDuration) external onlyOwner {
        require(
            block.timestamp > periodFinish,
            "Previous yeld period must be complete before changing the duration for the new period"
        );
        yeldDuration = _yeldDuration;
        emit YeldDurationUpdated(yeldDuration);
    } 
}