/**
 * TODO
 * this file has not yet been refactored~
 */


import Discord from "discord.js";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // defer the interaction
   await interaction.deferReply({
      ephemeral: true
   });


   // files
   const files = [
      new Discord.AttachmentBuilder()
         .setFile(`./src/assets/select-roles/what-are-pronouns_brainpop.mp4`)
   ];


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents([
            new Discord.ButtonBuilder()
               .setLabel(`Further reading`)
               .setEmoji(`📰`)
               .setStyle(Discord.ButtonStyle.Link)
               .setURL(`https://uwm.edu/lgbtrc/support/gender-pronouns`)
         ])
   ];


   // edit the deferred interaction
   await interaction.editReply({
      files,
      components
   });
};