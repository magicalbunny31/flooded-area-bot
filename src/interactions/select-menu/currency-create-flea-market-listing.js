/**
 * TODO
 * this file has not yet been refactored~
 */


import Discord from "discord.js";


/**
 * @param {import("@flooded-area-bot-types/client").StringSelectMenuInteraction} interaction
 */
export default async interaction => {
   // select menu info
   const [ _selectMenu ] = interaction.customId.split(`:`);
   const [ itemSellerIdOrName ] = interaction.values;


   // modal
   const modal = new Discord.ModalBuilder()
      .setCustomId(`currency-create-flea-market-listing:${itemSellerIdOrName}`)
      .setTitle(`💸 List an item on the flea market`)
      .setComponents(
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`price`)
                  .setLabel(`HOW MUCH DO YOU WANT TO LIST IT FOR?`)
                  .setPlaceholder(`Enter a number from 1-999999...`)
                  .setStyle(Discord.TextInputStyle.Short)
                  .setMaxLength(6)
                  .setRequired(true)
            )
      );


   // show the modal
   await interaction.showModal(modal);
};