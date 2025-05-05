/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity } from "../../data/guilds.js";

import Discord from "discord.js";
import { colours, strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ModalSubmitInteraction} interaction
 */
export default async interaction => {
   // modal info
   const [ _modal, to, modmailId, modmailSender, replyId ] = interaction.customId.split(`:`);

   const id = interaction.id;


   // defer the interaction's update
   await interaction.deferUpdate();


   // fields
   const content = interaction.fields.getTextInputValue(`content`).trim();


   // embeds
   const messageEmbed = new Discord.EmbedBuilder()
      .setColor(interaction.user.accentColor || (await interaction.user.fetch(true)).accentColor || colours.flooded_area)
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
      .setFooter({
         text: strip`
            🌊 Flooded Area Modmail
            📬 Keep your DMs on to receive and respond to messages.
         `
      });


   /// send a dm to the user of the modmail
   const dm = await (async () => {
      try {
         const user = await interaction.client.users.fetch(modmailSender);
         return await user.send({
            embeds: [
               messageEmbed
            ],
            components: [
               new Discord.ActionRowBuilder()
                  .setComponents(
                     new Discord.ButtonBuilder()
                        .setCustomId(`add-to-modmail:to-mod:${modmailId}:${modmailSender}:${replyId}`)
                        .setLabel(`Reply`)
                        .setStyle(Discord.ButtonStyle.Primary)
                  )
            ],
            reply: {
               messageReference: replyId !== `null`
                  ? replyId
                  : null
            }
         });

      } catch {
         // couldn't send the dm
         return null;
      };
   })();


   // add to the modmail's thread
   const guild = await interaction.client.guilds.fetch(FloodedAreaCommunity);
   const thread = await guild.channels.fetch(modmailId);

   await thread.send({
      embeds: [
         messageEmbed
            .setFooter({
               text: null
            })
      ],
      components: [
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.ButtonBuilder()
                  .setCustomId(`add-to-modmail:to-user:${modmailId}:${modmailSender}:${dm?.id}`)
                  .setLabel(`Reply`)
                  .setStyle(Discord.ButtonStyle.Primary)
            )
      ]
   });
};