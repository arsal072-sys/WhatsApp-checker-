const express = require("express");
const TeleBot = require("telebot");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

// ====== EXPRESS SERVER (Render ke liye zaroori) ======
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// ====== TELEGRAM BOT ======
const bot = new TeleBot("8675357851:AAFOw9r1LExgEd4Zfoh57Ku4sfycKA3O2Fw");

bot.on("/start", (msg) => {
  return msg.reply("Telegram Bot is Online 🚀");
});

bot.start();

// ====== WHATSAPP CONNECTION ======
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;

    if (qr) {
      console.log("Scan this QR code:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("WhatsApp Connected ✅");
    }

    if (connection === "close") {
      console.log("Connection closed ❌");
    }
  });
}

connectToWhatsApp();
