import { CommandInteraction, GuildMember } from 'discord.js';
import CustomClient from '../types/CustomClient';
import { Event } from '../types/DiscordEvent';
import { error } from './Messages';
import CustomInteraction from '../types/CustomInteraction';

/**
 * Handles the event
 * @param client Custom client
 * @param event Event object
 */
export function handleEvent(client: CustomClient, event: Event) {
  const avoidException = async (...args: any[]) => {
    try {
      await event.run(client, ...args);
    } catch (error) {
      console.error(`An error occurred in '${event.name}' event.\n${error}\n`);
    }
  };

  client.on(event.name, avoidException);
}

/**
 * Handles the command
 * @param client Custom client
 * @param interaction Command interaction
 */
export async function handleCommand(client: CustomClient, interaction: CommandInteraction) {
  await interaction.deferReply();

  const { commandName } = interaction;
  const command = client.commands.get(commandName);

  if (!command) {
    return await interaction.followUp({
      ephemeral: true,
      embeds: [error().setDescription('Command not found.')],
    });
  }

  const member = interaction.member as GuildMember;

  if (command.permissions?.some((p) => !member.permissions.has(p))) {
    return await interaction.followUp({
      ephemeral: true,
      embeds: [error().setDescription('You do not have permission to run this command.')],
    });
  }

  try {
    await command.run({
      client,
      interaction: interaction as CustomInteraction,
    });
  } catch (err) {
    console.error(`An error occurred in '${command.builder.name}' command.\n${err}\n`);

    return await interaction.followUp({
      ephemeral: true,
      embeds: [error().setDescription(err as string)],
    });
  }
}
