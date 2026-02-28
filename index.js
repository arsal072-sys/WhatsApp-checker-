const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const TeleBot = require('telebot');

// Naya Token Updated
const bot = new TeleBot('8675357851:AAFTG0vj6wwySSz_L99uFe6JKYZJm3HGWF4');

async function startWA() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });
    sock.ev.on('creds.update', saveCreds);

    bot.on('text', async (msg) => {
        let nums = msg.text.split(/\s+/).filter(n => /^\d+$/.test(n));
        if (nums.length === 0) return;
        let sentMsg = await bot.sendMessage(msg.chat.id, "🛰️ **Scanning...**");
        let reg = []; let notReg = [];
        for (let num of nums) {
            try {
                const [result] = await sock.onWhatsApp(`${num}@s.whatsapp.net`);
                if (result && result.exists) { reg.push(`✅ \`${num}\``); }
                else { notReg.push(`❌ \`${num}\``); }
            } catch (e) {}
        }
        let report = `📊 **Results**\n\n✅ Registered: ${reg.length}\n❌ Not Registered: ${notReg.length}\n\n${reg.join('\n')}\n${notReg.join('\n')}`;
        bot.sendMessage(msg.chat.id, report, { parseMode: 'Markdown' });
    });
    bot.start();
}
startWA();
console.log("🚀 Bot is Online!");
