# Novis Koin

A static, client-side decentralized application (DApp) and landing page for the **Novis Koin** presale. Users connect a Web3 wallet (MetaMask), view live presale progress, and buy presale tokens with BNB on Binance Smart Chain by calling the on-chain `Crowdsale` contract directly from the browser.

> Heads up: this is a front-end-only project. There is no backend, no database, and no server-side secrets. All blockchain interaction happens in the user's wallet.

## Features

- Connect / disconnect MetaMask (BSC mainnet & testnet)
- Live presale stats read from the contract: tokens sold, BNB raised, progress bar, current rate
- BNB-to-Novis amount calculator
- One-click `buyTokens()` purchase flow with transaction confirmation
- Light/dark mode toggle

## Tech stack

- HTML5, CSS3 (no framework)
- Vanilla JavaScript (ES modules)
- [ethers.js v5.6](https://docs.ethers.org/v5/) (vendored, ESM build)
- Solidity `^0.8` presale contract (`assets/auth/presale.sol`) using OpenZeppelin `Ownable`, `IERC20`, `SafeMath`
- Hosted on GitHub Pages

## Project structure

```
.
├── index.html              # Single-page app shell
├── assets/
│   ├── auth/
│   │   ├── index.js        # Wallet connect + buy/read contract logic
│   │   ├── constants.js    # Contract address + ABI (public)
│   │   ├── presale.sol     # Crowdsale smart contract source
│   │   └── ethers-5.6.esm.min.js
│   ├── css/style.css
│   ├── js/main.js          # Theme toggle
│   └── images/ , video/
└── favicon.png
```

## Running locally

Because `index.js` is loaded as an ES module, opening `index.html` via `file://` will hit CORS restrictions. Serve it over HTTP instead:

```bash
# Python 3
python3 -m http.server 8080
# then open http://localhost:8080
```

You will need the MetaMask browser extension and some BSC testnet BNB to exercise the purchase flow.

## Configuration

- The presale contract address and ABI live in `assets/auth/constants.js`.
- The app expects Binance Smart Chain (chainId `0x38` mainnet / `0x61` testnet). If you redeploy the contract, update `contractAddress` accordingly.

## Screenshot

<!-- TODO: add a screenshot of the DApp UI here -->
![Novis Koin DApp screenshot](./assets/images/screenshot.png)

## Live demo

https://mfahadiqbalofcl.github.io/Novis-Koin/

## Disclaimer

This is an unaudited demo presale contract and interface. Do not send real funds to it without an independent security audit. Provided as-is for educational/portfolio purposes.

## License

Released under the [MIT License](./LICENSE).