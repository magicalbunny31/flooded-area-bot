/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../../data/guilds.js";

import Discord from "discord.js";


export const guilds = [ FloodedAreaCommunity, UniverseLaboratories ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`jump-to-top`)
   .setDescription(`Go to the first message of this channel`);


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // defer the interaction
   await interaction.deferReply({
      ephemeral: true
   });


   // fetch this channel's first message
   const firstMessage = await (async () => {
      const messages = await interaction.channel.messages.fetch({ limit: 1, after: interaction.channel.id });
      return messages?.first();
   })();


   // this channel probably has no message
   if (!firstMessage)
      return await interaction.editReply({
         content: `### ❌ Failed to fetch message`
      });


   // edit the deferred interaction
   await interaction.editReply({
      components: [
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.ButtonBuilder()
                  .setLabel(`Go to message`)
                  .setStyle(Discord.ButtonStyle.Link)
                  .setURL(firstMessage.url)
            )
      ]
   });
};