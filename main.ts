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
const token = Deno.env.get("TOKEN");

const exitHandler = (signal: Deno.Signal) => {
  console.log(`Received ${signal}`);
  Deno.exit(0);
};

Deno.addSignalListener("SIGINT", () => exitHandler("SIGINT"));
Deno.addSignalListener("SIGTERM", () => exitHandler("SIGTERM"));

self.addEventListener("error", (event) => {
  console.error("Uncaught Exception:", event.error);
  Deno.exit(1);
});
self.addEventListener("unhandledrejection", (event) => {
  console.log(`Unhandled Rejection:`, event.reason);
  Deno.exit(1);
});

bot.on(Events.ClientReady, () => {
  console.log(`Logged in as ${bot.user?.tag}!`);
  bot.user?.setActivity({
    name: "bots",
    type: ActivityType.Watching,
  });
});

bot.on(Events.MessageCreate, async (message) => {
  if (message.author.system || message.author.bot || message.webhookId) return;
  if (Deno.env.has("HONEYPOT_CHANNEL")) {
    await handleHoneypot(
      message,
      Deno.env.get("HONEYPOT_CHANNEL")!,
      Deno.env.get("HONEYPOT_LOG_CHANNEL") ?? null,
    );
  }
});
bot.login(token);
