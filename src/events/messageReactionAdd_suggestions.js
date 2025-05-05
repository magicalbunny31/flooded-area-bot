/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../data/channels.js";

import Discord from "discord.js";
import { tryOrUndefined } from "@magicalbunny31/pawesome-utility-stuffs";


export const name = Discord.Events.MessageReactionAdd;
export const once = false;


/**
 * @param {import("@flooded-area-bot-types/client").MessageReaction} messageReaction
 * @param {import("@flooded-area-bot-types/client").User} user
 */
export default async (messageReaction, user) => {
   // ignore reactions that aren't downvotes or custom emojis
   const bannedEmojis = [ `⬇️`, `❌`, `⛔`, `🚫`, `⏬`, `⤵️`, `👇`, `👎`, `📉`, `🔽`, `🤬` ];

   if (bannedEmojis.includes(messageReaction.emoji.name) || messageReaction.emoji.id)
      return;


   // this post isn't from the suggestion channels
   if (![ FloodedAreaCommunityChannels.GameSuggestions, FloodedAreaCommunityChannels.ServerSuggestions, FloodedAreaCommunityChannels.PartSuggestions ].includes(messageReaction.message.channel.parent?.id))
      return;


   // ignore bot reactions
   if (user.bot)
      return;


   // remove the thread's starter message's author's reaction
   const starterMessage = await tryOrUndefined(messageReaction.message.channel.fetchStarterMessage());
   if (starterMessage?.author.id === user.id)
      return await tryOrUndefined(messageReaction.users.remove(user.id));


   // the post was made by a bot, don't edit its tags
   if (starterMessage?.author.bot)
      return;


   // this suggestion's highest reaction emoji has 10+ reactions and doesn't already have the popular tag
   const message = await messageReaction.message.fetch();
   const highestMessageReactionCount = message.reactions.cache
      .filter(messageReaction => !bannedEmojis.includes(messageReaction.emoji.name))
      .sort((a, b) => a.count - b.count)
      .at(-1)
      ?.count
      || 0;

   const popularTag = messageReaction.message.channel.parent.availableTags.find(tag => tag.name === `Popular`).id;

   if (highestMessageReactionCount >= 10 && !messageReaction.message.channel.appliedTags.includes(popularTag))
      await messageReaction.message.channel.setAppliedTags([ ...messageReaction.message.channel.appliedTags, popularTag ]);
};