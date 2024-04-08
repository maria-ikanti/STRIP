# Projet Final : STRIP

## Pour correction :

Lien vidéo: à définir

Lien Déploiement Vercel: https://strip-sigma.vercel.app/stake

## Testnet
Contrats déployés et vérifiés sur Sépolia aux adresses :
STRU : 0x6b4824bE66d4e928D5DF3C08114A6ba2500B49Ce
Staking : 0x460CBd5C8AEEc7d23de8a8663cC3108a8390cA05

https://sepolia.etherscan.io/address/0x460CBd5C8AEEc7d23de8a8663cC3108a8390cA05
https://sepolia.etherscan.io/address/0x6b4824bE66d4e928D5DF3C08114A6ba2500B49Ce


## Détails

### Conception
![Fonctionnement global](https://strip-sigma.vercel.app/conception1.png)

![Fonctionnement détaillé](https://strip-sigma.vercel.app/conception2.png)

### Testing
Voici le coverage de mes tests

```
--------------|----------|----------|----------|----------|----------------|
File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------|----------|----------|----------|----------|----------------|
 contracts/   |      100 |       90 |      100 |      100 |                |
  STRP.sol    |      100 |      100 |      100 |      100 |                |
  STRU.sol    |      100 |      100 |      100 |      100 |                |
  STRY.sol    |      100 |      100 |      100 |      100 |                |
  Staking.sol |      100 |    79.41 |      100 |      100 |                |
--------------|----------|----------|----------|----------|----------------|
All files     |      100 |       90 |      100 |      100 |                |
--------------|----------|----------|----------|----------|----------------|
```

### Ecrans front

![Mint](https://strip-sigma.vercel.app/mint.png)

![Stake & Strip](https://strip-sigma.vercel.app/stakeAndStrip.png)

![Claim rewards](https://strip-sigma.vercel.app/claim.png)

![Withdraw](https://strip-sigma.vercel.app/withdraw.png)

