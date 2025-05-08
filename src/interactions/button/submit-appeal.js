/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import Discord from "discord.js";
import { FieldValue } from "@google-cloud/firestore";
import { colours, strip, wait } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button ] = interaction.customId.split(`:`);


   // the report embed (it changes before responding to the interaction)
   const appealEmbed = new Discord.EmbedBuilder(interaction.message.embeds[0].data)
      .setFields({
         name: `THEIR ROBLOX ACCOUNT`,
         value: interaction.message.embeds[0].fields[0].value
      }, {
         name: `WHY THEY WERE BANNED`,
         value: interaction.message.embeds[0].fields[1].value
      }, {
         name: `WHY THEY BELIEVE WE SHOULD RECONSIDER IT`,
         value: interaction.message.embeds[0].fields[2].value
      })
      .setFooter({
         text: null
      });


   // update the interaction
   await interaction.update({
      embeds: [
         new Discord.EmbedBuilder()
            .setColor(colours.flooded_area_bot)
            .setTitle(`🔨 Ban Appeals`)
            .setDescription(`${interaction.client.allEmojis.loading} This'll take a few seconds: your appeal is being submitted...`)
      ],
      components: []
   });


   // create the ticket thread
   const ticketsDocRef  = interaction.client.firestoreLegacy.collection(`tickets`).doc(interaction.guild.id);
   const ticketsDocSnap = await ticketsDocRef.get();
   const ticketsDocData = ticketsDocSnap.data();

   await ticketsDocRef.update({
      "ticket-count": FieldValue.increment(1)
   });
   const currentTicketCount = ticketsDocData[`ticket-count`] + 1;

   const thread = await interaction.channel.threads.create({
      name: `🔨┃ticket #${currentTicketCount}`,
      type: Discord.ChannelType.PrivateThread,
      invitable: false
   });

   await thread.members.add(interaction.user);

   const appealMessage = await thread.send({
      embeds: [
         appealEmbed
      ],
      components: [
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.ButtonBuilder()
                  .setCustomId(`close-ticket:${interaction.user.id}:${currentTicketCount}`)
                  .setLabel(`Close ticket`)
                  .setEmoji(`💣`)
                  .setStyle(Discord.ButtonStyle.Danger)
            )
      ]
   });


   // get the moderators to mention
   const members = await (async () => {
      const fetchedMembers = [];
      let lastMember;

      while (true) {
         const members = (await interaction.guild.members.list({ limit: 1000, ...fetchedMembers.length ? { after: fetchedMembers.at(-1).id } : {} }))
            .filter(member => member.roles.cache.has(FloodedAreaCommunityRoles.ModerationTeam));

         fetchedMembers.push(...members.values());

         if (lastMember?.id === fetchedMembers.at(-1)?.id)
            break;

         else
            lastMember = fetchedMembers.at(-1);

         await wait(1000);
      };

      return fetchedMembers;
   })();

   const membersToMention = members
      .map(member => {
         const { members = [], "ban-appeals": banAppeals = true } = ticketsDocData.moderators[member.id] || {};
         return {
            member,
            mention: (!members.includes(interaction.user.id)) // this member isn't muted
               &&    (banAppeals)                             // this moderator wants to be mentioned for ban appeals
         };
      })
      .filter(({ mention }) => mention)
      .map(({ member }) => member);

   const roleToMention = await interaction.guild.roles.create({
      name: `Moderation Team`
   });

   for (const member of membersToMention)
      await member.roles.add(roleToMention);

   const mentionMessage = await thread.send({
      content: strip`
         🔨 Ban Appeals
         ${roleToMention}
      `,
      files: [
         new Discord.AttachmentBuilder()
            .setFile(`./src/assets/report-a-player/oh-moderators.gif`)
      ]
   });

   await mentionMessage.delete();
   await roleToMention.delete();


   // bulk delete messages in logs that involve the creation of the fake moderation team role
   // logs take a while to send, so we'll wait about a minute
   setTimeout(async () => {
      const logsChannel = await interaction.guild.channels.fetch(FloodedAreaCommunityChannels.Logs);
      const logsMessages = await logsChannel.messages.fetch({ limit: 100, after: roleToMention.id });

      const dyno = `155149108183695360`;
      const logsWebhooks = await logsChannel.fetchWebhooks();
      const logsDynoWebhook = logsWebhooks.find(webhook => webhook.owner.id === dyno);

      const messagesToDelete = logsMessages
         .filter(message =>
            message.author.id === logsDynoWebhook.id
            && (
               /\*\*<@!?(\d{17,19})> was removed from the `Moderation Team` role\*\*/.test(message.embeds[0]?.description)
               ||
               message.embeds[0]?.footer.text.includes(roleToMention.id)
            )
         );

      if (messagesToDelete.size)
         await logsChannel.bulkDelete(messagesToDelete);

   }, 60 * 1000);


   // edit the interaction's original reply
   await interaction.editReply({
      embeds: [
         new Discord.EmbedBuilder()
            .setColor(colours.flooded_area_bot)
            .setTitle(`🔨 Ban Appeals`)
            .setDescription(`✅ Thanks for submitting! A member of the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} will review your appeal soon.`)
      ],
      components: [
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.ButtonBuilder()
                  .setLabel(`View appeal`)
                  .setEmoji(`➡️`)
                  .setStyle(Discord.ButtonStyle.Link)
                  .setURL(appealMessage.url)
            )
      ]
   });


   // support ratings
   await interaction.followUp({
      content: strip`
         ### 🔨 How was the appeal process?
         > "UwU pwease wate us 5 staws"
      `,
      components: [
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.ButtonBuilder()
                  .setCustomId(`support-ratings:ban-appeals:bad`)
                  .setLabel(`Bad`)
                  .setEmoji(interaction.client.allEmojis.rip)
                  .setStyle(Discord.ButtonStyle.Danger),
               new Discord.ButtonBuilder()
                  .setCustomId(`support-ratings:ban-appeals:ok`)
                  .setLabel(`Ok`)
                  .setEmoji(interaction.client.allEmojis.mhn)
                  .setStyle(Discord.ButtonStyle.Primary),
               new Discord.ButtonBuilder()
                  .setCustomId(`support-ratings:ban-appeals:good`)
                  .setLabel(`Good`)
                  .setEmoji(interaction.client.allEmojis.yaya)
                  .setStyle(Discord.ButtonStyle.Success)
            )
      ],
      ephemeral: true
   });
};