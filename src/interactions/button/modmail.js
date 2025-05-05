/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import Discord from "discord.js";
import { colours, choice, strip } from "@magicalbunny31/pawesome-utility-stuffs";


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


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(colours.flooded_area_bot)
         .setTitle(`📬 Modmail Submissions`)
         .setDescription(strip`
            ### ${interaction.client.allEmojis.bun_paw_wave} ${choice([ `Hello`, `Hi`, `Welcome` ])}, ${interaction.user}!
            > - Anyone can submit ${interaction.channel} to send a message, or server-related question to the ${Discord.roleMention(FloodedAreaCommunityRoles.HeadOfModeration)}.

            ### ✅ You can submit modmail for...
            > - A message to the ${Discord.roleMention(FloodedAreaCommunityRoles.HeadOfModeration)}
            > - A server-related query or question
            > - Claiming a prize in ${Discord.channelMention(FloodedAreaCommunityChannels.Giveaways)}
            > - Reporting a person where we would be able to look into their behaviour/the situation more in depth
            > - Issues with moderation in this server
            > - Help on something about this server

            ### ❌ You cannot submit modmail for...
            > - Reporting a person actively causing harm in chat, ping the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)}
            > - Reporting players in ${Discord.hyperlink(`Flooded Area`, `https://www.roblox.com/games/3976767347/Flooded-Area`)}, use ${Discord.channelMention(FloodedAreaCommunityChannels.ReportAPlayer)}
            > - Appealing against moderative actions in ${Discord.hyperlink(`Flooded Area`, `https://www.roblox.com/games/3976767347/Flooded-Area`)}, use ${Discord.channelMention(FloodedAreaCommunityChannels.BanAppeals)}
            > - Reporting bugs in ${Discord.hyperlink(`Flooded Area`, `https://www.roblox.com/games/3976767347/Flooded-Area`)}, use ${Discord.channelMention(FloodedAreaCommunityChannels.BugReports)}
            > - Sending silly messages for no reason

            ### 🚨 Ping the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} instead if there's an active situation in chat (like a raid or someone being racist)
            > - Do not bring up personal issues in ${interaction.channel} messages if it's not relevant.
         `)
         .setFooter({
            text: strip`
               "thank you mimi" ~bunny 🐰
               Press the button below to open a form.
            `
         })
   ];


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`create-modmail`)
               .setLabel(`Create modmail`)
               .setEmoji(`🗒️`)
               .setStyle(Discord.ButtonStyle.Success)
         )
   ];


   // edit the deferred interaction
   await interaction.editReply({
      embeds,
      components
   });
};