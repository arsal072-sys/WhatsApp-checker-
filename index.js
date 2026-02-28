const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const TeleBot = require('telebot');

const bot = new TeleBot('8675357851:AAG3NuVS8UI11qTreh3lS5hjmTCuJM53N_s');

async function startWA() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });
    sock.ev.on('creds.update', saveCreds);

    bot.on('text', async (msg) => {
        let nums = msg.text.split(/\s+/).filter(n => /^\d+$/.test(n));
        if (nums.length === 0) return;
        let sentMsg = await bot.sendMessage(msg.chat.id, "🛰️ **Scanning Numbers...**");
        let reg = []; let notReg = [];
        for (let num of nums) {
            const [result] = await sock.onWhatsApp(`${num}@s.whatsapp.net`);
            if (result && result.exists) { reg.push(`✅ \`${num}\``); }
            else { notReg.push(`❌ \`${num}\``); }
        }
        let report = `✅ **Results**\n\n📊 Total: ${nums.length}\n✅ Registered: ${reg.length}\n❌ Not Registered: ${notReg.length}\n\n`;
        if (reg.length > 0) report += `**Registered:**\n${reg.join('\n')}\n\n`;
        if (notReg.length > 0) report += `**Not Registered:**\n${notReg.join('\n')}`;
        bot.editMessageText({ chatID: msg.chat.id, messageID: sentMsg.message_id }, report, { parseMode: 'Markdown' });
    });
    bot.start();
}
startWA();

