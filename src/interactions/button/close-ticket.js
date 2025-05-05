/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from  "../../data/roles.js";

import Discord from "discord.js";
import { colours } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button, reportingUserId, ticketNumber, confirmed ] = interaction.customId.split(`:`);


   // not a thread in report a player or ban appeals
   if (!interaction.channel.isThread() || ![ FloodedAreaCommunityChannels.ReportAPlayer, FloodedAreaCommunityChannels.BanAppeals ].includes(interaction.channel.parent?.id))
      return;


   // already confirmed to close
   if (confirmed === `true`)
      return await interaction.channel.delete();


   // only staff can close tickets
   if (!interaction.member.roles.cache.has(FloodedAreaCommunityRoles.ModerationTeam))
      return await interaction.reply({
         embeds: [
            new Discord.EmbedBuilder()
               .setColor(colours.flooded_area_bot)
               .setTitle(`❌ Cannot close ticket`)
               .setDescription(`> - Only a member of the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} can close tickets.`)
         ],
         ephemeral: true
      });


   // modal
   const modal = new Discord.ModalBuilder()
      .setCustomId(`close-ticket:${reportingUserId}:${ticketNumber}`)
      .setTitle(`🎫 Close ticket #${ticketNumber}`)
      .setComponents(
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`reason`)
                  .setLabel(`REASON`)
                  .setPlaceholder(`Why are you closing this ticket?`)
                  .setStyle(Discord.TextInputStyle.Paragraph)
                  .setMaxLength(1000)
                  .setRequired(true)
            )
      );


   // show the modal
   await interaction.showModal(modal);
};