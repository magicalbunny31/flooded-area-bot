/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../data/channels.js";
import { FloodedAreaCommunity } from "../data/guilds.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../data/roles.js";

import Discord from "discord.js";
import dayjs from "dayjs";
import { autoArray, colours, choice } from "@magicalbunny31/pawesome-utility-stuffs";


export const cron = {
   // at every 12:00
   hour: 12,
   minute: 0
};


/**
 * @param {import("@flooded-area-bot-types/client").default} client
 */
export default async client => {
   // backup qotds
   const getBackupQotd = async () => {
      const qotdColRef  = client.firestoreLegacy.collection(`temp-qotd`);
      const qotdColSnap = await qotdColRef.get();

      const qotd = choice(
         qotdColSnap.docs
            .flatMap(qotdDocSnap => {
               if (!qotdDocSnap.exists)
                  return;
               const data = qotdDocSnap.data();
               return autoArray(data.probability,
                  () => ({
                     id: qotdDocSnap.id,
                     ...data
                  })
               );
            })
            .filter(Boolean)
      );

      const maxProbability = 5;
      for (const qotdDocSnap of qotdColSnap.docs) {
         const data = qotdDocSnap.data();

         await qotdDocSnap.ref.update({
            probability: qotdDocSnap.id === qotd.id
               ? 0
               : data.probability + 1 > maxProbability
                  ? maxProbability
                  : data.probability + 1
         });
      };

      return {
         ...qotd,
         id: undefined
      };
   };


   // guilds to update
   const guilds = [{
      guildId:   FloodedAreaCommunity,
      channelId: FloodedAreaCommunityChannels.QoTD
   }];


   // for each guild..
   for (const guildData of guilds) {
      // fetch submissions
      const qotdColRef  = client.firestoreLegacy.collection(`qotd`).doc(guildData.guildId).collection(`submissions`);
      const qotdColSnap = await qotdColRef.get();


      // delete denied and expired submissions
      const qotdColExpiredDocs = qotdColSnap.docs
         .filter(qotdDocSnap => qotdDocSnap.exists && !qotdDocSnap.data().approved && qotdDocSnap.data().delete?.seconds < dayjs().unix());

      for (const expiredDoc of qotdColExpiredDocs)
         await expiredDoc.ref.delete();


      // get a qotd: the first approved submission, or a backup qotd
      const qotdColApprovedDocs = qotdColSnap.docs
         .filter(qotdDocSnap => qotdDocSnap.exists && qotdDocSnap.data().approved);

      const [ qotdDocSnap ] = qotdColApprovedDocs;

      const qotdDocData = qotdDocSnap
         ? qotdDocSnap.data()
         : await getBackupQotd();


      // embeds
      const user = await client.users.fetch(qotdDocData.user, { force: true });
      const embedColour = user.accentColor || choice([ colours.red, colours.orange, colours.yellow, colours.green, colours.blue, colours.purple, colours.pink ]);

      const embeds = [
         new Discord.EmbedBuilder()
            .setColor(embedColour)
            .setAuthor({
               name: `${user.displayName === user.username ? `@${user.username}` : `${user.displayName} (@${user.username})`} asks...`,
               iconURL: user.displayAvatarURL()
            })
      ];

      if (qotdDocData.description)
         embeds[0].setDescription(qotdDocData.description);

      if (qotdDocData.imageUrl)
         embeds[0].setImage(qotdDocData.imageUrl);

      if (qotdDocData.reactionChoices?.length)
         embeds[0].setFields({
            name: `\u200b`,
            value: qotdDocData.reactionChoices
               .map(reactionChoice => `> ${reactionChoice.reactionEmoji} ${reactionChoice.reactionName}`)
               .join(`\n`)
         });


      // send the message
      const guild   = await client.guilds.fetch(guildData.guildId);
      const channel = await guild.channels.fetch(guildData.channelId);

      const message = await channel.send({
         content: Discord.roleMention(FloodedAreaCommunityRoles.QoTD),
         embeds
      });

      if (qotdDocData.threadName) {
         try {
            await message.startThread({
               name: qotdDocData.threadName
            });
         } catch (error) {
            console.error(error);
         };
      };

      if (qotdDocData.reactionChoices?.length) {
         for (const reactionChoice of qotdDocData.reactionChoices) {
            try {
               await message.react(reactionChoice.reactionEmoji);
            } catch (error) {
               console.error(error);
               continue;
            };
         };
      };


      // delete the submission from the database
      await qotdDocSnap?.ref.delete();
   };
};