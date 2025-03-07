const axios = require('axios');
const { COINMARKETCAP_API_KEY } = require('../config');

async function getUsdConversion(cryptoSymbol) {
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${cryptoSymbol}`, {
        headers: {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        }
    });
    return response.data.data[cryptoSymbol].quote.USD.price;
}

function formatMessage(amount, token, rate, usdValue, wallet) {
    return `
    🔊🔊🔊   New Buy $RNC:
    
    Spent : ${amount} ${token} in $${usdValue.toFixed(2)} USD
    Got : ${(amount / rate).toFixed(2)} $RNC
    Rate : ${rate} $ RNC
    Explorer link: [Click here](https://etherscan.io/address/${wallet})
    `;
}

module.exports = {
    getUsdConversion,
    formatMessage
};