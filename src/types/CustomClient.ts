import { Client, Collection } from 'discord.js';
import path from 'path';
import requireAll from 'require-all';

import { handleEvent } from '../utils/Handlers';
import { Command } from './Command';
import { Event } from './DiscordEvent';

export default class CustomClient extends Client {
  commands: Collection<string, Command> = new Collection();

  constructor() {
    super({
      intents: 3243773,
    });
  }

  async start() {
    await this.resolveModules();
    await this.login(process.env.DISCORD_TOKEN);
  }

  async resolveModules() {
    const sharedSettings = {
      recursive: true,
      filter: /\w*.[tj]s/g,
    };

    requireAll({
      ...sharedSettings,
      dirname: path.join(__dirname, '../commands'),
      resolve: (x) => {
        const command = x.default as Command;

        if (command.disabled) return;
        if (command.permissions) command.builder.setDefaultPermission(false);

        console.log(`Command '${command.builder.name}' registered.`);
        this.commands.set(command.builder.name, command);
      },
    });

    requireAll({
      ...sharedSettings,
      dirname: path.join(__dirname, '../events'),
      resolve: (x) => {
        const event = x.default as Event;
        console.log(`Event '${event.name}' registered.`);
        handleEvent(this, event);
      },
    });
  }

  async deployCommands() {
    if (!process.env.GUILD_ID) return;

    const guild = this.guilds.cache.get(process.env.GUILD_ID);
    const commandsJSON = [...this.commands.values()].map((x) => x.builder.toJSON());
    await guild?.commands.set(commandsJSON);
  }
}
