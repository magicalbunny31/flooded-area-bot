/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../data/channels.js";

import Discord from "discord.js";


export const name = Discord.Events.ThreadUpdate;


/**
 * @param {import("@flooded-area-bot-types/client").ThreadChannel} oldThread
 * @param {import("@flooded-area-bot-types/client").ThreadChannel} newThread
 */
export default async (oldThread, newThread) => {
   // this post isn't from a ticket
   if (![ FloodedAreaCommunityChannels.ReportAPlayer, FloodedAreaCommunityChannels.BanAppeals ].includes(newThread.parent?.id))
      return;


   // this ticket just opened
   if (oldThread.name === `📣┃unopened ticket` && newThread.name.startsWith(`📣┃ticket #`))
      return;


   // this thread was a named ticket, revert this thread's name
   if ((oldThread.name.startsWith(`📣┃ticket #`) && !newThread.name.startsWith(`📣┃ticket #`)) || (oldThread.name.startsWith(`🔨┃ticket #`) && !newThread.name.startsWith(`🔨┃ticket #`)) || (oldThread.name === `📣┃unopened ticket` && newThread.name !== `📣┃unopened ticket`))
      return await newThread.setName(oldThread.name);


   // this thread was previously archived, archive it again
   if (oldThread.archived && !newThread.archived)
      return await newThread.setArchived(true);
};