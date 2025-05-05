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
      .setCustomId(`bot-model-submission`)
      .setTitle(`submit level`)
      .setComponents(
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`model`)
                  .setLabel(`MODEL`)
                  .setPlaceholder(`input the model's link or asset id here..`)
                  .setStyle(Discord.TextInputStyle.Short)
                  .setRequired(true)
            )
      );


   // show the modal
   await interaction.showModal(modal);
};