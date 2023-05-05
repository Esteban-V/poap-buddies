import { EmbedBuilder } from 'discord.js';

/**
 * Template for success messages
 */
export const success = () => {
  const embed = new EmbedBuilder();
  embed.setColor('#00FF00');
  embed.setTitle('Successful');
  return embed;
};

/**
 * Template for error messages
 */
export const error = () => {
  const embed = new EmbedBuilder();
  embed.setColor('#FF0000');
  embed.setTitle('Error');
  return embed;
};
