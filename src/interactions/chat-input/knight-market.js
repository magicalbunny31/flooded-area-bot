import KnightMarket from "../../classes/knight-market.js";
import { UniverseLaboratories } from "../../data/guilds.js";

import Discord from "discord.js";


export const guilds = [ UniverseLaboratories ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`knight-market`)
   .setDescription(`View the Knight Market's current and historical prices`)
   .addBooleanOption(
      new Discord.SlashCommandBooleanOption()
         .setName(`hidden`)
         .setDescription(`Hide the reply so that only you can see it?`)
         .setRequired(false)
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // show the chart
   const knightMarket = new KnightMarket(interaction);
   await knightMarket.showChart();
};