/**
 * TODO
 * this file has not yet been refactored~
 */


import cache from "../../data/cache.js";
import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import Discord from "discord.js";
import dayjs from "dayjs";
import { colours, choice, strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button, id ] = interaction.customId.split(`:`);


   // cache
   const data = cache.get(`qotd:${id}`);


   // application commands
   const commands = await interaction.guild.commands.fetch();

   const commandQotdId = commands.find(command => command.name === `qotd`)?.id || 0;


   // embeds
   const embeds = [
      ...interaction.message.embeds,

      new Discord.EmbedBuilder()
         .setColor(colours.flooded_area_bot)
         .setDescription(strip`
            ### 📥 Your QoTD has been submitted
            > - The ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} will review your QoTD before it gets posted to ${Discord.channelMention(FloodedAreaCommunityChannels.QoTD)}.
            >  - Use ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`qotd`, `submissions`, commandQotdId)} to view the statuses of your submissions.
            >  - Use ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`qotd`, `queue`, commandQotdId)} to view the whole QoTD queue.
            > - New ${Discord.channelMention(FloodedAreaCommunityChannels.QoTD)}s are posted every day at ${Discord.time(dayjs().startOf(`day`).add(12, `hours`).toDate(), Discord.TimestampStyles.ShortTime)}.
         `)
   ];


   // update the interaction's original reply
   await interaction.update({
      embeds,
      components: []
   });


   // embeds
   const embedColour = interaction.user.accentColor || choice([ colours.red, colours.orange, colours.yellow, colours.green, colours.blue, colours.purple, colours.pink ]);

   embeds.splice(0, 5,
      new Discord.EmbedBuilder()
         .setColor(embedColour)
         .setAuthor({
            name: `@${interaction.user.username} (${interaction.user.id})`,
            iconURL: interaction.user.displayAvatarURL()
         }),

      ...data.threadName
         ? [
            new Discord.EmbedBuilder()
               .setColor(colours.flooded_area_bot)
               .setFields({
                  name: `Thread name`,
                  value: Discord.escapeMarkdown(data.threadName)
               })
         ]
         : []
   );

   if (data.description)
      embeds[0].setDescription(data.description);

   if (data.imageUrl)
      embeds[0].setImage(data.imageUrl);

   if (data.reactionChoices?.length)
      embeds[0].setFields({
         name: `\u200b`,
         value: data.reactionChoices
            .map(reactionChoice => `> ${reactionChoice.reactionEmoji} ${reactionChoice.reactionName}`)
            .join(`\n`)
      });


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`qotd-moderate-queue:approve:${id}`)
               .setLabel(`Approve`)
               .setEmoji(`✅`)
               .setStyle(Discord.ButtonStyle.Success),
            new Discord.ButtonBuilder()
               .setCustomId(`qotd-moderate-queue:deny:${id}`)
               .setLabel(`Deny`)
               .setEmoji(`❌`)
               .setStyle(Discord.ButtonStyle.Danger)
         )
   ];


   // send to the qotd submissions channel
   const channel = await interaction.guild.channels.fetch(FloodedAreaCommunityChannels.QoTDSubmissions);

   const message = await channel.send({
      embeds,
      components
   });


   // set this data in the database
   const qotdDocRef = interaction.client.firestoreLegacy.collection(`qotd`).doc(interaction.guildId).collection(`submissions`).doc(id);

   await qotdDocRef.set({
      ...data,
      approved: false,
      message:  message.id,
      user:     interaction.user.id
   });
};