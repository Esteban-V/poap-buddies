import { Interaction } from "discord.js";

import { handleCommand } from "../utils/Handlers";
import { Event } from "../types/DiscordEvent";

export default new Event({
  name: "interactionCreate",
  run: async (client, interaction: Interaction) => {
    if (interaction.isCommand()) {
      await handleCommand(client, interaction);
    }
  },
});
