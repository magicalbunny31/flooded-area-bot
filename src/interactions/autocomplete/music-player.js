/**
 * TODO
 * this file has not yet been refactored~
 */


import musicPlayer from "../../data/music-player.js";
import { BunnyFurFest, BunTesters, FloodedAreaCommunity } from "../../data/guilds.js";

import { findSimilar } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").AutocompleteInteraction} interaction
 */
export default async interaction => {
   // autocomplete info
   const subcommand = interaction.options.getSubcommand();
   const input = interaction.options.getFocused();


   // TODO support for spaced out/darkness obby/anarchy chess


   // music to show
   const name = {
      [BunnyFurFest]:         `flooded-area`,
      [BunTesters]:           `flooded-area`,
      [FloodedAreaCommunity]: `flooded-area`
   }[interaction.guild.id];


   // autocomplete choices
   const music = (() => {
      switch (subcommand) {
         case `category`:
            return musicPlayer[name]
               .map(data =>
                  ({
                     name: `${data.emoji} ${data.categoryName}`,
                     value: data.categoryId
                  })
               )
               .filter((value, index, self) =>
                  index === self.findIndex(t => t.value === value.value)
               );

         case `track`:
            return musicPlayer[name]
               .map(data =>
                  ({
                     name: `${data.emoji} [${data.categoryName}] ${data.name}`,
                     value: data.robloxAssetId
                  })
               );
      };
   })();


   // find similar matches from the music list
   const foundMusic = findSimilar(input, music, {
      key: `name`,
      limit: 25,
      minScore: 0.1
   })
      .map(data => data.object);


   // respond to the interaction
   await interaction.respond(
      input
         ? foundMusic
         : music.slice(0, 25)
   );
};