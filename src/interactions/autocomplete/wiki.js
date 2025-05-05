/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../../data/guilds.js";
import userAgent from "../../data/user-agent.js";


/**
 * @param {import("@flooded-area-bot-types/client").AutocompleteInteraction} interaction
 */
export default async interaction => {
   // autocomplete info
   const input = interaction.options.getFocused();


   // TODO support for spaced out/darkness obby/anarchy chess


   // no input
   if (!input)
      return await interaction.respond([]);


   // request url and query string
   const baseUrl = (() => {
      switch (interaction.guild.id) {
         case FloodedAreaCommunity: return `https://flooded-area-official.fandom.com`;
         case UniverseLaboratories: return `https://spacedout1.fandom.com`;
      };
   })();

   const query = [
      `action=query`,
      `list=search`,
      `srsearch=${input}`,
      `srlimit=25`,
      `format=json`
   ]
      .join(`&`);


   // send a request to the api
   const response = await fetch(`${baseUrl}/api.php?${query}`, {
      headers: {
         "Accept": `application/json`,
         "User-Agent": userAgent
      }
   });


   // bad response
   if (!response.ok) {
      await interaction.respond([]);
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
   };


   // parse the response data
   const data = await response.json();
   const foundPages = data.query.search;
   const options = foundPages.map(foundPage =>
      ({
         name: foundPage.title,
         value: foundPage.title
      })
   );


   // return the options
   await interaction.respond(options);
};