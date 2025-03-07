const { Telegraf } = require('telegraf');
const { BOT_TOKEN, GROUP_ID } = require('../config');

class TelegramNotifier {
    constructor(token = BOT_TOKEN, chatId = GROUP_ID) {
        this.bot = new Telegraf(token);
        this.chatId = chatId;
    }

    sendMessage(message) {
        this.bot.telegram.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    }
}

module.exports = { TelegramNotifier };