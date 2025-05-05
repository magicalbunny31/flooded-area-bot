/**
 * TODO
 * this file has not yet been refactored~
 */


/**
 * @param {import("@flooded-area-bot-types/client").AutocompleteInteraction} interaction
 */
export default async interaction => {
   // autocomplete info
   const subcommand = interaction.options.getSubcommand();
   const input = interaction.options.getFocused();


   // what subcommand to run
   switch (subcommand) {


      // TODO
      case `trade`: {
         // respond to the interaction
         await interaction.respond([]);


         // break out
         break;
      };


   };
};