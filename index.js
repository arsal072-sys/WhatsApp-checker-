const TeleBot = require('telebot');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

// ✅ Telegram Token from Render ENV
const bot = new TeleBot(8675357851:AAGEJwDDHGn7WE4PCoekMW96E8brnjAbSrA);

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('🚀 SCAN THIS QR CODE:\n');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log('✅ WHATSAPP CONNECTED!');
        }

        if (connection === 'close') {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            console.log('❌ Connection closed. Reconnecting...', shouldReconnect);

            if (shouldReconnect) {
                connectToWhatsApp();
            }
        }
    });
}

// Telegram Start Command
bot.on('/start', (msg) => {
    msg.reply('🤖 Bot is Online & WhatsApp QR generating in logs!');
});

bot.start()
    .then(() => console.log('✅ Telegram Bot Started'))
    .catch(err => console.log('Telegram Error:', err));

// Start WhatsApp
connectToWhatsApp();
