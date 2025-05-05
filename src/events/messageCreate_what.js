/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../data/guilds.js";

import Discord from "discord.js";


export const name = Discord.Events.MessageCreate;
export const once = false;


/**
 * @param {import("@flooded-area-bot-types/client").Message} message
 */
export default async message => {
   // ignore messages from bots/webhooks
   if (message.author.bot || message.webhookId)
      return;


   // this message isn't from these guilds
   if (![ FloodedAreaCommunity, UniverseLaboratories ].includes(message.guild?.id))
      return;


   // this message doesn't mention the bot
   if (!new RegExp(`^<@!?${message.client.user.id}>$`).test(message.content))
      return;


   // this message has attachments
   if (message.attachments.size)
      return;


   // send typing to the channel
   await message.channel.sendTyping();


   // reply to the message
   await message.reply({
      content: `what`,
      allowedMentions: {
         repliedUser: false
      }
   });
};