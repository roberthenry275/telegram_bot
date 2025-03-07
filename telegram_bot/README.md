# Telegram Blockchain Tracker Bot

## Overview
This bot tracks transactions across multiple blockchains (Ethereum, Binance Smart Chain, Arbitrum, Solana, Pulsechain) and notifies a Telegram group about new transactions involving specific tokens.

## Features
- Track multiple wallets on different blockchains simultaneously.
- Notify Telegram group about transactions involving ETH/BNB/PLS/USDT/USDC/DAI tokens.
- Admins can manage tracked wallets, set RNC token rate, and enable or disable specific blockchains for tracking.

## Setup
1. Create a new bot using BotFather on Telegram and obtain the `BOT_TOKEN`.
2. Set environment variables for `BOT_TOKEN`, `INFURA_PROJECT_ID`, `ARBITRUM_API_KEY`, `SOLANA_API_KEY`, and `COINMARKETCAP_API_KEY`.
3. Update `config.js` with admin IDs and Telegram group ID.

## Installation
```bash
npm install
```

## Run
```bash
npm start
```

## Commands
- `/start`: Adds the bot to a group and promotes it to admin.
- `/help`: Displays the list of available commands.
- `/addwallets <address1> <address2> ...`: Adds multiple wallet addresses to the tracking list.
- `/removewallet <address>`: Removes a wallet address from the tracking list.
- `/setrate <rate>`: Sets the rate for RNC.