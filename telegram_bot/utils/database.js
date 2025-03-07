const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('bot_data.db');

function initializeDatabase() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS wallets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                address TEXT NOT NULL,
                blockchain TEXT NOT NULL
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS blockchain_status (
                blockchain TEXT PRIMARY KEY,
                status INTEGER NOT NULL
            )
        `);
        const blockchains = ['ETH', 'BNB', 'PLS', 'ARB', 'SOL'];
        blockchains.forEach((blockchain) => {
            db.run('INSERT OR IGNORE INTO blockchain_status (blockchain, status) VALUES (?, 1)', [blockchain]);
        });
    });
}

function addWallet(address, blockchain) {
    db.run('INSERT INTO wallets (address, blockchain) VALUES (?, ?)', [address, blockchain]);
}

function removeWallet(address) {
    db.run('DELETE FROM wallets WHERE address = ?', [address]);
}

function getWallets() {
    return new Promise((resolve, reject) => {
        db.all('SELECT address, blockchain FROM wallets', [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows || []); // Ensure an array is returned
        });
    });
}

function setRate(rate) {
    db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['rate', rate.toString()]);
}

function getRate() {
    return new Promise((resolve, reject) => {
        db.get('SELECT value FROM settings WHERE key = ?', ['rate'], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row ? parseFloat(row.value) : 0.000112);
        });
    });
}

function setBlockchainStatus(blockchain, status) {
    db.run('INSERT OR REPLACE INTO blockchain_status (blockchain, status) VALUES (?, ?)', [blockchain, status ? 1 : 0]);
}

function getBlockchainStatus(blockchain) {
    return new Promise((resolve, reject) => {
        db.get('SELECT status FROM blockchain_status WHERE blockchain = ?', [blockchain], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(!!row.status);
        });
    });
}

module.exports = {
    initializeDatabase,
    addWallet,
    removeWallet,
    getWallets,
    setRate,
    getRate,
    setBlockchainStatus,
    getBlockchainStatus
};