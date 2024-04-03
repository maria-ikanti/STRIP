// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./STRP.sol";
import "./STRY.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//import "openzeppelin-solidity-2.3.0/contracts/math/SafeMath.sol";


/* ========== EVENTS ========== */

event YeldAdded(uint256 reward);
event Staked(address indexed user, uint256 amount);
event Withdrawn(address indexed user, uint256 amount);
event YeldPaid(address indexed user, uint256 reward);
event YeldDurationUpdated(uint256 newDuration);
//event PeriodFinishedUpdated(uint256 newPeriodFinished);
event Recovered(address token, uint256 amount);
event Exit(address sender, uint256 amount);

contract Staking is ReentrancyGuard, Ownable {

    using SafeERC20 for IERC20;
 //       using SafeMath for uint256;

    /* ========== STATE VARIABLES ========== */

    IERC20 public yeldsToken;
    IERC20 public stakingToken;
    STRP public strpToken;
    STRY public stryToken;
    //Strip public stripContract;
    uint256 public periodFinish=1; // maturity
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
    //constructor(address _yeldsToken, address _stakingToken, address _strpToken, address _stryToken) Ownable(msg.sender) {
        yeldsToken = IERC20(_yeldsToken);
        stakingToken = IERC20(_stakingToken);
        strpToken = new STRP();
    }

    /**
    @notice A modifier to be executed on any stake, deposit or withdraw 
     */
    modifier updateYeld(address _account) {
        yeldsPerTokenStored = yeldPerToken();
        lastUpdateTime = lastTimeYeldApplicable();
        require (_account != address(0), "Must be a valid address");
        // Update the gains table for the given account
        yelds[_account] = earned(_account);
        // Update the payed yelds for the given user
        userYeldsPerTokenPaid[_account] = yeldsPerTokenStored;
        _;
    }

    /// @notice returns the yelds earned for each token staked. Avec intérêts composés
    function yeldPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            console.log('yeldPerToken= dans le if', _totalSupply, ' ', yeldsPerTokenStored);
            return yeldsPerTokenStored;
        }
        // Since the last time we made an update
        //uint periodApplicable = 1; //lastTimeYeldApplicable() - lastUpdateTime;
        console.log('yeldPerToken : periodApplicable ',lastTimeYeldApplicable() - lastUpdateTime);
        console.log('yeldPerToken : yeldsPerTokenStored ',yeldsPerTokenStored);
        console.log('yeldPerToken : _totalSupply ',_totalSupply);
        console.log('yeldPerToken=',yeldsPerTokenStored * (yeldRate *(lastTimeYeldApplicable() - lastUpdateTime)* 1e18) / _totalSupply);
        return yeldsPerTokenStored + (yeldRate *(lastTimeYeldApplicable() - lastUpdateTime)* 1e18) / _totalSupply;
    }

    /** @notice The las time when we are supposed to give a yeld. If periodFinish, then it means that the last time is in the past. Else, it is the last block.timestamp
    @return uint256 period (datetime)
    */
    function lastTimeYeldApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    /**
    @notice Returns the total earned by a given account 
     */
    function earned(address _account) public view returns (uint256) {
        return (_balances[_account]*(yeldPerToken()-userYeldsPerTokenPaid[_account]))/1e18 + yelds[_account];
    }

    /**
    @notice  Claim the yelds */
    function claimYeld() public nonReentrant updateYeld(msg.sender){
        uint256 yeld = yelds[msg.sender];
        console.log('claim  : yelds ', yeld);
        require (yeld>0, "You have no yelds");
        yelds[msg.sender] = 0;
        yeldsToken.safeTransfer(msg.sender, yeld);
        emit YeldPaid(msg.sender, yeld);
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


    /**
    @notice the main staking function. Stakes the ERC20 token for a given address in the smart contact
    @param _amount the amount of the tokens to be staked
     */
    function stake(uint _amount) external nonReentrant updateYeld(msg.sender){
        require(_amount > 0, "Amount to be staked must be > 0");
        _totalSupply = _totalSupply + _amount;
        _balances[msg.sender] = _balances[msg.sender] + _amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        strpToken.mintp(msg.sender, _amount);
        emit Staked(msg.sender, _amount);
    }

        /**
    @notice the main staking function. Stakes the ERC20 token for a given address in the smart contact
    @param _amount the amount of the tokens to be staked
    
    /**
    @notice Allows the user to withdraw the staked tokens
    @param _amount the amount to be withdrawn
     */
    function withdraw(uint _amount) public nonReentrant updateYeld(msg.sender){
        require(_amount > 0, "Must withrow a positive value");
        uint256 tempBalance = _balances[msg.sender];
        require (_amount <= tempBalance, "You don't have enough tokens");
        _totalSupply = _totalSupply - _amount;
        _balances[msg.sender] = _balances[msg.sender] - _amount ;
        stakingToken.safeTransfer(msg.sender, _amount);
        emit Withdrawn(msg.sender, _amount);
    }

    function setYeldAmount(uint256 _amount) external onlyOwner updateYeld(msg.sender){
        if (block.timestamp >= periodFinish) {
            yeldRate = _amount / yeldDuration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * yeldRate;
            yeldRate = (_amount + leftover)/yeldDuration;
        }
        // Ensure the provided yeld amount is not more than the balance in the contract.
        // This keeps the yeld rate in the right range, preventing overflows due to
        // very high values of yeldRate in the earned and yeldPerToken functions;
        // Yeld + leftover must be less than 2^256 / 10^18 to avoid overflow.
        uint balance = yeldsToken.balanceOf(address(this));
        require(yeldRate <= balance / yeldDuration, "Provided amount too high");
        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + yeldDuration;
        emit YeldAdded(_amount);
    } 

    function setYeldDuration(uint256 _yeldDuration) external onlyOwner {
        yeldDuration = _yeldDuration;
        emit YeldDurationUpdated(yeldDuration);
    } 
}