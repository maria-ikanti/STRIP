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
    uint256 public periodFinish;
    uint256 public yeldRate;
    uint256 public yeldDuration = 1 hours;
    uint256 public lastUpdateTime;
    uint256 public yeldsPerTokenStored;

    mapping(address => uint256) public userYeldsPerTokenPaid;
    mapping(address => uint256) public yelds;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    constructor(address _inToken, address _outToken) Ownable(msg.sender) {
        inToken = IERC20(_inToken);
        outToken = IERC20(_outToken);
    }

    /**
    @notice A modifier to be executed on any deposit or withdrow 
     */
    modifier updateYeld(address account) {
        yeldsPerTokenStored = yeldPerToken();
        lastUpdateTime = lastTimeYeldApplicable();

        if (account != address(0)) {
            yelds[account] = gain(account);
            userYeldsPerTokenPaid[account] = yeldsPerTokenStored;
        }
        _;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function lastTimeYeldApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function yeldPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return yeldsPerTokenStored;
        }
        uint256 periodApplicable = lastTimeYeldApplicable() - lastUpdateTime;
        return periodApplicable*yeldRate*1e18/_totalSupply;
    }

    /**
    @notice Returns the total earned by an accont 
     */
    function gain(address account) public view returns (uint256) {
        return _balances[account]*(yeldPerToken()-userYeldsPerTokenPaid[account])/1e18 + yelds[account];
    }

    /**
    @notice Gets the yeld for a given duration
     */
    function getYeldForDuration() external view returns (uint256) {
        return yeldRate*yeldDuration;
    }


    function stake(uint256 amount) external nonReentrant updateYeld(msg.sender) {
        require(amount > 0, "Amount to be staked must be > 0");
        _totalSupply = _totalSupply + amount;
        _balances[msg.sender] = _balances[msg.sender] + amount;
        outToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant updateYeld(msg.sender) {
        require(amount > 0, "Must withrow a positive value");
        _totalSupply = _totalSupply - amount;
        _balances[msg.sender] = _balances[msg.sender] - amount ;
        outToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function getYeld() public nonReentrant updateYeld(msg.sender) {
        uint256 yeld = yelds[msg.sender];
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