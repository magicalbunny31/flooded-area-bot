/**
 * TODO
 * this file has not yet been refactored~
 */


import { BunTesters } from "../../data/guilds.js";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button, type, rating ] = interaction.customId.split(`:`);


   // "defer" the interaction
   await interaction.update({
      content: `### ${interaction.client.allEmojis.loading} Sending feedback...`,
      components: []
   });


   // formatted name for this type
   const name = {
      "report-a-player": `Report a Player`,
      "ban-appeals":     `Ban Appeals`,
      "modmail":         `Modmail Submissions`
   }[type];


   // fetch the support ratings button
   const guild = await interaction.client.guilds.fetch(BunTesters);

   const channels = await guild.channels.fetch();
   const channel = channels.find(channel => channel.name.includes(`support-ratings`));

   const messages = await channel.messages.fetch({
      after: channel.id,
      limit: 3
   });
   const message = messages.find(message => message.content.includes(name));

   const components = message.components;
   const button = components[0].components.find(button => button.data.custom_id.endsWith(rating));


   // edit the button
   button.data.label = `${+button.data.label + 1}`;

   await message.edit({
      components
   });


   // edit the deferred interaction
   await interaction.editReply({
      content: `### ✅ Thanks for your feedback!`
   });
};