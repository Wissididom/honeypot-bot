import 'dotenv/config';
import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import { handleHoneypot } from "./honeypot.ts";

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
  ],
});
const token = process.env.TOKEN;

bot.on(Events.ClientReady, () => {
  console.log(`Logged in as ${bot.user?.tag}!`);
  bot.user?.setActivity({
    name: "bots",
    type: ActivityType.Watching,
  });
});

bot.on(Events.MessageCreate, async (message) => {
  if (message.author.system || message.author.bot || message.webhookId) return;
  if (process.env.HONEYPOT_CHANNEL) {
    await handleHoneypot(
      message,
      process.env.HONEYPOT_CHANNEL,
      process.env.HONEYPOT_LOG_CHANNEL ?? null,
    );
  }
});
bot.login(token);
