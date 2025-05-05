/**
 * TODO
 * this file has not yet been refactored~
 */


/**
 * @param {import("@flooded-area-bot-types/client").StringSelectMenuInteraction} interaction
 */
export default async interaction => {
   // select menu info
   const [ _selectMenu ] = interaction.customId.split(`:`);
   const [ enabled ] = interaction.values;


   // defer the interaction's update
   await interaction.deferUpdate();


   // set these strings in the database
   await interaction.client.firestoreLegacy.collection(`tickets`).doc(interaction.guild.id).update({
      [`moderators.${interaction.user.id}.ban-appeals`]: enabled === `true`
   });
};