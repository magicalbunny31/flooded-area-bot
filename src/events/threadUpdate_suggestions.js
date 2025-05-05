/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../data/channels.js";

import Discord from "discord.js";
import { colours } from "@magicalbunny31/pawesome-utility-stuffs";


export const name = Discord.Events.ThreadUpdate;


/**
 * @param {import("@flooded-area-bot-types/client").ThreadChannel} oldThread
 * @param {import("@flooded-area-bot-types/client").ThreadChannel} newThread
 */
export default async (oldThread, newThread) => {
   // this post isn't from the suggestion channels
   if (![ FloodedAreaCommunityChannels.GameSuggestions, FloodedAreaCommunityChannels.ServerSuggestions, FloodedAreaCommunityChannels.PartSuggestions ].includes(newThread.parent?.id))
      return;


   // get this post's tags (formatted by their names)
   const channelTags = newThread.parent.availableTags;

   const oldPostTags = oldThread.appliedTags.map(tagId => channelTags.find(channelTag => channelTag.id === tagId).name);
   const newPostTags = newThread.appliedTags.map(tagId => channelTags.find(channelTag => channelTag.id === tagId).name);


   // constants
   const addedTag       = `Added`;
   const addedInGameTag = `Added In-Game`;
   const deniedTag      = `Denied`;

   const closureTags = [ addedTag, addedInGameTag, deniedTag ];


   // the newThread's tags contains a closure tag and the oldThread doesn't
   if (!oldPostTags.some(tag => closureTags.includes(tag)) && newPostTags.some(tag => closureTags.includes(tag))) {
      // send a message in the post
      await newThread.sendTyping();
      await newThread.send({
         embeds: [
            new Discord.EmbedBuilder()
               .setColor(colours.flooded_area_bot)
               .setTitle(
                  !newPostTags.includes(deniedTag)
                     ? `✅ This suggestion has been approved`
                     : `❌ This suggestion has been denied`
               )
         ],
         components: [
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.ButtonBuilder()
                     .setCustomId(`suggestions-change-status:lock`)
                     .setLabel(`Lock post`)
                     .setEmoji(`🔒`)
                     .setStyle(Discord.ButtonStyle.Secondary),
                  new Discord.ButtonBuilder()
                     .setCustomId(`suggestions-change-status:close`)
                     .setLabel(`Lock and close post`)
                     .setEmoji(`📪`)
                     .setStyle(Discord.ButtonStyle.Danger)
               )
         ]
      });

      // stop here
      return;
   };


   // meta tags, only one can be set at a time
   const metaTags = [
      `Staff Picks`,
      `Being Developed...`,
      `Approved For Update`,
      `Added In-Game`,
      `Denied`
   ];


   // both oldThread and newThread have meta tags
   if (oldPostTags.some(tag => metaTags.includes(tag)) && newPostTags.some(tag => metaTags.includes(tag))) {
      // accept newThread's meta tag
      const [ acceptedMetaTag ] = newPostTags.filter(tag => metaTags.includes(tag) && oldPostTags.indexOf(tag) === -1);

      // no accepted meta tag found, stop here
      if (!acceptedMetaTag)
         return;

      // remove all current meta tags
      for (const metaTag of metaTags)
         if (newPostTags.includes(metaTag))
            newPostTags.splice(newPostTags.findIndex(postTag => postTag === metaTag), 1);

      // add the new meta tag
      newPostTags.push(acceptedMetaTag);

      // set this post's new meta tags
      const tagsToApply = newPostTags.map(tag => channelTags.find(channelTag => channelTag.name === tag).id);
      await newThread.setAppliedTags(tagsToApply);
   };
};