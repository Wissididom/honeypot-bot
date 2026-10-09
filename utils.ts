import { GuildMemberManager, User } from "discord.js";

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function fetchMember(
  memberManager: GuildMemberManager,
  user: User | string,
) {
  try {
    return await memberManager.fetch(user);
  } catch (err) {
    if (!(err instanceof Error)) {
      throw err;
    }
    if (err.name == "DiscordAPIError[10007]") {
      return null;
    }
    throw err;
  }
}
