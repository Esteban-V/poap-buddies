import { Event } from "../types/DiscordEvent";

export default new Event({
  name: "ready",
  run: async (client) => {
    if (!client.user) return;
    client.application?.commands.set([], process.env.GUILD_ID || "");
    await client.deployCommands();
    console.log(`${client.user.tag} is ready!`);
  },
});
