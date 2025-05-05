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
   const [ _button, itemSeller ] = interaction.customId.split(`:`);


   // modal
   const modal = new Discord.ModalBuilder()
      .setCustomId(`currency-buy-shop-item:${itemSeller}`)
      .setTitle(`🛍️ Buy item`)
      .setComponents(
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`quantity`)
                  .setLabel(`HOW MUCH OF THIS ITEM DO YOU WANT TO BUY?`)
                  .setPlaceholder(`Enter a number from 1-50...`)
                  .setStyle(Discord.TextInputStyle.Short)
                  .setMaxLength(2)
                  .setRequired(true)
            )
      );


   // show the modal
   await interaction.showModal(modal);
};