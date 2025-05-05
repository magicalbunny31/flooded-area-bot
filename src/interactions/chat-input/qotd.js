/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import { FloodedAreaCommunity } from "../../data/guilds.js";

import Discord from "discord.js";
import dayjs from "dayjs";
import { colours, choice, strip } from "@magicalbunny31/pawesome-utility-stuffs";


export const guilds = [ FloodedAreaCommunity ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`qotd`)
   .setDescription(`Manage QoTDs`)
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`create`)
         .setDescription(`Create a QoTD`)
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`submissions`)
         .setDescription(`View the statuses of your QoTD submissions`)
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`queue`)
         .setDescription(`View the current QoTD queue`)
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // what command to run based on the subcommand
   const subcommand = interaction.options.getSubcommand();

   switch (subcommand) {


      case `create`: {
         // defer the interaction
         await interaction.deferReply({
            ephemeral: true
         });


         // embeds
         const embedColour = interaction.user.accentColor || (await interaction.user.fetch(true)).accentColor || choice([ colours.red, colours.orange, colours.yellow, colours.green, colours.blue, colours.purple, colours.pink ]);

         const embeds = [
            new Discord.EmbedBuilder()
               .setColor(embedColour)
               .setAuthor({
                  name: `${interaction.user.displayName === interaction.user.username ? `@${interaction.user.username}` : `${interaction.user.displayName} (@${interaction.user.username})`} asks...`,
                  iconURL: interaction.user.displayAvatarURL()
               })
               .setFooter({
                  text: strip`
                     📝 You need to have [question] and at least one of [discussion thread, reaction choices] to submit this QoTD
                     📥 Once submitted, you won't be able to edit this QoTD again
                     🚨 Staff will review your submitted QoTD before it gets posted
                     ⌚ Only 1 QoTD can be submitted every 24 hours
                  `
               })
         ];


         // components
         const components = [
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.ButtonBuilder()
                     .setCustomId(`qotd-create:${interaction.id}`)
                     .setLabel(`Submit QoTD`)
                     .setEmoji(`✅`)
                     .setStyle(Discord.ButtonStyle.Success)
                     .setDisabled(true)
               ),

            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.ButtonBuilder()
                     .setCustomId(`qotd-edit:${interaction.id}:content`)
                     .setLabel(`Add question`)
                     .setEmoji(`➕`)
                     .setStyle(Discord.ButtonStyle.Primary)
               ),

            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.ButtonBuilder()
                     .setCustomId(`qotd-edit:${interaction.id}:thread`)
                     .setLabel(`Add discussion thread`)
                     .setEmoji(`➕`)
                     .setStyle(Discord.ButtonStyle.Primary)
               ),

            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.StringSelectMenuBuilder()
                     .setCustomId(`qotd-edit:${interaction.id}:reactions`)
                     .setPlaceholder(`Reaction choices`)
                     .setOptions(
                        new Discord.StringSelectMenuOptionBuilder()
                           .setLabel(`Add reaction choice`)
                           .setValue(`add`)
                           .setEmoji(`➕`)
                     )
               )
         ];


         // reply to the interaction
         await interaction.editReply({
            embeds,
            components
         });


         // break out
         break;
      };


      case `queue`: {
         // defer the interaction
         await interaction.deferReply({
            ephemeral: true
         });


         // fetch all submissions
         const qotdColRef  = interaction.client.firestoreLegacy.collection(`qotd`).doc(interaction.guildId).collection(`submissions`);
         const qotdColSnap = await qotdColRef.get();
         const qotdColDocs = qotdColSnap.docs;

         const submissions = qotdColDocs
            .filter(qotdDocSnap => qotdDocSnap.exists)
            .map((qotdDocSnap, i) =>
               ({
                  ...qotdDocSnap.data(),
                  id: qotdDocSnap.id,
                  position: i
               })
            );


         // data
         const approvedQotds         = submissions.filter(submission =>  submission.approved)                      .length;
         const deniedQotds           = submissions.filter(submission => !submission.approved &&  submission.delete).length;
         const awaitingApprovalQotds = submissions.filter(submission => !submission.approved && !submission.delete).length;


         // embeds
         const embeds = [
            new Discord.EmbedBuilder()
               .setColor(colours.flooded_area_bot)
               .setAuthor({
                  name: `QoTD submissions`,
                  iconURL: interaction.guild.iconURL()
               })
               .setFields({
                  name: `✅ Approved QoTDs`,
                  value: `> \`${approvedQotds.toLocaleString()}\` ${approvedQotds === 1 ? `QoTD` : `QoTDs`}`,
                  inline: true
               }, {
                  name: `❌ Denied QoTDs (past 7 days)`,
                  value: `> \`${deniedQotds.toLocaleString()}\` ${deniedQotds === 1 ? `QoTD` : `QoTDs`}`,
                  inline: true
               }, {
                  name: `${interaction.client.allEmojis.loading} QoTDs awaiting approval`,
                  value: `> \`${awaitingApprovalQotds.toLocaleString()}\` ${awaitingApprovalQotds === 1 ? `QoTD` : `QoTDs`}`,
                  inline: true
               })
         ];


         // edit the deferred interaction
         await interaction.editReply({
            embeds
         });


         // break out
         break;
      };


      case `submissions`: {
         // defer the interaction
         await interaction.deferReply({
            ephemeral: true
         });


         // fetch all submissions
         const qotdColRef  = interaction.client.firestoreLegacy.collection(`qotd`).doc(interaction.guildId).collection(`submissions`);
         const qotdColSnap = await qotdColRef.get();
         const qotdColDocs = qotdColSnap.docs;

         const submissions = qotdColDocs
            .filter(qotdDocSnap => qotdDocSnap.exists)
            .map((qotdDocSnap, i) =>
               ({
                  ...qotdDocSnap.data(),
                  id: qotdDocSnap.id,
                  position: i
               })
            );

         const approvedSubmissions = submissions
            .filter(submission => submission.approved);

         const userSubmissions = submissions
            .filter(submission => submission.user === interaction.user.id);


         // formatting
         const isApproved = submission => submission.approved;

         const isDenied = submission => !submission.approved && submission.delete;

         const formatEmoji = submission => isApproved(submission)
            ? `✅`
            : isDenied(submission)
               ? `❌`
               : interaction.client.allEmojis.loading;

         const replaceNewlines = content => content.replace(/[\r\n]+/g, ` `);

         const formatTitle = description => Discord.escapeMarkdown(
            replaceNewlines(description).length > 100
               ? `${replaceNewlines(description).slice(0, 97)}...`
               : replaceNewlines(description)
         );

         const approximateSendDate = position => dayjs().unix() < dayjs().startOf(`day`).add(12, `hours`).unix()
            ? dayjs().startOf(`day`).add(12, `hours`)              .add(position, `days`).toDate()  // before 12:00, choose this day
            : dayjs().startOf(`day`).add(12, `hours`).add(1, `day`).add(position, `days`).toDate(); // after 12:00,  choose next day


         // embeds
         const embedColour = interaction.user.accentColor || (await interaction.user.fetch(true)).accentColor || choice([ colours.red, colours.orange, colours.yellow, colours.green, colours.blue, colours.purple, colours.pink ]);

         const embeds = [
            new Discord.EmbedBuilder()
               .setColor(embedColour)
               .setAuthor({
                  name: `Your QoTD submissions`,
                  iconURL: interaction.user.displayAvatarURL()
               })
               .setDescription(
                  userSubmissions
                     .map(submission => {
                        const approvedSubmissionPosition = approvedSubmissions.findIndex(approvedSubmission => approvedSubmission.message === submission.message);
                        return [
                           `### ${formatEmoji(submission)} ${isDenied(submission) ? Discord.strikethrough(`"${formatTitle(submission.description)}"`) : `"${formatTitle(submission.description)}"`}`,
                           `> - Submitted at: ${Discord.time(Math.floor(Discord.SnowflakeUtil.timestampFrom(submission.id) / 1000))}`,
                           ...isApproved(submission)
                              ? [
                                 `> - Position in ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`qotd`, `queue`, interaction.commandId)}: \`${approvedSubmissionPosition + 1}\` of \`${approvedSubmissions.length}\``,
                                 `> - Sending to ${Discord.channelMention(FloodedAreaCommunityChannels.QoTD)}: ${Discord.time(approximateSendDate(approvedSubmissionPosition), Discord.TimestampStyles.RelativeTime)}`
                              ]
                              : []
                        ]
                           .join(`\n`);
                     })
                     .join(`\n`)
                  || strip`
                     ### 📰 You haven't submitted any ${Discord.channelMention(FloodedAreaCommunityChannels.QoTD)}s yet
                     > - Create one with ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`qotd`, `create`, interaction.commandId)}
                  `
               )
         ];


         // edit the deferred interaction
         await interaction.editReply({
            embeds
         });


         // break out
         break;
      };


   };
};