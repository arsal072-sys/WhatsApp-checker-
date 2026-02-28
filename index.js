const TeleBot = require('telebot');
const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');

// Tera Naya Token (Already Updated)
const bot = new TeleBot('8675357851:AAEnrZ7Pzd1yDGJl-KlOLgECF4RjkRdolEM');

async function connectToWhatsApp() {
    const conn = new WAConnection();

    // Jab QR Code generate hoga, wo terminal mein dikhega
    conn.on('qr', qr => {
        console.log('🚀 BOT ONLINE! SCAN THIS QR CODE BELOW:');
        console.log('------------------------------------------');
        // Baileys library apne aap terminal mein QR print karti hai
    });

    // Jab WhatsApp connect ho jaye
    conn.on('open', () => {
        console.log('✅ WHATSAPP CONNECTED SUCCESSFULLY!');
        const authInfo = conn.base64EncodedAuthInfo();
        fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'));
    });

    // Connection start
    await conn.connect().catch(err => console.log("WA Connect Error: " + err));
}

// Telegram Bot Commands
bot.on('/start', (msg) => msg.reply('WhatsApp Checker Bot is Running! 🚀'));

// Bot Start Karo
bot.start();
connectToWhatsApp().catch(err => console.log("Main Error: " + err));

console.log('🚀 Service Started... Checking for QR Code...');
