/**
 * TODO
 * this file has not yet been refactored~
 */


import Discord from "discord.js";
import { FieldValue } from "@google-cloud/firestore";
import { strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button, confirm ] = interaction.customId.split(`:`);


   if (confirm === `true`) {
      await interaction.update({
         content: strip`
            ### Creating <#977297300567244801> ticket...
            ${interaction.client.removeAllListeners.loading}
         `,
         components: []
      });

      const submitAMapDocRef  = interaction.client.firestoreLegacy.collection(`submit-a-map`).doc(interaction.guildId);
      const submitAMapDocSnap = await submitAMapDocRef.get();
      const submitAMapDocData = submitAMapDocSnap.data();

      const channel = await interaction.guild.channels.create({
         name: `ticket-${submitAMapDocData[`ticket-count`] + 1}`,
         parent: `988808403738591294`
      });

      await channel.permissionOverwrites.edit(`989125486590451732`, {
         "ViewChannel": true
      });

      await channel.permissionOverwrites.edit(interaction.user, {
         "ViewChannel": true
      });

      await submitAMapDocRef.update({
         "ticket-count": FieldValue.increment(1)
      });

      await channel.send({
         content: strip`
            ### Describe your map in ${channel} using the following format:
            - Your Roblox username
            - Name of your map
            - Map type (survival, Two-Team Elimination, etc.)
            - Description of your map, with pictures
            - Modifiers for your map
            - Your map as a model (uploaded to chat or a link to the [Creator Hub](<https://create.roblox.com/store/models>))
            -# ${interaction.user}
         `
      });

      await interaction.editReply({
         content: strip`
            ### Your ${interaction.channel} ticket has been created
            Go to ${channel} to send your map!
         `
      });


   } else {
      await interaction.reply({
         content: strip`
            ### Press the button below to open a <#977297300567244801> ticket to submit your map
            Just checking - in case you accidentally pressed the button!
            -# Server staff will not be notified that you have opened a ticket so it may take some time before your map is reviewed.
         `,
         components: [
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.ButtonBuilder()
                     .setCustomId(`submit-a-map:true`)
                     .setLabel(`Submit a map`)
                     .setEmoji(`🗺️`)
                     .setStyle(Discord.ButtonStyle.Success)
               )
         ],
         flags: [
            Discord.MessageFlags.Ephemeral
         ]
      });
   };
};