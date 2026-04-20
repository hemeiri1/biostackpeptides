const BOT_TOKEN = "8646421634:AAG_W8RnlVymllinneGBeWpwhIy9nLYGXrc";
const CHAT_ID = "1206460013";

export async function sendTelegramMessage(text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  });
}

export async function sendTelegramPhoto(photoUrl: string, caption: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      photo: photoUrl,
      caption,
      parse_mode: "HTML",
    }),
  });
}
