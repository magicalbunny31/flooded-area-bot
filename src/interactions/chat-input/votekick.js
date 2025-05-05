import cache from "../../data/cache.js";
import { FloodedAreaCommunity } from "../../data/guilds.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import { generateVotekickImage, generateVotekickFailImage, generateVotekickSuccessImage } from "../../assets/votekick/images.js";

import Discord from "discord.js";
import dayjs from "dayjs";
import { choice } from "@magicalbunny31/pawesome-utility-stuffs";


export const guilds = [ FloodedAreaCommunity ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`votekick`)
   .setDescription(`Call a votekick on a user`)
   .addUserOption(
      new Discord.SlashCommandUserOption()
         .setName(`user`)
         .setDescription(`The user to call a votekick on`)
         .setRequired(true)
   )
   .addStringOption(
      new Discord.SlashCommandStringOption()
         .setName(`reason`)
         .setDescription(`The reason for this votekick`)
         .setMaxLength(32)
         .setRequired(true)
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // options
   const user   = interaction.options.getUser(`user`);
   const reason = interaction.options.getString(`reason`);


   // this user isn't a part of this guild
   const member = interaction.options.getMember(`user`);

   if (!member)
      return await interaction.reply({
         components: [
            new Discord.TextDisplayBuilder()
               .setContent(
                  Discord.heading(`${interaction.client.allEmojis.cross} ${user} isn't in this server`, Discord.HeadingLevel.Three)
               )
         ],
         flags: [
            Discord.MessageFlags.IsComponentsV2,
            Discord.MessageFlags.Ephemeral
         ]
      });


   // trying to votekick someone already timed out
   if (member.communicationDisabledUntilTimestamp > Date.now())
      return await interaction.reply({
         components: [
            new Discord.TextDisplayBuilder()
               .setContent(
                  [
                     Discord.heading(`${interaction.client.allEmojis.cross} ${user} is on time out`, Discord.HeadingLevel.Three),
                     Discord.subtext(`${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(interaction.commandName, interaction.commandId)} works by timing out the user on votekick success.`)
                  ]
                     .join(`\n`)
               )
         ],
         flags: [
            Discord.MessageFlags.IsComponentsV2,
            Discord.MessageFlags.Ephemeral
         ]
      });


   // trying to votekick a bot
   if (user.bot)
      return await interaction.reply({
         components: [
            new Discord.TextDisplayBuilder()
               .setContent(
                  [
                     Discord.heading(`${interaction.client.allEmojis.cross} ${user} is an app`, Discord.HeadingLevel.Three),
                     Discord.subtext(`Time-outs have no effects on apps.`)
                  ]
                     .join(`\n`)
               )
         ],
         flags: [
            Discord.MessageFlags.IsComponentsV2,
            Discord.MessageFlags.Ephemeral
         ]
      });


   // trying to votekick someone who can't be timed out
   if (!member.moderatable) {
      // timeout the user for one minute
      if (interaction.member.moderatable)
         await interaction.member.timeout(60 * 1000);

      // reply to the interaction
      return await interaction.reply({
         components: [
            new Discord.TextDisplayBuilder()
               .setContent(
                  Discord.heading(`${interaction.client.allEmojis.announcement_channel} ${interaction.user} is a nerd!`, Discord.HeadingLevel.Three)
               )
         ],
         flags: [
            Discord.MessageFlags.IsComponentsV2
         ]
      });
   };


   // votekick is on cooldown
   const { cooldownExpiresAt = 0, votekickInProgressAt = 0, currentVotekickMessage } = cache.get(`votekick`) || {};

   if (dayjs().unix() < cooldownExpiresAt)
      return await interaction.reply({
         components: [
            new Discord.TextDisplayBuilder()
               .setContent(
                  [
                     Discord.heading(`${interaction.client.allEmojis.cross} ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(interaction.commandName, interaction.commandId)} is on cooldown`, Discord.HeadingLevel.Three),
                     Discord.subtext(`Try again ${Discord.time(cooldownExpiresAt, Discord.TimestampStyles.RelativeTime)}.`)
                  ]
                     .join(`\n`)
               )
         ],
         flags: [
            Discord.MessageFlags.IsComponentsV2,
            Discord.MessageFlags.Ephemeral
         ]
      });


   // a votekick is in progress
   const votekickProbablyStillInProgress = dayjs().unix() - votekickInProgressAt < 120; // two minutes haven't passed yet: the votekick probably is still ongoing

   if (votekickInProgressAt && votekickProbablyStillInProgress)
      return await interaction.reply({
         components: [
            new Discord.TextDisplayBuilder()
               .setContent(
                  Discord.heading(`${interaction.client.allEmojis.cross} ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(interaction.commandName, interaction.commandId)} already in progress`, Discord.HeadingLevel.Three)
               ),
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.ButtonBuilder()
                     .setLabel(`View current votekick`)
                     .setEmoji(interaction.client.allEmojis.context_menu_command)
                     .setStyle(Discord.ButtonStyle.Link)
                     .setURL(currentVotekickMessage)
               )
         ],
         flags: [
            Discord.MessageFlags.IsComponentsV2,
            Discord.MessageFlags.Ephemeral
         ]
      });


   // defer the interaction
   const message = await interaction.deferReply({
      fetchReply: true
   });


   // trying to votekick someone with votekick protection
   if (member.roles.cache.has(FloodedAreaCommunityRoles.VotekickProtection))
      return await interaction.editReply({
         components: [
            new Discord.TextDisplayBuilder()
               .setContent(
                  [
                     Discord.heading(`${interaction.client.allEmojis.announcement_channel} ${interaction.user} is a nerd!`, Discord.HeadingLevel.Three),
                     Discord.subtext(`${user} has ${Discord.roleMention(FloodedAreaCommunityRoles.VotekickProtection)}.`)
                  ]
                     .join(`\n`)
               )
         ],
         allowedMentions: {
            roles: [],
            users: [ user.id ]
         },
         flags: [
            Discord.MessageFlags.IsComponentsV2
         ]
      });


   // number of people required to votekick this user
   const requiredVotes = choice([
      2, 2, 2, 2,
      3, 3, 3,
      4, 4,
      5
   ]);

   const voters = [];


   // edit the deferred interaction
   const voteEndsAt = dayjs().add(2, `minutes`).toDate();

   const getPayload = async () => ({
      components: [
         new Discord.MediaGalleryBuilder()
            .addItems(
               new Discord.MediaGalleryItemBuilder()
                  .setURL(`attachment://votekick.png`)
            ),
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.ButtonBuilder()
                  .setCustomId(`${interaction.id}:yes`)
                  .setLabel(`\u200b      Yes      \u200b`)
                  .setEmoji(interaction.client.allEmojis.votekick_yes_button)
                  .setStyle(Discord.ButtonStyle.Success),
               new Discord.ButtonBuilder()
                  .setCustomId(`${interaction.id}:no`)
                  .setLabel(`\u200b      No      \u200b`)
                  .setEmoji(interaction.client.allEmojis.votekick_no_button)
                  .setStyle(Discord.ButtonStyle.Danger)
            ),
         new Discord.SeparatorBuilder()
            .setDivider(true)
            .setSpacing(Discord.SeparatorSpacingSize.Small),
         new Discord.TextDisplayBuilder()
            .setContent(
               [
                  Discord.subtext(`${interaction.user} has called votekick on ${user} for "${Discord.inlineCode(reason)}"`),
                  Discord.subtext(`${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(interaction.commandName, interaction.commandId)} ends ${Discord.time(voteEndsAt, Discord.TimestampStyles.RelativeTime)}`),
                  ...voters.length
                     ? [ Discord.subtext(`Voters: ${voters.join(`, `)}`) ]
                     : []
               ]
                  .join(`\n`)
            )
      ],
      files: [
         new Discord.AttachmentBuilder()
            .setFile(await generateVotekickImage(interaction, voters.length, requiredVotes))
            .setName(`votekick.png`)
      ],
      allowedMentions: {
         users: [ user.id ]
      },
      flags: [
         Discord.MessageFlags.IsComponentsV2
      ]
   });

   await interaction.editReply(
      await getPayload()
   );


   // set the votekick in progress
   cache.set(`votekick`, {
      votekickInProgressAt:   Math.floor(message.createdTimestamp / 1000),
      currentVotekickMessage: message.url
   });


   // create an InteractionCollector
   const vote = message.createMessageComponentCollector({
      filter: i => i.customId.startsWith(interaction.id),
      time: 120000
   });


   // count a vote
   vote.on(`collect`, async buttonInteraction => {
      // this user called the votekick
      if (buttonInteraction.user.id === interaction.user.id)
         return await buttonInteraction.deferUpdate();


      // this user is being votekicked
      if (buttonInteraction.user.id === user.id)
         return await buttonInteraction.deferUpdate();


      // this user is votekick banned
      if (buttonInteraction.member.roles.cache.has(FloodedAreaCommunityRoles.VotekickBanned))
         return await buttonInteraction.deferUpdate();


      // this user has already voted
      if (voters.some(voter => voter.id === buttonInteraction.user.id))
         return await buttonInteraction.deferUpdate();


      // this was a no vote
      if (buttonInteraction.customId.endsWith(`no`))
         return await buttonInteraction.deferUpdate();


      // add this user to the voters list (if it's not already reached its max)
      if (voters.length < requiredVotes)
         voters.push(buttonInteraction.user);


      // update the interaction
      await buttonInteraction.deferUpdate();
      await buttonInteraction.editReply(
         await getPayload()
      );


      // the required amount of votes have been reached
      if (voters.length >= requiredVotes)
         vote.stop(`required votes reached`);
   });


   vote.on(`end`, async (collected, endReason) => {
      // set the cooldown and votekick progress
      cache.set(`votekick`, {
         cooldownExpiresAt:      dayjs().add(30, `seconds`).unix(),
         votekickInProgressAt:   null,
         currentVotekickMessage: null
      });


      // didn't reach the required votes in the time
      if (endReason === `time`)
         return await interaction.editReply({
            components: [
               new Discord.MediaGalleryBuilder()
                  .addItems(
                     new Discord.MediaGalleryItemBuilder()
                        .setURL(`attachment://votekick_fail.png`)
                  ),
               new Discord.SeparatorBuilder()
                  .setDivider(true)
                  .setSpacing(Discord.SeparatorSpacingSize.Small),
               new Discord.TextDisplayBuilder()
                  .setContent(
                     [
                        Discord.subtext(`${interaction.user}'s votekick on ${user} has failed`),
                        ...voters.length
                           ? [ Discord.subtext(`Voters: ${voters.join(`, `)}`) ]
                           : []
                     ]
                        .join(`\n`)
                  )
            ],
            files: [
               new Discord.AttachmentBuilder()
                  .setFile(await generateVotekickFailImage(interaction))
                  .setName(`votekick_fail.png`)
            ],
            allowedMentions: {
               users: [ user.id ]
            },
            flags: [
               Discord.MessageFlags.IsComponentsV2
            ]
         });


      // InteractionCollector ended for some other reason
      if (endReason !== `required votes reached`)
         return;


      // time out the user depending on how many required votes there were
      const timedOutFor = requiredVotes * 60 * 500;

      await member.timeout(timedOutFor, `/votekick by ${interaction.user.tag}`);


      // edit the interaction's original reply
      await interaction.editReply({
         components: [
            new Discord.MediaGalleryBuilder()
               .addItems(
                  new Discord.MediaGalleryItemBuilder()
                     .setURL(`attachment://votekick_success.png`)
               ),
            new Discord.SeparatorBuilder()
               .setDivider(true)
               .setSpacing(Discord.SeparatorSpacingSize.Small),
            new Discord.TextDisplayBuilder()
               .setContent(
                  [
                     Discord.subtext(`${user} has been timed out for ${Discord.bold(`${requiredVotes / 2} ${requiredVotes / 2 === 1 ? `minute` : `minutes`}`)}`),
                     Discord.subtext(`Voters: ${voters.join(`, `)}`)
                  ]
                     .join(`\n`)
               )
         ],
         files: [
            new Discord.AttachmentBuilder()
               .setFile(await generateVotekickSuccessImage(interaction))
               .setName(`votekick_success.png`)
         ],
         allowedMentions: {
            users: [ user.id ]
         },
         flags: [
            Discord.MessageFlags.IsComponentsV2
         ]
      });
   });
};