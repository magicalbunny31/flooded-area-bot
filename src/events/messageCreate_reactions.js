/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../data/guilds.js";

import Discord from "discord.js";
import { choice } from "@magicalbunny31/pawesome-utility-stuffs";


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


   // this message's content includes "flooded area"
   if (message.content.toLowerCase().includes(`flooded area`))
      await message.react(message.client.allEmojis.flooded_area);


   // this message's content includes "617" or "6/17" (by itself, NOT in stuff like ids)
   if ([ `617`, `6/17` ].some(content => message.content.split(` `).includes(content)))
      await message.react(choice([ message.client.allEmojis[`617`], message.client.allEmojis.date617, message.client.allEmojis.old617, message.client.allEmojis.underlined617 ]));
};