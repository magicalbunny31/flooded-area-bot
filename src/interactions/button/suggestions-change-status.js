/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import Discord from "discord.js";
import { strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button, action ] = interaction.customId.split(`:`);


   // this member isn't staff
   if (!interaction.member.roles.cache.has(FloodedAreaCommunityRoles.ModerationTeam))
      return await interaction.reply({
         content: strip`
            ### ❌ Can't update post
            > - You must be part of the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} to do this.
         `,
         ephemeral: true
      });


   // this isn't a suggestion thread
   if (![ FloodedAreaCommunityChannels.GameSuggestions, FloodedAreaCommunityChannels.ServerSuggestions, FloodedAreaCommunityChannels.PartSuggestions ].includes(interaction.channel?.parent?.id))
      return await interaction.reply({
         content: strip`
            ### ❌ Can't update post
            > - This isn't a post in ${Discord.channelMention(FloodedAreaCommunityChannels.GameSuggestions)}, ${Discord.channelMention(FloodedAreaCommunityChannels.ServerSuggestions)}, or ${Discord.channelMention(FloodedAreaCommunityChannels.PartSuggestions)}.
         `,
         ephemeral: true
      });


   // defer the interaction
   await interaction.deferReply({
      ephemeral: true
   });


   // do this action
   switch (action) {


      case `lock`: {
         // lock this post
         await interaction.channel.setLocked(true);

         // edit the deferred interaction
         return await interaction.editReply({
            content: strip`
               ### ✅ Post updated
               > - ${interaction.channel} has been locked.
            `
         });
      };


      case `close`: {
         // lock this post
         await interaction.channel.setLocked(true);

         // close this post
         await interaction.channel.setArchived(true);

         // edit the deferred interaction
         return await interaction.editReply({
            content: strip`
               ### ✅ Post updated
               > - ${interaction.channel} has been locked and closed.
            `
         });
      };


   };
};