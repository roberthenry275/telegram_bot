require('dotenv').config();

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    GROUP_ID: null,  // Will be set dynamically when the bot is added to a group
    ARBITRUM_API_KEY: process.env.ARBITRUM_API_KEY,
    SOLANA_API_KEY: process.env.SOLANA_API_KEY,
    PULSECHAIN_URL: 'https://scan.mypinata.cloud/ipfs/bafybeih3olry3is4e4lzm7rus5l3h6zrphcal5a7ayfkhzm5oivjro2cp4',
    COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY
};