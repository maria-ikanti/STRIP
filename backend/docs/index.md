# Solidity API

## Lock

### unlockTime

```solidity
uint256 unlockTime
```

### owner

```solidity
address payable owner
```

### Withdrawal

```solidity
event Withdrawal(uint256 amount, uint256 when)
```

### constructor

```solidity
constructor(uint256 _unlockTime) public payable
```

### withdraw

```solidity
function withdraw() public
```

## STRP

### Minted

```solidity
event Minted(address receiver, uint256 amount)
```

### Allowed

```solidity
event Allowed(address receiver, uint256 amount)
```

### constructor

```solidity
constructor() public
```

### mint

```solidity
function mint(address _recipient, uint256 _amount) external
```

Mint Faucet
	@param _recipient receiver address
	@param _amount to be minted

### increaseAllow

```solidity
function increaseAllow(address _recipient, uint256 _amount) external
```

Increase allowance Faucet
	@param _recipient receiver address
	@param _amount to be allowed

### receive

```solidity
receive() external payable
```

Recevie implementation for security reasons

### fallback

```solidity
fallback() external payable
```

Fallback implementation for security reasons

## STRU

### Minted

```solidity
event Minted(address receiver, uint256 amount)
```

### Allowed

```solidity
event Allowed(address receiver, uint256 amount)
```

### constructor

```solidity
constructor() public
```

### mint

```solidity
function mint(address _recipient, uint256 _amount) external
```

Mint Faucet
	@param _recipient receiver address
	@param _amount to be minted

### increaseAllow

```solidity
function increaseAllow(address _sender, address _recipient, uint256 _amount) external
```

Increase allowance Faucet
	@param _recipient receiver address
	@param _amount to be allowed

### receive

```solidity
receive() external payable
```

Recevie implementation for security reasons

### fallback

```solidity
fallback() external payable
```

Fallback implementation for security reasons

## STRY

### Minted

```solidity
event Minted(address receiver, uint256 amount)
```

### Allowed

```solidity
event Allowed(address receiver, uint256 amount)
```

### constructor

```solidity
constructor() public
```

### mint

```solidity
function mint(address _recipient, uint256 _amount) external
```

Mint Faucet
	@param _recipient receiver address
	@param _amount to be minted

### increaseAllow

```solidity
function increaseAllow(address _recipient, uint256 _amount) external
```

Increase allowance Faucet
	@param _recipient receiver address
	@param _amount to be allowed

### receive

```solidity
receive() external payable
```

Recevie implementation for security reasons

### fallback

```solidity
fallback() external payable
```

Fallback implementation for security reasons

## YeldAdded

```solidity
event YeldAdded(uint256 reward)
```

## Staked

```solidity
event Staked(address user, uint256 amount)
```

## Withdrawn

```solidity
event Withdrawn(address user, uint256 amount)
```

## YeldPaid

```solidity
event YeldPaid(address user, uint256 reward)
```

## YeldDurationUpdated

```solidity
event YeldDurationUpdated(uint256 newDuration)
```

## PeriodFinishedUpdated

```solidity
event PeriodFinishedUpdated(uint256 newPeriodFinished)
```

## Recovered

```solidity
event Recovered(address token, uint256 amount)
```

## Exit

```solidity
event Exit(address sender, uint256 amount)
```

## Staking

### inToken

```solidity
contract IERC20 inToken
```

### outToken

```solidity
contract IERC20 outToken
```

### periodFinish

```solidity
uint256 periodFinish
```

### yeldRate

```solidity
uint256 yeldRate
```

### yeldDuration

```solidity
uint256 yeldDuration
```

### lastUpdateTime

```solidity
uint256 lastUpdateTime
```

### yeldsPerTokenStored

```solidity
uint256 yeldsPerTokenStored
```

### userYeldsPerTokenPaid

```solidity
mapping(address => uint256) userYeldsPerTokenPaid
```

Yelds already payed for each staked token

### yelds

```solidity
mapping(address => uint256) yelds
```

### constructor

```solidity
constructor(address _inToken, address _outToken, uint256 _yeldRate, uint256 _yeldDuration) public
```

### resetYeld

```solidity
modifier resetYeld(address _account)
```

A modifier to be executed on any deposit or withdrow

### yeldPerToken

```solidity
function yeldPerToken() public view returns (uint256)
```

returns the yelds earned for each token staked

### lastTimeYeldApplicable

```solidity
function lastTimeYeldApplicable() public view returns (uint256)
```

The last time the yeld was applied
    @return uint256 period (datetime)

### earned

```solidity
function earned(address _account) public view returns (uint256)
```

Returns the total earned by a given account

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

returns the total supply of the ERC20 token
    @return uint256 the total supply

### balanceOf

```solidity
function balanceOf(address _account) external view returns (uint256)
```

Return the balance of an account
    @return uint256 the balance of the account

### getYeldForDuration

```solidity
function getYeldForDuration() external view returns (uint256)
```

Gets the yeld for a given duration
    @return uint256 the yeld for a given duration

### stake

```solidity
function stake(address _address, uint256 _amount) external
```

the main staking function. Stakes the ERC20 token for a given address in the smart contact
    @param _address the adress of the user that will stake his tokens
    @param _amount the amount of the tokens to be staked

### withdraw

```solidity
function withdraw(uint256 _amount) public
```

Allows the user to withdraw the staked tokens
    @param _amount the amount to be withdrawn

### claimYeld

```solidity
function claimYeld() public
```

Claim the yelds

### exit

```solidity
function exit() external
```

Withdraw the total of the amount staked

### setYeldDuration

```solidity
function setYeldDuration(uint256 _yeldDuration) external
```

