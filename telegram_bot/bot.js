const express = require('express');
const { Telegraf } = require('telegraf');
const { BOT_TOKEN, GROUP_ID } = require('./config');
const { BlockchainTracker } = require('./services/blockchainTracker');
const { TelegramNotifier } = require('./services/telegramNotifier');
const { initializeDatabase, addWallet, removeWallet, setRate } = require('./utils/database');

const app = express();
const port = process.env.PORT || 3000;

// Initialize the bot
const bot = new Telegraf(BOT_TOKEN);
initializeDatabase();

const blockchainTracker = new BlockchainTracker();
const telegramNotifier = new TelegramNotifier(BOT_TOKEN, GROUP_ID);

bot.start((ctx) => {
    const userId = ctx.message.from.id;
    if (ctx.message.chat.type === 'group' || ctx.message.chat.type === 'supergroup') {
        const chatId = ctx.message.chat.id;
        ctx.getChatMember(chatId, userId).then((chatMember) => {
            if (chatMember.status === 'administrator' || chatMember.status === 'creator') {
                global.GROUP_ID = chatId;
                ctx.reply('Bot has been added to the group and promoted as admin.');
            } else {
                ctx.reply('You need to be an admin to add me to the group.');
            }
        });
    } else {
        ctx.reply('Please add me to a group and promote me as admin.');
    }
});

bot.help((ctx) => {
    ctx.reply('/addwallets <address1> <address2> ...\n/removewallet <address>\n/setrate <rate>');
});

bot.command('addwallets', (ctx) => {
    const userId = ctx.message.from.id;
    if (ctx.getChatMember(ctx.message.chat.id, userId).status === 'administrator' ||
        ctx.getChatMember(ctx.message.chat.id, userId).status === 'creator') {
        const addresses = ctx.message.text.split(' ').slice(1);
        addresses.forEach((address) => {
            addWallet(address, 'ETH');  // Assuming ETH for simplicity, modify as needed
        });
        ctx.reply(`Wallets ${addresses.join(', ')} added for tracking.`);
    }
});

bot.command('removewallet', (ctx) => {
    const userId = ctx.message.from.id;
    if (ctx.getChatMember(ctx.message.chat.id, userId).status === 'administrator' ||
        ctx.getChatMember(ctx.message.chat.id, userId).status === 'creator') {
        const address = ctx.message.text.split(' ')[1];
        removeWallet(address);
        ctx.reply(`Wallet ${address} removed from tracking.`);
    }
});

bot.command('setrate', (ctx) => {
    const userId = ctx.message.from.id;
    if (ctx.getChatMember(ctx.message.chat.id, userId).status === 'administrator' ||
        ctx.getChatMember(ctx.message.chat.id, userId).status === 'creator') {
        const rate = parseFloat(ctx.message.text.split(' ')[1]);
        setRate(rate);
        ctx.reply(`Rate set to ${rate}.`);
    }
});

blockchainTracker.startTracking();

bot.launch();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});