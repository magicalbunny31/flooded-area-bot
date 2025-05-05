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
   const [ _button ] = interaction.customId.split(`:`);


   // modal
   const modal = new Discord.ModalBuilder()
      .setCustomId(`currency-increase-personal-shop-item-quantity`)
      .setTitle(`📦 Increase item quantity`)
      .setComponents(
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`quantity`)
                  .setLabel(`INCREASE THIS ITEM'S QUANTITY BY`)
                  .setPlaceholder(`Enter a number from 1-50...`)
                  .setStyle(Discord.TextInputStyle.Short)
                  .setMaxLength(2)
                  .setRequired(true)
            )
      );


   // show the modal
   await interaction.showModal(modal);
};