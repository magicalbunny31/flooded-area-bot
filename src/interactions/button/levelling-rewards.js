/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../../data/guilds.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import Discord from "discord.js";
import { colours, strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button ] = interaction.customId.split(`:`);


   // defer the interaction
   await interaction.deferReply({
      ephemeral: true
   });


   // data to show
   const data = {
      [FloodedAreaCommunity]: {
         colour: colours.flooded_area_bot
      },

      [UniverseLaboratories]: {
         colour: colours.purple
      }
   }[interaction.guild.id];


   // commands
   const commands = await interaction.guild.commands.fetch();
   const commandCurrencyId = commands.find(command => command.name === `currency`)?.id || 0;


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(data.colour)
         .setTitle(`📃 Levelling rewards`)
         .setFields(
            (() => {
               switch (interaction.guild.id) {
                  case FloodedAreaCommunity: return [{
                     name: `${interaction.client.allEmojis.shield} \`Level 5\``,
                     value: strip`
                        > - ${Discord.roleMention(FloodedAreaCommunityRoles.ImageEmbedPermissions)}
                     `
                  }];
                  case UniverseLaboratories: return [{
                     name: `❓ \`No levelling rewards.\``,
                     value: strip`
                        > - ${interaction.client.allEmojis.foxsleep}
                     `
                  }];
               };
            })()
         )
   ];


   // edit the deferred interaction
   await interaction.editReply({
      embeds
   });
};