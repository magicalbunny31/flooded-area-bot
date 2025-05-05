/**
 * TODO
 * this file has not yet been refactored~
 */


import cache from "../../data/cache.js";

import Discord from "discord.js";
import dayjs from "dayjs";
import { colours, strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ModalSubmitInteraction} interaction
 */
export default async interaction => {
   // modal info
   const [ _modal, interactionId ] = interaction.customId.split(`:`);


   // fields
   const name        = interaction.fields.getTextInputValue(`name`)       .trim();
   const description = interaction.fields.getTextInputValue(`description`).trim();


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(colours.flooded_area_bot)
         .setTitle(`🗓️ Creating scheduled event`)
   ];


   // no reason
   if (!name)
      return await interaction.reply({
         embeds: [
            embeds[0]
               .setDescription(strip`
                  ### ❌ Cannot create scheduled event
                  > - You must input an event topic.
               `)
         ],
         ephemeral: true
      });


   // cache the fields
   const data = cache.get(interactionId);

   cache.set(interactionId, {
      ...data,
      name,
      description
   });


   // current timestamp for the event
   let timestamp = dayjs().startOf(`hour`).add(1, `hour`).unix();


   // embeds
   embeds[0]
      .setDescription(strip`
         ### ⌚ Select a date and time
         > - At ${Discord.time(timestamp, Discord.TimestampStyles.LongDateTime)}.
      `);


   // components
   const day  = 86400;
   const hour = 3600;

   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`create-event:${interactionId}:${timestamp}:${-day}`)
               .setLabel(`-1 day`)
               .setEmoji(`⏮️`)
               .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
               .setCustomId(`create-event:${interactionId}:${timestamp}:${-hour}`)
               .setLabel(`-1 hour`)
               .setEmoji(`⬅️`)
               .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
               .setCustomId(`create-event:${interactionId}:${timestamp}:${hour}`)
               .setLabel(`+1 hour`)
               .setEmoji(`➡️`)
               .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
               .setCustomId(`create-event:${interactionId}:${timestamp}:${day}`)
               .setLabel(`+1 day`)
               .setEmoji(`⏭️`)
               .setStyle(Discord.ButtonStyle.Primary)
         ),
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`create-event:${interactionId}:${timestamp}`)
               .setLabel(`Confirm date!`)
               .setEmoji(`🗓️`)
               .setStyle(Discord.ButtonStyle.Success)
         )
   ];


   // reply to the interaction
   await interaction.reply({
      embeds,
      components,
      ephemeral: true
   });
};