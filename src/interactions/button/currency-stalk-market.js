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
   const [ _button, type ] = interaction.customId.split(`:`);

   const isBuying = type === `buy-carrots`;


   // modal
   const modal = new Discord.ModalBuilder()
      .setCustomId(`currency-stalk-market:${type}`)
      .setTitle(
         isBuying
            ? `💳 Buy carrots`
            : `💰 Sell carrots`
      )
      .setComponents(
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`quantity`)
                  .setLabel(`HOW MANY CARROTS WILL YOU ${isBuying ? `BUY` : `SELL`}?`)
                  .setPlaceholder(`Enter a number from 1-999...`)
                  .setStyle(Discord.TextInputStyle.Short)
                  .setMaxLength(3)
                  .setRequired(true)
            )
      );


   // show the modal
   await interaction.showModal(modal);
};