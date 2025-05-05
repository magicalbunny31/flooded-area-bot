/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import { FloodedAreaCommunity } from "../../data/guilds.js";

import Discord from "discord.js";
import { colours, choice, strip } from "@magicalbunny31/pawesome-utility-stuffs";


export const data = new Discord.SlashCommandBuilder()
   .setName(`modmail`)
   .setDescription(`Submit modmail to Flooded Area Community's Moderation Team`);


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // defer the interaction
   await interaction.deferReply({
      ephemeral: true
   });


   // this command was run in a guild not from flooded area community
   if (interaction.inGuild() && interaction.guild.id !== FloodedAreaCommunity)
      return await interaction.editReply({
         content: strip`
            ### 📬 ${Discord.chatInputApplicationCommandMention(interaction.commandName, interaction.commandId)} is for submitting modmail in Flooded Area Community
            > - To use it, run this command in my DMs, or in Flooded Area Community.
            >  - https://discord.com/invite/flooded-area-community-977254354589462618
            > - Have an issue in this server? Contact its staff for help!
         `
      });


   // function to return a link to a channel in flooded area community
   const toLink = id => id
      ? `https://discord.com/channels/${FloodedAreaCommunity}/${id}`
      : `https://discord.com/channels/${FloodedAreaCommunity}`;


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(colours.flooded_area_bot)
         .setTitle(`📬 Modmail Submissions`)
         .setDescription(strip`
            ### ${interaction.client.allEmojis.bun_paw_wave} ${choice([ `Hello`, `Hi`, `Welcome` ])}, ${interaction.user}!
            > - Anyone can submit \`modmail\` to send a message, or server-related question to the \`Head of Moderation\`.

            ### ✅ You can submit modmail for...
            > - A message to the \`Head of Moderation\`
            > - A server-related query or question
            > - Claiming a prize in ${toLink(FloodedAreaCommunityChannels.Giveaways)}
            > - Reporting a person where we would be able to look into their behaviour/the situation more in depth
            > - Issues with moderation in this server
            > - Help on something about this server

            ### ❌ You cannot submit modmail for...
            > - Reporting a person actively causing harm in chat, ping the \`Moderation Team\`
            > - Reporting players in ${Discord.hyperlink(`Flooded Area`, `https://www.roblox.com/games/3976767347/Flooded-Area`)}, use ${toLink(FloodedAreaCommunityChannels.ReportAPlayer)}
            > - Appealing against moderative actions in ${Discord.hyperlink(`Flooded Area`, `https://www.roblox.com/games/3976767347/Flooded-Area`)}, use ${toLink(FloodedAreaCommunityChannels.BanAppeals)}
            > - Reporting bugs in ${Discord.hyperlink(`Flooded Area`, `https://www.roblox.com/games/3976767347/Flooded-Area`)}, use ${toLink(FloodedAreaCommunityChannels.BugReports)}
            > - Sending silly messages for no reason

            ### 🚨 Ping the \`Moderation Team\` instead if there's an active situation in chat (like a raid or someone being racist)
            > - Do not bring up personal issues in \`modmail\` messages if it's not relevant.
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