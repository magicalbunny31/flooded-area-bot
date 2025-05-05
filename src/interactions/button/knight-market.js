import KnightMarket from "../../classes/knight-market.js";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button, rawLastUpdatedAtTimestamp ] = interaction.customId.split(`:`);


   // this is already the latest chart
   const knightMarket = new KnightMarket(interaction);

   const currentUpdatedTimestamp = knightMarket.getDate().unix();

   if (+rawLastUpdatedAtTimestamp === currentUpdatedTimestamp)
      return void await interaction.deferUpdate();


   // update the chart
   await knightMarket.showChart();
};