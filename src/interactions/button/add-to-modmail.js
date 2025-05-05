/**
 * TODO
 * this file has not yet been refactored~
 */


import Discord from "discord.js";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button, to, modmailId, modmailSender, replyId ] = interaction.customId.split(`:`);


   // modal
   const modal = new Discord.ModalBuilder()
      .setCustomId(`add-to-modmail:${to}:${modmailId}:${modmailSender}:${replyId}`)
      .setTitle(`📬 Sending Modmail Message`)
      .setComponents(
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`content`)
                  .setLabel(`MODMAIL CONTENT`)
                  .setPlaceholder(
                     to === `to-mod`
                        ? `What would you like to send to the Head of Moderation?`
                        : `What would you like to send to this person?`
                  )
                  .setStyle(Discord.TextInputStyle.Paragraph)
                  .setMaxLength(4000)
                  .setRequired(true)
            )
      );


   // show the modal
   await interaction.showModal(modal);
};