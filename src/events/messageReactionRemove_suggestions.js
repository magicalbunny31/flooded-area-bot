/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../data/channels.js";

import Discord from "discord.js";
import { tryOrUndefined } from "@magicalbunny31/pawesome-utility-stuffs";


export const name = Discord.Events.MessageReactionRemove;
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


   // the post was made by a bot, don't edit its tags
   const starterMessage = await tryOrUndefined(messageReaction.message.channel.fetchStarterMessage());

   if (starterMessage?.author.bot)
      return;


   // this suggestion's highest reaction emoji has under 10 votes but the forum post has the popular tag
   const highestMessageReactionCount = messageReaction.message.reactions.cache
      .filter(messageReaction => !bannedEmojis.includes(messageReaction.emoji.name))
      .sort((a, b) => a.count - b.count)
      .at(-1)
      ?.count;

   const popularTag = messageReaction.message.channel.parent.availableTags.find(tag => tag.name === `Popular`).id;
   const popularTagIndex = messageReaction.message.channel.appliedTags.findIndex(id => id === popularTag);

   if (popularTagIndex > 0)
      messageReaction.message.channel.appliedTags.splice(popularTagIndex, 1);

   if (highestMessageReactionCount < 10)
      await messageReaction.message.channel.setAppliedTags([ ...messageReaction.message.channel.appliedTags ]);
};