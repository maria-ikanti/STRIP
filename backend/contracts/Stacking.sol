// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
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
    uint public periodFinish;
    uint public yeldRate;
    uint public yeldDuration = 1 minutes;
    uint public lastUpdateTime;
    uint public yeldsPerTokenStored;

    mapping(address => uint) public userYeldsPerTokenPaid;
    // Yelds earned by one account
    mapping(address => uint) public yelds;

    uint private _totalSupply;
    // Total deposited amount by account
    mapping(address => uint) private _balances;

    constructor(address _inToken, address _outToken) Ownable(msg.sender) {
        inToken = IERC20(_inToken);
        outToken = IERC20(_outToken);
    }

    /**
    @notice A modifier to be executed on any deposit or withdrow 
     */
    modifier resetYeld(address _account) {
        yeldsPerTokenStored = yeldPerToken();
        lastUpdateTime = lastTimeYeldApplicable();

        if (_account != address(0)) {
            // Update the gains table for the given account
            yelds[_account] = gain(_account);
            // Update the payed yelds for the given user
            userYeldsPerTokenPaid[_account] = yeldsPerTokenStored;
        }
        _;
    }

    function yeldPerToken() public view returns (uint) {
        if (_totalSupply == 0) {
            return yeldsPerTokenStored;
        }
        // Since the last time we made an updae
        uint periodApplicable = lastTimeYeldApplicable() - lastUpdateTime;
        // The period per rate, devided by the total supply
        return periodApplicable*yeldRate*1e18/_totalSupply;
    }

    /**
    @notice Returns the total earned by an account 
     */
    function gain(address _account) public view returns (uint) {
        return _balances[_account]*(yeldPerToken()-userYeldsPerTokenPaid[_account])/1e18 + yelds[_account];
    }

    function lastTimeYeldApplicable() public view returns (uint) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function totalSupply() external view returns (uint) {
        return _totalSupply;
    }

    function balanceOf(address _account) external view returns (uint) {
        return _balances[_account];
    }

    /**
    @notice Gets the yeld for a given duration
     */
    function getYeldForDuration() external view returns (uint) {
        return yeldRate*yeldDuration;
    }


    function sendInitialAmount(address _address, uint _amount) external onlyOwner nonReentrant{
        require(_amount > 0, "Amount to be initialized must be > 0");
            inToken.safeTransfer(_address,_amount);
    }

    function stake(address _address, uint _amount) external nonReentrant resetYeld(_address) {
        require(_amount > 0, "Amount to be staked must be > 0");
        _totalSupply = _totalSupply + _amount;
        _balances[_address] = _balances[_address] + _amount;
        outToken.safeTransferFrom(_address, address(this), _amount);
        emit Staked(_address, _amount);
    }

    function withdraw(uint _amount) public nonReentrant resetYeld(msg.sender) {
        require(_amount > 0, "Must withrow a positive value");
        _totalSupply = _totalSupply - _amount;
        _balances[msg.sender] = _balances[msg.sender] - _amount ;
        outToken.safeTransfer(msg.sender, _amount);
        emit Withdrawn(msg.sender, _amount);
    }

    function getYeld() public nonReentrant resetYeld(msg.sender) {
        uint yeld = yelds[msg.sender];
        if (yeld > 0) {
            yelds[msg.sender] = 0;
            inToken.safeTransfer(msg.sender, yeld);
            emit YeldPaid(msg.sender, yeld);
        }
    }

    function exit() external {
        withdraw(_balances[msg.sender]);
        getYeld();
    }


/*    function notifyYeldAmount(uint256 _yeld) external updateYeld(address(0)) {
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
    } 


    function setYeldDuration(uint256 _yeldDuration) external onlyOwner {
        require(
            block.timestamp > periodFinish,
            "Previous yeld period must be complete before changing the duration for the new period"
        );
        yeldDuration = _yeldDuration;
        emit YeldDurationUpdated(yeldDuration);
    } */
}