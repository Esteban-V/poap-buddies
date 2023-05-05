import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../types/Command';
import { error, success } from '../utils/Messages';
import { getInCommonPOAPS } from '../services/POAP';
import { processAddress } from '../utils/POAP';

const createCommonPOAPsFields = ({ commonPOAPS }) => [
  {
    name: '\u200D\u200D\u200D\u200B\u200B',
    value: `⌚ Your oldest common POAP is \`${commonPOAPS[0].event.name}\`, dated **${new Date(
      commonPOAPS[0].event.start_date,
    ).toLocaleDateString()}**\n[View details 🔗](https://poap.gallery/event/${commonPOAPS[0].event.id})\n\u200B`,
  },
  ...commonPOAPS.slice(1, 4).map((poap) => ({
    name: poap.event.name,
    value: `[View details 🔗](https://poap.gallery/event/${poap.event.id})`,
    inline: true,
  })),
];

export default new Command({
  builder: new SlashCommandBuilder()
    .addStringOption((o) => o.setName('address').setDescription('Your address or ens').setRequired(true))
    .addStringOption((o) => o.setName('another_address').setDescription("Buddy's address or ens").setRequired(true))
    .setName('checkbud')
    .setDescription('✨ Check your friendship status with your buddy'),
  usage: '/checkbud <address> <another_address>',
  run: async ({ interaction }: { interaction: CommandInteraction }) => {
    if (!interaction.guild || !interaction.guildId) return;

    const address1 = interaction.options.get('address', true).value as string;
    const address2 = interaction.options.get('another_address', true).value as string;

    if (!address1 || !address2) {
      return await interaction.followUp({
        ephemeral: true,
        embeds: [error().setDescription('Please provide two addresses.')],
      });
    }

    const { commonPOAPS, commonPct = 0, differentPOAPS = 0, error: poapError } = await getInCommonPOAPS(address1, address2)

    if (poapError) {
      return await interaction.followUp({
        ephemeral: true,
        embeds: [error().setDescription(poapError)],
      });
    }

    if (!commonPOAPS.length) {
      return await interaction.followUp({
        ephemeral: true,
        embeds: [error().setDescription('You have no POAPs in common with this address.')],
      });
    }

    const fields = createCommonPOAPsFields({ commonPOAPS });

    try {
      const embed = success()
        .setTitle(`POAPs in common \`(${processAddress(address1)} -> ${processAddress(address2)})\``)
        .setDescription(
          `:sparkles: Out of **${differentPOAPS} total POAPs**, you both have **${commonPOAPS.length} POAPs** [${commonPct}%] in common! :people_hugging:`,
        )
        .addFields(fields)
        .setColor('#800080')
        .setThumbnail(commonPOAPS[0].event.image_url)
        .setTimestamp();

      await interaction.followUp({
        embeds: [embed],
      });
    } catch (error) {
      console.log(error);
    }
  },
});
