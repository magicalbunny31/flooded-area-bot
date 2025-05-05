/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../data/channels.js";

import Discord from "discord.js";
import { choice, wait } from "@magicalbunny31/pawesome-utility-stuffs";


export const name = Discord.Events.ThreadCreate;


/**
 * @param {import("@flooded-area-bot-types/client").ThreadChannel} thread
 * @param {boolean} newlyCreated
 */
export default async (thread, newlyCreated) => {
   // this post isn't from the suggestion/bug report forums
   if (![ FloodedAreaCommunityChannels.GameSuggestions, FloodedAreaCommunityChannels.ServerSuggestions, FloodedAreaCommunityChannels.PartSuggestions, FloodedAreaCommunityChannels.BugReports ].includes(thread.parent?.id))
      return;


   // this post isn't new, the bot was just added to it
   if (!newlyCreated)
      return;


   // wait a bit, so that the thread's starter message is all sent and the starting message from the bot has sent too
   await wait(5000);


   // send the message to the post
   await thread.send({
      content: choice([
         `wow`,
         `interesting`,
         `looking into it`
      ]),
      flags: [
         Discord.MessageFlags.SuppressNotifications
      ]
   });
};