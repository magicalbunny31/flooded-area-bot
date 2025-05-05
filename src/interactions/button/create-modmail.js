/**
 * TODO
 * this file has not yet been refactored~
 */


import cache from "../../data/cache.js";

import Discord from "discord.js";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button, id ] = interaction.customId.split(`:`);


   // modal
   const modal = new Discord.ModalBuilder()
      .setCustomId(`create-modmail`)
      .setTitle(`📬 Modmail Submissions`)
      .setComponents(
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`content`)
                  .setLabel(`MODMAIL CONTENT`)
                  .setPlaceholder(`What would you like to send to the Head of Moderation?`)
                  .setStyle(Discord.TextInputStyle.Paragraph)
                  .setMaxLength(4000)
                  .setRequired(true)
            )
      );


   // the current fields for editing a report
   if (id) {
      const data = cache.get(id);

      if (data.content)
         modal.components[0].components[0].setValue(data.content);
   };


   // show the modal
   await interaction.showModal(modal);
};