const TeleBot = require('telebot');
// Yahan badlav kiya hai (whiskeysockets use hoga)
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

const bot = new TeleBot(`8675357851:AAFTBqWMTjtVDHBiFE7qK2U9hWjlBLNUnaA');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        printQRInTerminal: true, // Ye seedha terminal mein QR dikhayega
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if(qr) {
            console.log('🚀 SCAN THIS QR CODE:');
            qrcode.generate(qr, {small: true});
        }
        if(connection === 'open') {
            console.log('✅ WHATSAPP CONNECTED!');
        }
    });
}

bot.on('/start', (msg) => msg.reply('Bot is Online! 🚀'));
bot.start();
connectToWhatsApp();
