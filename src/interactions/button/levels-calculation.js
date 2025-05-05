/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../../data/guilds.js";

import Discord from "discord.js";
import { colours, strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button ] = interaction.customId.split(`:`);


   // data to show
   const data = {
      [FloodedAreaCommunity]: {
         colour: colours.flooded_area_bot
      },

      [UniverseLaboratories]: {
         colour: colours.purple
      }
   }[interaction.guild.id];


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(data.colour)
         .setTitle(`❓ How are levels calculated?`)
         .setFields({
            name: `💬 Get experience from \`level\``,
            value: strip`
               \`\`\`
               10 × level²
               \`\`\`
            `,
            inline: true
         }, {
            name: `🏅 Get level from \`experience\``,
            value: strip`
               \`\`\`
               sqrt(experience ÷ 10)
               \`\`\`
            `,
            inline: true
         }, {
            name: `📈 Levelling as a function on a graph`,
            value: `> https://www.desmos.com/calculator/ubodcrzxou`
         })
   ];


   // reply to the interaction
   await interaction.reply({
      embeds,
      ephemeral: true
   });
};