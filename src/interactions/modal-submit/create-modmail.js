/**
 * TODO
 * this file has not yet been refactored~
 */


import cache from "../../data/cache.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import Discord from "discord.js";
import { colours, strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ModalSubmitInteraction} interaction
 */
export default async interaction => {
   // modal info
   const [ _modal ] = interaction.customId.split(`:`);

   const id = interaction.id;


   // "defer" the interaction
   await interaction.update({
      embeds: [
         new Discord.EmbedBuilder()
            .setColor(colours.flooded_area_bot)
            .setTitle(`📬 Modmail Submissions`)
            .setDescription(`${interaction.client.allEmojis.loading} Your message is loading...`)
      ],
      components: []
   });



   // fields
   const content = interaction.fields.getTextInputValue(`content`).trim();


   // set this data in the cache
   cache.set(id, {
      content
   });


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(interaction.user.accentColor || (await interaction.user.fetch(true)).accentColor || colours.flooded_area_bot)
         .setAuthor({
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.displayName === interaction.user.username
               ? `@${interaction.user.username}`
               : strip`
                  ${interaction.user.displayName}
                  @${interaction.user.username}
               `
         })
         .setDescription(content)
   ];


   // errors in the report data
   const invalidReport = !content;

   const errors = [
      ...!content
         ? [{
            name: `You must input a message.`,
            value: `> The ${Discord.roleMention(FloodedAreaCommunityRoles.HeadOfModeration)} won't know why you're sending ${interaction.channel}.`
         }]
         : []
   ];

   if (invalidReport)
      embeds.push(
         new Discord.EmbedBuilder()
            .setColor(colours.red)
            .setTitle(`💥 You can't send this message just yet.`)
            .setFields(errors)
      );


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`submit-modmail`)
               .setLabel(`Submit modmail`)
               .setEmoji(`📬`)
               .setStyle(Discord.ButtonStyle.Success)
               .setDisabled(invalidReport),
            new Discord.ButtonBuilder()
               .setCustomId(`create-modmail:${id}`)
               .setLabel(`Edit modmail`)
               .setEmoji(`🗒️`)
               .setStyle(Discord.ButtonStyle.Secondary)
         )
   ];


   // edit the interaction's original reply
   await interaction.editReply({
      embeds,
      components
   });
};