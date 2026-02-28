const express = require("express");
const TeleBot = require("telebot");
const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason 
} = require("@whiskeysockets/baileys");

// ================= EXPRESS =================
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// ================= TELEGRAM =================
const bot = new TeleBot(process.env.TG_TOKEN);

bot.on("/start", (msg) => {
  return msg.reply("Telegram Bot Online ✅");
});

bot.start();

// ================= WHATSAPP =================
async function startWA() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ["RenderBot", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp Connected Successfully!");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log("❌ Connection closed.");
      
      if (shouldReconnect) {
        console.log("🔄 Reconnecting...");
        startWA();
      } else {
        console.log("⚠ Logged out. Delete service & redeploy.");
      }
    }
  });
}

startWA();
