const axios = require('axios');
const Web3 = require('web3');
const { TelegramNotifier } = require('./telegramNotifier');
const { formatMessage, getUsdConversion } = require('../utils/helpers');
const { getWallets, getRate, getBlockchainStatus } = require('../utils/database');
const { PULSECHAIN_URL, ARBITRUM_API_KEY, SOLANA_API_KEY } = require('../config');

class BlockchainTracker {
    constructor() {
        this.telegramNotifier = new TelegramNotifier();
        this.w3_eth = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + process.env.INFURA_PROJECT_ID));
        this.w3_bsc = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
    }

    async trackTransactions() {
        while (true) {
            const wallets = await getWallets();
            if (!Array.isArray(wallets)) {
                console.error('Expected wallets to be an array but got:', wallets);
                await new Promise(resolve => setTimeout(resolve, 30000));  // Wait and try again
                continue;
            }
            const rate = await getRate();
            for (const { address: wallet, blockchain } of wallets) {
                if (await getBlockchainStatus(blockchain)) {
                    let balance = 0;
                    let usdValue = 0;
                    let message = '';
                    switch (blockchain) {
                        case 'ETH':
                            balance = await this.w3_eth.eth.getBalance(wallet);
                            usdValue = await getUsdConversion('ETH') * balance;
                            message = formatMessage(balance, 'ETH', rate, usdValue, wallet);
                            break;
                        case 'BNB':
                            balance = await this.w3_bsc.eth.getBalance(wallet);
                            usdValue = await getUsdConversion('BNB') * balance;
                            message = formatMessage(balance, 'BNB', rate, usdValue, wallet);
                            break;
                        case 'PLS':
                            balance = await this.getPulsechainBalance(wallet);
                            usdValue = await getUsdConversion('PLS') * balance;
                            message = formatMessage(balance, 'PLS', rate, usdValue, wallet);
                            break;
                        case 'ARB':
                            balance = await this.getArbitrumBalance(wallet);
                            usdValue = await getUsdConversion('ARB') * balance;
                            message = formatMessage(balance, 'ARB', rate, usdValue, wallet);
                            break;
                        case 'SOL':
                            balance = await this.getSolanaBalance(wallet);
                            usdValue = await getUsdConversion('SOL') * balance;
                            message = formatMessage(balance, 'SOL', rate, usdValue, wallet);
                            break;
                    }
                    if (balance > 0) {
                        this.telegramNotifier.sendMessage(message);
                    }
                }
            }
            await new Promise(resolve => setTimeout(resolve, 30000));  // Check every 30 seconds
        }
    }

    async getPulsechainBalance(wallet) {
        const response = await axios.get(`${PULSECHAIN_URL}/#/address/${wallet}`);
        const result = response.data.match(/<span class="balance">([\d,]+)<\/span>/);
        return result ? parseFloat(result[1].replace(/,/g, '')) : 0;
    }

    async getArbitrumBalance(wallet) {
        const response = await axios.get(`https://api.arbiscan.io/api?module=account&action=balance&address=${wallet}&apikey=${ARBITRUM_API_KEY}`);
        return response.data.result ? parseFloat(response.data.result) : 0;
    }

    async getSolanaBalance(wallet) {
        const response = await axios.get(`https://api.solscan.io/account/${wallet}`);
        return response.data.lamports ? parseFloat(response.data.lamports) / 1e9 : 0;
    }

    startTracking() {
        this.trackTransactions();
    }
}

module.exports = { BlockchainTracker };