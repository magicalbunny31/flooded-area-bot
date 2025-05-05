/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../data/channels.js";

import Discord from "discord.js";
import { colours } from "@magicalbunny31/pawesome-utility-stuffs";


export const name = Discord.Events.MessageDelete;


/**
 * @param {import("@flooded-area-bot-types/client").Message} message
 */
export default async message => {
   // this post isn't from the suggestion channels
   if (![ FloodedAreaCommunityChannels.GameSuggestions, FloodedAreaCommunityChannels.ServerSuggestions, FloodedAreaCommunityChannels.PartSuggestions ].includes(message.channel.parent?.id))
      return;


   // get this post
   const thread = await message.channel.fetch();


   // check if this was the post's starter message
   const starterMessageDeleted = await (async () => {
      try {
         await thread.fetchStarterMessage();
         return false;
      } catch {
         return true;
      };
   })();

   if (!starterMessageDeleted)
      return;


   // send a message that the thread's original message was deleted
   await message.channel.sendTyping();

   await message.channel.send({
      embeds: [
         new Discord.EmbedBuilder()
            .setColor(colours.flooded_area_bot)
            .setTitle(`💥 This suggestion's original message was deleted`)
            .setDescription(`> - ${message.channel} will now be locked and closed.`)
      ]
   });


   // lock and close this post
   await thread.setLocked(true);
   await thread.setArchived(true);
};