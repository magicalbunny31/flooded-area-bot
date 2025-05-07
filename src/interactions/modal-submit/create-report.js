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
   const [ _modal, type ] = interaction.customId.split(`:`);

   const id = interaction.id;


   // "defer" the interaction
   await interaction.update({
      embeds: [
         new Discord.EmbedBuilder()
            .setColor(colours.flooded_area_bot)
            .setTitle(`📣 Report a Player`)
            .setDescription(`${interaction.client.allEmojis.loading} Your report is loading...`)
      ],
      components: []
   });


   // the user's bloxlink linked account
   const bloxlinkLinkedAccount = cache.get(`bloxlink-linked-account`)?.[interaction.user.id];


   // fields
   const typeOfReport = {
      "false-votekicking": `Started a false votekick`,
      "bypassing":         `Bypassing, swearing, or being inappropriate in chat/game`,
      "toxicity":          `Being toxic or harassing others`,
      "bigotry":           `Bigotry`,
      "inappropriate":     `Has an inappropriate avatar or built something explicit or sexual`,
      "exploiting":        `Using exploits, cheats, or hacks`,
      "bug-abuse":         `Abusing a bug or glitch to gain an unfair advantage`,
      "ban-evasion":       `Evading a ban with an alt account`,
      "moderator-abuse":   `Moderator abusing their powers`,
      "other":             `Another reason...`
   }[type];

   const reportingPlayerUsername = interaction.fields.getTextInputValue(`reporting-player`).trim();
   const reportedPlayerUsername  = interaction.fields.getTextInputValue(`reported-player`) .trim();


   // get the reporting/reported players
   const [ reportingPlayerData, reportedPlayerData ] = await (async () => {
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
                  reportingPlayerUsername,
                  reportedPlayerUsername
               ]
                  .filter(Boolean)
            )
         })
      });

      if (!response.ok)
         return null;

      const { data } = await response.json();
      return [
         data.find(player => player.name?.toLowerCase() === reportingPlayerUsername.toLowerCase()),
         data.find(player => player.name?.toLowerCase() === reportedPlayerUsername .toLowerCase())
      ];
   })();

   const formattedReportingPlayer = strip`
      ${
         reportingPlayerData && bloxlinkLinkedAccount && reportingPlayerData?.id !== bloxlinkLinkedAccount?.id
            ? `> ${
               Discord.strikethrough(
                  Discord.hyperlink(`${bloxlinkLinkedAccount.displayName} (@${bloxlinkLinkedAccount.name})`, `https://www.roblox.com/users/${bloxlinkLinkedAccount.id}/profile`)
               )
            }`
            : ``
      }
      > ${
         reportingPlayerData
            ? Discord.hyperlink(`${reportingPlayerData.displayName} (@${reportingPlayerData.name})`, `https://www.roblox.com/users/${reportingPlayerData.id}/profile`)
            : reportingPlayerUsername
               ? `@${reportingPlayerUsername} ❓`
               : `\`not set\``
      }
   `;

   const formattedReportedPlayer = reportedPlayerData
      ? `> ${Discord.hyperlink(`${reportedPlayerData.displayName} (@${reportedPlayerData.name})`, `https://www.roblox.com/users/${reportedPlayerData.id}/profile`)}`
      : reportedPlayerUsername
         ? `> @${reportedPlayerUsername} ❓`
         : `> \`not set\``;


   // set this data in the cache
   cache.set(id, {
      reportingPlayerUsername,
      reportedPlayerUsername
   });


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(interaction.user.accentColor || (await interaction.user.fetch(true)).accentColor || colours.flooded_area_bot)
         .setTitle(`📣 Report a Player`)
         .setFields(
            [{
               name: `REPORT SUMMARY`,
               value: `> ${typeOfReport}`,
               inline: true
            },
            {
               name: `YOUR ROBLOX ACCOUNT`,
               value: formattedReportingPlayer,
               inline: true
            },
            {
               name: `PLAYER YOU'RE REPORTING`,
               value: formattedReportedPlayer,
               inline: true
            }]
         )
         .setFooter({
            text: `Your report will not be sent until you confirm it in the next channel.`
         })
   ];


   // errors in the report data
   const invalidReport = !reportedPlayerUsername;

   const errors = [
      ...!invalidReport
         ? [
            ...!reportingPlayerUsername
               ? [{
                  name: `Are you sure your Roblox username isn't needed?`,
                  value: strip`
                     > - Inputting a username may help the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} with your report.
                  `
               }]
               : !reportingPlayerData && reportingPlayerUsername
                  ? [{
                     name: `Hmm, @${reportingPlayerUsername} doesn't seem to be a Roblox account.`,
                     value: strip`
                        > - Did you type something wrong? It wouldn't hurt to correct it - it may even help the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} with your report.
                     `
                  }]
                  : [],

            ...!reportedPlayerData && reportedPlayerUsername
               ? [{
                  name: `Hmm, @${reportedPlayerUsername} doesn't seem to be a Roblox account.`,
                  value: strip`
                     > - Did you type something wrong? It wouldn't hurt to correct it - it may even help the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} with your report.
                     > - Or, if this is as much as you can remember, feel free to continue.
                  `
               }]
               : []
         ]

         : [
            ...!reportedPlayerUsername
               ? [{
                  name: `Well, who are you reporting?!`,
                  value: strip`
                     > - It helps the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} know exactly who you're reporting!
                     > - You can input anything, even if it's not a valid Roblox account, if you roughly remember parts of their username.
                  `
               }]
               : []
         ]
   ];

   if (errors.length)
      embeds.push(
         new Discord.EmbedBuilder()
            .setColor(
               !invalidReport
                  ? colours.orange
                  : colours.red
            )
            .setTitle(
               !invalidReport
                  ? `💣 Before you send your report...`
                  : `💥 You can't send this report just yet.`
            )
            .setFields(errors)
      );


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`create-report-thread:${type}:${!!errors.length}`)
               .setLabel(`Continue`)
               .setEmoji(`➡️`)
               .setStyle(Discord.ButtonStyle.Primary)
               .setDisabled(invalidReport),
            new Discord.ButtonBuilder()
               .setCustomId(`create-report:${type}:${id}`)
               .setLabel(`Edit report`)
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