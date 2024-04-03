// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./STRP.sol";
import "./STRY.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
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
    IERC20 public strpToken;
    IERC20 public stryToken;
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
    //constructor(address _yeldsToken, address _stakingToken, address _strpToken, address _stryToken) Ownable(msg.sender) {
        yeldsToken = IERC20(_yeldsToken);
        stakingToken = IERC20(_stakingToken);
        //strpToken = IERC20(_strpToken);
        //stryToken = IERC20(_stryToken);
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
        console.log('resetYeld : yeldsPerTokenStored', yeldsPerTokenStored);
        _;
    }

    /// @notice returns the yelds earned for each token staked. Avec intérêts composés
    function yeldPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return yeldsPerTokenStored;
        }
        // Since the last time we made an update
        uint periodApplicable = 1; //lastTimeYeldApplicable() - lastUpdateTime;
        // The period per rate, devided by the total supply
        console.log('yeldPerToken: lastTimeYeldApplicable()', lastTimeYeldApplicable());
        console.log('yeldPerToken : lastUpdateTime', lastUpdateTime);
        console.log('yeldPerToken : periodApplicable', periodApplicable);
        console.log('yeldPerToken : _totalSupply', _totalSupply);
        console.log('yeldPerToken : yeldsPerTokenStored', yeldsPerTokenStored);
        console.log('yeldPerToken : result before return', yeldsPerTokenStored + periodApplicable*yeldRate/_totalSupply);
        return yeldsPerTokenStored + periodApplicable*yeldRate*1e18/_totalSupply;
        //return (yeldsPerTokenStored)*yeldRate*periodApplicable/_totalSupply;
    }

    /** @notice The las time when we are supposed to give a yeld. If periodFinish, then it means that the last time is in the past. Else, it is the last block.timestamp
    @return uint256 period (datetime)
    */
    function lastTimeYeldApplicable() public view returns (uint256) {
        console.log('lastTimeYeldApplicable: block.timestamp', block.timestamp);
        console.log('lastTimeYeldApplicable: periodFinish', periodFinish);
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    /**
    @notice Returns the total earned by a given account + the initial amount
     */
    function earned(address _account) public view returns (uint256) {
        console.log('earned: _balances[_account]', _balances[_account]);
        console.log('earned: yeldPerToken()', yeldPerToken());
        console.log('earned: userYeldsPerTokenPaid[_account]', userYeldsPerTokenPaid[_account]);
        console.log('earned: yelds[_account]', yelds[_account]);
        console.log('earned: before return ', _balances[_account]*(yeldPerToken()-userYeldsPerTokenPaid[_account])/1e18 + yelds[_account]);
        //return _balances[account].mul(yeldPerToken().sub(userYeldsPerTokenPaid[account])).div(1e18).add(yelds[account]);
        return _balances[_account]*(yeldPerToken()-userYeldsPerTokenPaid[_account])/1e18 + yelds[_account];
        //return _balances[_account]*((yeldPerToken()-userYeldsPerTokenPaid[_account]) + yelds[_account]);
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
        console.log('getYeldForDuration : yeldRate', yeldRate);
        console.log('getYeldForDuration : yeldDuration', yeldDuration);
        console.log('getYeldForDuration : yeldRate*yeldDuration', yeldRate*yeldDuration);
        return yeldRate*yeldDuration;
    }

    /**
    @notice


    /**
    @notice the main staking function. Stakes the ERC20 token for a given address in the smart contact
    @param _amount the amount of the tokens to be staked
     */
    function stake(uint _amount) external nonReentrant resetYeld(msg.sender){
        require(_amount > 0, "Amount to be staked must be > 0");
        _totalSupply = _totalSupply + _amount;
        //vérifier
        //console.log('avant staking _balances of : ', address(this),' is ', _balances[address(this)]);
        //console.log('avant staking _balances of : ', msg.sender,' is ', _balances[msg.sender]);
        _balances[msg.sender] = _balances[msg.sender] + _amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        //console.log('apres staking _balances of : ', address(this),' is ', _balances[address(this)]);
        //console.log('apres staking _balances of : ', msg.sender,' is ', _balances[msg.sender]);
        yelds[msg.sender] = earned(msg.sender);
        // strips the undelying token into 2 tokens
        // stripContract.strip(_address, _amount);
        emit Staked(msg.sender, _amount);
    }

        /**
    @notice the main staking function. Stakes the ERC20 token for a given address in the smart contact
    @param _amount the amount of the tokens to be staked
    
    function stakeAndStrip(uint _amount, STRP _strpContact, STRY _stryContract) external nonReentrant {
        require(_amount > 0, "Amount to be staked must be > 0");
        _totalSupply = _totalSupply + _amount;
        _balances[msg.sender] = _balances[msg.sender] + _amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        yelds[msg.sender] = earned(msg.sender);
        strip(msg.sender, _amount, _strpContact, _stryContract);
        emit Staked(msg.sender, _amount);
    } */

    /*function strip(address _stakedTokenDepositor, uint _amount, STRP _strpContact, STRY _stryContract) internal nonReentrant {

        //strpToken = IERC20(_strpToken);
        //stryToken = IERC20(_stryToken);
        _strpContact.mint(_stakedTokenDepositor, _amount);
        _stryContract.mint(_stakedTokenDepositor, _amount);
        console.log('strip _stakedTokenDepositor : ', _stakedTokenDepositor);
        console.log('strip _amount : ', _stakedTokenDepositor);
        console.log( 'strip : stryToken.balanceOf(_stakedTokenDepositor) ', stryToken.balanceOf(_stakedTokenDepositor));
        console.log('strip _amount : ', _stakedTokenDepositor);
    }*/

    /**
    @notice Allows the user to withdraw the staked tokens
    @param _amount the amount to be withdrawn
     */
    function withdraw(uint _amount) public nonReentrant resetYeld(msg.sender){
        require(_amount > 0, "Must withrow a positive value");
        uint256 tempBalance = _balances[msg.sender];
        require (_amount <= tempBalance, "You don't have enough tokens");
        _totalSupply = _totalSupply - _amount;
        //console.log('avant withdraw _balances of : ', address(this),' is ', _balances[address(this)]);
        //console.log('avant withdraw _balances of : ', msg.sender,' is ', _balances[msg.sender]);
        _balances[msg.sender] = _balances[msg.sender] - _amount ;
        //console.log('apres withdraw _balances of : ', address(this),' is ', _balances[address(this)]);
        //console.log('apres withdraw _balances of : ', msg.sender,' is ', _balances[msg.sender]);
        stakingToken.safeTransfer(msg.sender, _amount);
        //stakingToken.safeTransferFrom(address(this), msg.sender, _amount);
        //console.log('apres safe transfer');
        emit Withdrawn(msg.sender, _amount);
    }

    /**
    @notice  Claim the yelds */
    function claimYeld() public nonReentrant resetYeld(msg.sender) {
        uint256 yeld = yelds[msg.sender];
        console.log('claim  : yelds ', yeld);
        require (yeld>0, "You have no yelds");
        yelds[msg.sender] = 0;
        yeldsToken.safeTransfer(msg.sender, yeld+1);
        emit YeldPaid(msg.sender, yeld);
    }

    /**
    @notice Withdraw the total of the amount staked */
    function exit() external {
        withdraw(_balances[msg.sender]);
        claimYeld();
        emit Exit(msg.sender, _balances[msg.sender]);
    }

    function setYeldAmount(uint256 _yeld) external onlyOwner {
        if (block.timestamp >= periodFinish) {
            yeldRate = _yeld / yeldDuration;
            console.log('setYeldAmount: block.timestamp ds if',block.timestamp);
            console.log('setYeldAmount: periodFinish ds if',periodFinish);
            console.log('setYeldAmount: period ds if',block.timestamp-periodFinish);
            console.log('setYeldAmount: yeldRate ds if',yeldRate);
            console.log('setYeldAmount: _yeld ds if',_yeld);
            console.log('setYeldAmount: yeldDuration ds if',yeldDuration);
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * yeldRate;
            yeldRate = (_yeld + leftover)/yeldDuration;
            console.log('setYeldAmount: yeldRate ds else',yeldRate);
        }
        console.log('setYeldAmount :yeldRate', yeldRate );
        // Ensure the provided yeld amount is not more than the balance in the contract.
        // This keeps the yeld rate in the right range, preventing overflows due to
        // very high values of yeldRate in the earned and yeldPerToken functions;
        // Yeld + leftover must be less than 2^256 / 10^18 to avoid overflow.
        uint balance = yeldsToken.balanceOf(address(this));
        console.log('setYeldAmount :balance', balance );
        require(yeldRate <= balance / yeldDuration, "Provided amount too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + yeldDuration;
        console.log('setYeldAmount :lastUpdateTime', lastUpdateTime );
        console.log('setYeldAmount :periodFinish', periodFinish );
        console.log('setYeldAmount :_yeld after', _yeld );
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