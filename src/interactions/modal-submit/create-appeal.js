/**
 * TODO
 * this file has not yet been refactored~
 */


import cache from "../../data/cache.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";
import userAgent from "../../data/user-agent.js";

import Discord from "discord.js";
import { colours, set, strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ModalSubmitInteraction} interaction
 */
export default async interaction => {
   // modal info
   const [ _modal ] = interaction.customId.split(`:`);

   const id = interaction.id;


   // "defer" the interaction
   await interaction.update({
      embeds: [
         new Discord.EmbedBuilder()
            .setColor(colours.flooded_area_bot)
            .setTitle(`🔨 Ban Appeals`)
            .setDescription(`${interaction.client.allEmojis.loading} Your appeal is loading...`)
      ],
      components: []
   });


   // the user's bloxlink linked account
   const bloxlinkLinkedAccount = cache.get(`bloxlink-linked-account`)?.[interaction.user.id];


   // fields
   const bannedPlayerUsername = interaction.fields.getTextInputValue(`banned-player`) .trim();
   const banReason            = interaction.fields.getTextInputValue(`ban-reason`)    .trim();
   const whyReconsider        = interaction.fields.getTextInputValue(`why-reconsider`).trim();


   // get the banned player
   const [ bannedPlayerData ] = await (async () => {
      const response = await fetch(`https://users.roblox.com/v1/usernames/users`, {
         method: `POST`,
         headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "User-Agent": userAgent
         },
         body: JSON.stringify({
            usernames: set(
               [
                  bannedPlayerUsername
               ]
                  .filter(Boolean)
            )
         })
      });

      if (!response.ok)
         return null;

      const { data } = await response.json();
      return [
         data.find(player => player.name?.toLowerCase() === bannedPlayerUsername.toLowerCase())
      ];
   })();


   const formattedBannedPlayer = strip`
      ${
         bannedPlayerData && bloxlinkLinkedAccount && bannedPlayerData?.id !== bloxlinkLinkedAccount?.id
            ? `> ${
               Discord.strikethrough(
                  Discord.hyperlink(`${bloxlinkLinkedAccount.displayName} (@${bloxlinkLinkedAccount.name})`, `https://www.roblox.com/users/${bloxlinkLinkedAccount.id}/profile`)
               )
            }`
            : ``
      }
      > ${
         bannedPlayerData
            ? Discord.hyperlink(`${bannedPlayerData.displayName} (@${bannedPlayerData.name})`, `https://www.roblox.com/users/${bannedPlayerData.id}/profile`)
            : bannedPlayerUsername
               ? `@${bannedPlayerUsername} ❓`
               : `\`not set\``
      }
   `;


   // set this data in the cache
   cache.set(id, {
      bannedPlayerUsername,
      banReason,
      whyReconsider
   });


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(interaction.user.accentColor || (await interaction.user.fetch(true)).accentColor || colours.flooded_area_bot)
         .setTitle(`🔨 Ban Appeals`)
         .setFields({
            name: `YOUR ROBLOX ACCOUNT`,
            value: formattedBannedPlayer
         }, {
            name: `WHY YOU WERE BANNED`,
            value: `>>> ${banReason || `\`not set\``}`
         }, {
            name: `WHY YOU BELIEVE WE SHOULD RECONSIDER IT`,
            value: `>>> ${whyReconsider || `\`not set\``}`
         })
         .setFooter({
            text: `Your appeal will not be sent until you confirm it below.`
         })
   ];


   // errors in the report data
   const invalidReport = (!bannedPlayerData || !bannedPlayerUsername) || (!whyReconsider);

   const errors = [
      ...!bannedPlayerUsername
         ? [{
            name: `Well, what account are you making an appeal for?!`,
            value: `> - Without it, the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} will be unsure on who to unban.`
         }]
         : !bannedPlayerData
            ? [{
               name: `Hmm, @${bannedPlayerUsername} doesn't seem to be a Roblox account.`,
               value: `> - You must input a valid Roblox account in order to create a ban appeal.`
            }]
            : [],

      ...!whyReconsider
         ? [{
            name: `You must input why we should reconsider your ban.`,
            value: `> The ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} may use this to decide on the outcome of your appeal.`
         }]
         : []
   ];

   if (invalidReport)
      embeds.push(
         new Discord.EmbedBuilder()
            .setColor(colours.red)
            .setTitle(`💥 You can't send this appeal just yet.`)
            .setFields(errors)
      );


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`submit-appeal`)
               .setLabel(`Submit appeal`)
               .setEmoji(`📬`)
               .setStyle(Discord.ButtonStyle.Success)
               .setDisabled(invalidReport),
            new Discord.ButtonBuilder()
               .setCustomId(`create-appeal:${id}`)
               .setLabel(`Edit appeal`)
               .setEmoji(`🗒️`)
               .setStyle(Discord.ButtonStyle.Secondary)
         )
   ];


   // edit the interaction's original reply
   await interaction.editReply({
      embeds,
      components
   });
};