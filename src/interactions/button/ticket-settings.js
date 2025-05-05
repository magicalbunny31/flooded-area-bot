/**
 * TODO
 * this file has not yet been refactored~
 */


import Discord from "discord.js";
import { colours, strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button ] = interaction.customId.split(`:`);


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(colours.flooded_area_bot)
         .setTitle(`🔧 Ticket Settings`)
         .setDescription(strip`
            ### ${interaction.client.allEmojis.bun_paw_wave} Hello, ${interaction.user}!
            > - Change your settings for tickets below...
         `)
         .setFooter({
            text: `this needs redoing soon ~bunny` // TODO
         })
   ];


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.StringSelectMenuBuilder()
               .setCustomId(`ticket-settings-menu`)
               .setPlaceholder(`⚙️ Select a setting...`)
               .setOptions(
                  new Discord.StringSelectMenuOptionBuilder()
                     .setEmoji(`📢`)
                     .setLabel(`Mentions`)
                     .setDescription(`Select what ticket reasons you want to be notified for.`)
                     .setValue(`mentions`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setEmoji(`🔕`)
                     .setLabel(`Muted members`)
                     .setDescription(`Mute tickets created by specific members.`)
                     .setValue(`members`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setEmoji(`🔨`)
                     .setLabel(`Ban appeals`)
                     .setDescription(`Enable or disable ban appeal notifications.`)
                     .setValue(`ban-appeals`)
               )
         )
   ];


   // reply to the interaction
   await interaction.reply({
      embeds,
      components,
      ephemeral: true
   });
};