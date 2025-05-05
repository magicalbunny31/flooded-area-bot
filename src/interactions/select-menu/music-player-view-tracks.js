/**
 * TODO
 * this file has not yet been refactored~
 */


import { BunnyFurFest, FloodedAreaCommunity } from "../../data/guilds.js";
import musicPlayer from "../../data/music-player.js";

import Discord from "discord.js";
import { colours } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").StringSelectMenuInteraction} interaction
 */
export default async interaction => {
   // select menu info
   const [ _selectMenu ] = interaction.customId.split(`:`);
   const [ categoryId ] = interaction.values;


   // data to show
   const experienceData = {
      [BunnyFurFest]: {
         colour: colours.flooded_area_bot
      },

      [FloodedAreaCommunity]: {
         colour: colours.flooded_area_bot
      }
   }[interaction.guild.id];


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(experienceData.colour)
         .setAuthor({
            name: `Music Player`,
            iconURL: `attachment://Music_Player.webp`
         })
         .setDescription(
            musicPlayer[experienceData.name]
               .filter(data => data.categoryId === categoryId)
               .map(data => `- ${Discord.hyperlink(data.name, `https://create.roblox.com/marketplace/asset/${data.robloxAssetId}`)}`)
               .join(`\n`)
         )
   ];

   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.StringSelectMenuBuilder()
               .setCustomId(`music-player-view-tracks`)
               .setPlaceholder(`Select a category...`)
               .setOptions(
                  musicPlayer[experienceData.name]
                     .filter((value, index, self) =>
                        index === self.findIndex(t => t.categoryId === value.categoryId)
                     )
                     .map(data =>
                        new Discord.StringSelectMenuOptionBuilder()
                           .setValue(data.categoryId)
                           .setLabel(data.categoryName)
                           .setEmoji(data.emoji)
                           .setDefault(data.categoryId === categoryId)
                     )
               )
         )
   ];


   // respond to the interaction
   const payload = {
      embeds,
      components
   };

   const isSameCommandUser = interaction.user.id === interaction.message.interaction?.user.id;
   const isEphemeral = interaction.message.flags.has(Discord.MessageFlags.Ephemeral);

   if (isSameCommandUser || isEphemeral)
      await interaction.update(payload);
   else
      await interaction.reply({
         ...payload,
         ephemeral: true
      });
};