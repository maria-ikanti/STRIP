// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./STRP.sol";
import "./STRY.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


/* ========== EVENTS ========== */

event YeldAdded(uint256 reward);
event Staked(address indexed user, uint256 amount);
event Withdrawn(address indexed user, uint256 amount);
event YeldPaid(address indexed user, uint256 reward);
event YeldDurationUpdated(uint256 newDuration);
event PeriodFinishedUpdated(uint256 newPeriodFinished);
event Recovered(address token, uint256 amount);
event Exit(address sender, uint256 amount);

contract Staking is ReentrancyGuard, Ownable {

    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */

    IERC20 public yeldsToken;
    IERC20 public stakingToken;
    //Strip public stripContract;
    uint256 public periodFinish; // maturity
    uint256 public yeldRate;
    uint256 public yeldDuration = 1 minutes;
    uint256 public lastUpdateTime;
    uint256 public yeldsPerTokenStored;


    /// @notice Yelds already payed for each staked token
    mapping(address => uint) public userYeldsPerTokenPaid;
    // Yelds earned by one account
    mapping(address => uint) public yelds;

    /// @notice total supply of the STRU token
    uint private _totalSupply;
    // Total deposited amount by account
    mapping(address => uint) private _balances;

    constructor(address _yeldsToken, address _stakingToken) Ownable(msg.sender) {
        yeldsToken = IERC20(_yeldsToken);
        stakingToken = IERC20(_stakingToken);
        //, uint256 _yeldRate, uint256 _yeldDuration
       // yeldRate = _yeldRate;
       // yeldDuration= _yeldDuration;
        console.log('constructor yeld duration', yeldDuration);
        //stripContract = new Strip();
    }

    /**
    @notice A modifier to be executed on any deposit or withdraw 
     */
    modifier resetYeld(address _account) {
        yeldsPerTokenStored = yeldPerToken();
        lastUpdateTime = lastTimeYeldApplicable();
        require (_account != address(0), "Must be a valid address");
        // Update the gains table for the given account
        yelds[_account] = earned(_account);
        console.log('resetYeld : yelds[_account]',yelds[_account]);
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
        console.log('yeldPerToken: lastTimeYeldApplicable()', lastTimeYeldApplicable());
        console.log('yeldPerToken : lastUpdateTime', lastUpdateTime);
        console.log('yeldPerToken : periodApplicable', periodApplicable);
        uint temp = periodApplicable*yeldRate/_totalSupply;
        console.log('yeldPerToken : _totalSupply', _totalSupply);
        console.log('yeldPerToken : yeldsPerTokenStored', yeldsPerTokenStored);
        console.log('yeldPerToken : temp', temp);
        return periodApplicable*yeldRate*1e18/_totalSupply;
    }

    /** @notice The last time the yeld was applied
    @return uint256 period (datetime)
    */
    function lastTimeYeldApplicable() public view returns (uint256) {
        console.log('lastTimeYeldApplicable: block.timestamp', block.timestamp);
        console.log('lastTimeYeldApplicable: periodFinish', periodFinish);
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    /**
    @notice Returns the total earned by a given account 
     */
    function earned(address _account) public view returns (uint256) {
        console.log('earned: _balances[_account]', _balances[_account]);
        console.log('earned: yeldPerToken()', yeldPerToken());
        console.log('earned: userYeldsPerTokenPaid[_account]', userYeldsPerTokenPaid[_account]);
        console.log('earned: yelds[_account]', yelds[_account]);
        uint256 earnedAmount = _balances[_account]*(yeldPerToken()-userYeldsPerTokenPaid[_account])/1e18 + yelds[_account];
        return earnedAmount;
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
     
    function sendInitialAmount(address _from, uint _amount) external onlyOwner nonReentrant{
        require(_amount > 0, "Amount to be initialized must be > 0");
            //inToken.safeTransfer(_address,_amount);
            yeldsToken.safeTransferFrom(_from, address(this), _amount);
    }*/

    /**
    @notice the main staking function. Stakes the ERC20 token for a given address in the smart contact
    @param _fromAddress the adress of the user that will stake his tokens
    @param _amount the amount of the tokens to be staked
     */
    function stake(address _fromAddress, uint _amount) external nonReentrant {
        require(_amount > 0, "Amount to be staked must be > 0");
        _totalSupply = _totalSupply + _amount;
        //vérifier
        _balances[_fromAddress] = _balances[_fromAddress] + _amount;
        stakingToken.safeTransferFrom(_fromAddress, address(this), _amount);
         yelds[_fromAddress] = earned(_fromAddress);
        // strips the undelying token into 2 tokens
        // stripContract.strip(_address, _amount);
        emit Staked(_fromAddress, _amount);
    }

    /**
    @notice Allows the user to withdraw the staked tokens
    @param _amount the amount to be withdrawn
     */
    function withdraw(uint256 _amount) public nonReentrant resetYeld(msg.sender) {
        require(_amount > 0, "Must withrow a positive value");
        uint256 tempBalance = _balances[msg.sender];
        require (_amount <= tempBalance, "You don't have enough tokens");
        _totalSupply = _totalSupply - _amount;
        _balances[msg.sender] = _balances[msg.sender] - _amount ;
        stakingToken.safeTransfer(msg.sender, _amount);
        emit Withdrawn(msg.sender, _amount);
    }

    /**
    @notice  Claim the yelds */
    function claimYeld() public nonReentrant resetYeld(msg.sender) {
        uint256 yeld = yelds[msg.sender];
        require (yeld>0, "You have no yelds");
        yelds[msg.sender] = 0;
        yeldsToken.safeTransfer(msg.sender, yeld);
        emit YeldPaid(msg.sender, yeld);
    }

    /**
    @notice Withdraw the total of the amount staked */
    function exit() external {
        withdraw(_balances[msg.sender]);
        claimYeld();
        emit Exit(msg.sender, _balances[msg.sender]);
    }

    function notifyYeldAmount(uint256 _yeld) external onlyOwner {
        if (block.timestamp >= periodFinish) {
            yeldRate = 3;//_yeld / yeldDuration;
            console.log('notifyYeldAmount: block.timestamp ds if',block.timestamp);
            console.log('notifyYeldAmount: periodFinish ds if',periodFinish);
            console.log('notifyYeldAmount: period ds if',block.timestamp-periodFinish);
            console.log('notifyYeldAmount: yeldRate ds if',yeldRate);
            console.log('notifyYeldAmount: _yeld ds if',_yeld);
            console.log('notifyYeldAmount: yeldDuration ds if',yeldDuration);
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * yeldRate;
            yeldRate = _yeld + leftover/yeldDuration;
            console.log('notifyYeldAmount: yeldRate ds else',yeldRate);
        }
        console.log('notifyYeldAmount :yeldRate', yeldRate );
        // Ensure the provided yeld amount is not more than the balance in the contract.
        // This keeps the yeld rate in the right range, preventing overflows due to
        // very high values of yeldRate in the earned and yeldPerToken functions;
        // Yeld + leftover must be less than 2^256 / 10^18 to avoid overflow.
        uint balance = yeldsToken.balanceOf(address(this));
        console.log('notifyYeldAmount :balance', balance );
        require(yeldRate <= balance / yeldDuration, "Provided amount too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + yeldDuration;
        console.log('notifyYeldAmount :lastUpdateTime', lastUpdateTime );
        console.log('notifyYeldAmount :periodFinish', periodFinish );
        console.log('notifyYeldAmount :_yeld after', _yeld );
        emit YeldAdded(_yeld);
    } 

    /*function setPeriodFinish(uint256 _periodFinish) external onlyOwner {
        require(
            _periodFinish > block.timestamp ,
            "Previous yeld period must be complete before changing the duration for the new period"
        );
        periodFinish = _periodFinish;
        emit PeriodFinishedUpdated(_periodFinish);
    }*/

    function setYeldDuration(uint256 _yeldDuration) external onlyOwner {
        require(
            block.timestamp > periodFinish,
            "Previous yeld period must be complete before changing the duration for the new period"
        );
        yeldDuration = _yeldDuration;
        emit YeldDurationUpdated(yeldDuration);
    } 
}