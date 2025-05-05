/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity } from "../../data/guilds.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import Discord from "discord.js";


export const guilds = [ FloodedAreaCommunity ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`mention`)
   .setDescription(`@mention a role`)
   .addStringOption(
      new Discord.SlashCommandStringOption()
         .setName(`role`)
         .setDescription(`The role to @mention`)
         .setChoices({
            name: `Moderation Team`,
            value: FloodedAreaCommunityRoles.ModerationTeam
         }, {
            name: `Events`,
            value: FloodedAreaCommunityRoles.Events
         }, {
            name: `Opinions`,
            value: FloodedAreaCommunityRoles.Opinions
         }, {
            name: `Giveaways`,
            value:FloodedAreaCommunityRoles.Giveaways
         }, {
            name: `Challenges`,
            value: FloodedAreaCommunityRoles.Challenges
         }, {
            name: `Playtest`,
            value: FloodedAreaCommunityRoles.Playtest
         })
         .setRequired(true)
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // options
   const role = interaction.options.getString(`role`);


   // the role to mention
   const roleToMention = Discord.roleMention(role);


   // this member's roles
   const roles = interaction.member.roles.cache;


   // @Moderation Team or @Event Host role needed to @mention @Events
   if (![ FloodedAreaCommunityRoles.ModerationTeam, FloodedAreaCommunityRoles.EventHost ].some(administrativeRole => roles.has(administrativeRole)) && role === FloodedAreaCommunityRoles.Events)
      return await interaction.reply({
         content: `### ❌ You need the roles ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} or ${Discord.roleMention(FloodedAreaCommunityRoles.EventHost)} to @mention ${roleToMention}`,
         allowedMentions: {
            parse: []
         },
         ephemeral: true
      });


   // @Moderation Team or @Challenge Host role needed to @mention @Challenges
   if (![ FloodedAreaCommunityRoles.ModerationTeam, FloodedAreaCommunityRoles.ChallengeHost ].some(administrativeRole => roles.has(administrativeRole)) && role === FloodedAreaCommunityRoles.Challenges)
      return await interaction.reply({
         content: `### ❌ You need the roles ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} or ${Discord.roleMention(FloodedAreaCommunityRoles.ChallengeHost)} to @mention ${roleToMention}`,
         allowedMentions: {
            parse: []
         },
         ephemeral: true
      });


   // @Moderation Team role needed to @mention other roles
   if (!roles.has(FloodedAreaCommunityRoles.ModerationTeam) && ![ FloodedAreaCommunityRoles.Events, FloodedAreaCommunityRoles.Challenges ].includes(role))
      return await interaction.reply({
         content: `### ❌ You need the role ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} to @mention ${roleToMention}`,
         allowedMentions: {
            parse: []
         },
         ephemeral: true
      });


   // @mention this role
   await interaction.reply({
      content: roleToMention,
      allowedMentions: {
         roles: [ role ]
      }
   });
};