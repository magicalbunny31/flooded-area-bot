/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../data/guilds.js";

import dayjs from "dayjs";
import { autoArray, choice, number } from "@magicalbunny31/pawesome-utility-stuffs";


export const cron = {
   // at every hour
   minute: 0
};


/**
 * @param {import("@flooded-area-bot-types/client").default} client
 */
export default async client => {
   // guilds to update
   const guilds = [
      FloodedAreaCommunity,
      UniverseLaboratories
   ];


   // for each guild..
   for (const guild of guilds) {
      // currency shop
      const shopDocRef  = client.firestoreLegacy.collection(`currency`).doc(guild);
      const shopDocSnap = await shopDocRef.get();
      const shopDocData = shopDocSnap.data() || {};

      const items = shopDocData?.[`shop-items`] || [];

      const event = {};
      const stalkMarket = shopDocData[`stalk-market`] || {};


      // rotate the shop (every hour)
      // set all displayed items as false
      for (const item of items)
         item.displayed = false;

      // items to show on this rotation
      const numberOfItemsToDisplay = choice([ 3, 6, 9 ]);
      const itemsToDisplay         = numberOfItemsToDisplay >= items
         ? items
         : choice(items, numberOfItemsToDisplay);

      // set these items in the available items array as displayed
      for (const item of items)
         item.displayed = itemsToDisplay.some(itemToDisplay => itemToDisplay.seller === item.seller);


      // create a new event this week (every sunday midnight)
      if (!dayjs.utc().day() && !dayjs.utc().hour()) {
         if (number(0, 1)) // 50% chance for an event this week
            Object.assign(event,
               choice(
                  [{
                     "event":           `market-crash`,
                     "news-date-index": number(0, 7)
                  }, {
                     "event":           `bull-market`,
                     "news-date-index": number(0, 7)
                  }, {
                     "event":           `market-switch`,
                     "news-date-index": number(0, 7)
                  }]
               )
            );
      };

      // update the stalk market (every sunday midnight)
      // https://nookipedia.com/wiki/Stalk_Market
      if (!dayjs.utc().day() && !dayjs.utc().hour()) {
         const trend = (() => {
            const trendChanceData = {
               "decreasing": [{
                  name:   `decreasing`,
                  chance: (1 / 30).toFixed(5)
               }, {
                  name:   `increasing`,
                  chance: (5 / 30).toFixed(5)
               }, {
                  name:   `small-spike`,
                  chance: (4 / 30).toFixed(5)
               }, {
                  name:   `large-spike`,
                  chance: (3 / 30).toFixed(5)
               }, {
                  name:   `false-spike`,
                  chance: (2 / 30).toFixed(5)
               }, {
                  name:   `low-random`,
                  chance: (3 / 30).toFixed(5)
               }, {
                  name:   `high-random`,
                  chance: (3 / 30).toFixed(5)
               }, {
                  name:   `starting-mirror`,
                  chance: (3 / 30).toFixed(5)
               }, {
                  name:   `ending-mirror`,
                  chance: (3 / 30).toFixed(5)
               }, {
                  name:   `peak`,
                  chance: (2 / 30).toFixed(5)
               }],
               "increasing": [{
                  name:   `decreasing`,
                  chance: (1 / 26).toFixed(5)
               }, {
                  name:   `increasing`,
                  chance: (1 / 26).toFixed(5)
               }, {
                  name:   `small-spike`,
                  chance: (3 / 26).toFixed(5)
               }, {
                  name:   `large-spike`,
                  chance: (3 / 26).toFixed(5)
               }, {
                  name:   `false-spike`,
                  chance: (2 / 26).toFixed(5)
               }, {
                  name:   `low-random`,
                  chance: (4 / 26).toFixed(5)
               }, {
                  name:   `high-random`,
                  chance: (4 / 26).toFixed(5)
               }, {
                  name:   `starting-mirror`,
                  chance: (3 / 26).toFixed(5)
               }, {
                  name:   `ending-mirror`,
                  chance: (3 / 26).toFixed(5)
               }, {
                  name:   `peak`,
                  chance: (2 / 26).toFixed(5)
               }],
               "small-spike": [{
                  name:   `decreasing`,
                  chance: (1 / 25).toFixed(5)
               }, {
                  name:   `increasing`,
                  chance: (3 / 25).toFixed(5)
               }, {
                  name:   `small-spike`,
                  chance: (1 / 25).toFixed(5)
               }, {
                  name:   `large-spike`,
                  chance: (3 / 25).toFixed(5)
               }, {
                  name:   `false-spike`,
                  chance: (1 / 25).toFixed(5)
               }, {
                  name:   `low-random`,
                  chance: (4 / 25).toFixed(5)
               }, {
                  name:   `high-random`,
                  chance: (4 / 25).toFixed(5)
               }, {
                  name:   `starting-mirror`,
                  chance: (3 / 25).toFixed(5)
               }, {
                  name:   `ending-mirror`,
                  chance: (3 / 25).toFixed(5)
               }, {
                  name:   `peak`,
                  chance: (2 / 25).toFixed(5)
               }],
               "large-spike": [{
                  name:   `decreasing`,
                  chance: (1 / 24).toFixed(5)
               }, {
                  name:   `increasing`,
                  chance: (2 / 24).toFixed(5)
               }, {
                  name:   `small-spike`,
                  chance: (2 / 24).toFixed(5)
               }, {
                  name:   `large-spike`,
                  chance: (1 / 24).toFixed(5)
               }, {
                  name:   `false-spike`,
                  chance: (2 / 24).toFixed(5)
               }, {
                  name:   `low-random`,
                  chance: (5 / 24).toFixed(5)
               }, {
                  name:   `high-random`,
                  chance: (5 / 24).toFixed(5)
               }, {
                  name:   `starting-mirror`,
                  chance: (2 / 24).toFixed(5)
               }, {
                  name:   `ending-mirror`,
                  chance: (2 / 24).toFixed(5)
               }, {
                  name:   `peak`,
                  chance: (2 / 24).toFixed(5)
               }],
               "false-spike": [{
                  name:   `decreasing`,
                  chance: (1 / 27).toFixed(5)
               }, {
                  name:   `increasing`,
                  chance: (5 / 27).toFixed(5)
               }, {
                  name:   `small-spike`,
                  chance: (3 / 27).toFixed(5)
               }, {
                  name:   `large-spike`,
                  chance: (3 / 27).toFixed(5)
               }, {
                  name:   `false-spike`,
                  chance: (1 / 27).toFixed(5)
               }, {
                  name:   `low-random`,
                  chance: (3 / 27).toFixed(5)
               }, {
                  name:   `high-random`,
                  chance: (3 / 27).toFixed(5)
               }, {
                  name:   `starting-mirror`,
                  chance: (3 / 27).toFixed(5)
               }, {
                  name:   `ending-mirror`,
                  chance: (3 / 27).toFixed(5)
               }, {
                  name:   `peak`,
                  chance: (2 / 27).toFixed(5)
               }],
               "low-random": [{
                  name:   `decreasing`,
                  chance: (1 / 25).toFixed(5)
               }, {
                  name:   `increasing`,
                  chance: (5 / 25).toFixed(5)
               }, {
                  name:   `small-spike`,
                  chance: (4 / 25).toFixed(5)
               }, {
                  name:   `large-spike`,
                  chance: (3 / 25).toFixed(5)
               }, {
                  name:   `false-spike`,
                  chance: (2 / 25).toFixed(5)
               }, {
                  name:   `low-random`,
                  chance: (1 / 25).toFixed(5)
               }, {
                  name:   `high-random`,
                  chance: (1 / 25).toFixed(5)
               }, {
                  name:   `starting-mirror`,
                  chance: (3 / 25).toFixed(5)
               }, {
                  name:   `ending-mirror`,
                  chance: (3 / 25).toFixed(5)
               }, {
                  name:   `peak`,
                  chance: (2 / 25).toFixed(5)
               }],
               "high-random": [{
                  name:   `decreasing`,
                  chance: (1 / 22).toFixed(5)
               }, {
                  name:   `increasing`,
                  chance: (4 / 22).toFixed(5)
               }, {
                  name:   `small-spike`,
                  chance: (3 / 22).toFixed(5)
               }, {
                  name:   `large-spike`,
                  chance: (2 / 22).toFixed(5)
               }, {
                  name:   `false-spike`,
                  chance: (2 / 22).toFixed(5)
               }, {
                  name:   `low-random`,
                  chance: (1 / 22).toFixed(5)
               }, {
                  name:   `high-random`,
                  chance: (1 / 22).toFixed(5)
               }, {
                  name:   `starting-mirror`,
                  chance: (3 / 22).toFixed(5)
               }, {
                  name:   `ending-mirror`,
                  chance: (3 / 22).toFixed(5)
               }, {
                  name:   `peak`,
                  chance: (2 / 22).toFixed(5)
               }],
               "starting-mirror": [{
                  name:   `decreasing`,
                  chance: (1 / 23).toFixed(5)
               }, {
                  name:   `increasing`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `small-spike`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `large-spike`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `false-spike`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `low-random`,
                  chance: (5 / 23).toFixed(5)
               }, {
                  name:   `high-random`,
                  chance: (4 / 23).toFixed(5)
               }, {
                  name:   `starting-mirror`,
                  chance: (1 / 23).toFixed(5)
               }, {
                  name:   `ending-mirror`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `peak`,
                  chance: (2 / 23).toFixed(5)
               }],
               "ending-mirror": [{
                  name:   `decreasing`,
                  chance: (1 / 23).toFixed(5)
               }, {
                  name:   `increasing`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `small-spike`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `large-spike`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `false-spike`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `low-random`,
                  chance: (4 / 23).toFixed(5)
               }, {
                  name:   `high-random`,
                  chance: (5 / 23).toFixed(5)
               }, {
                  name:   `starting-mirror`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `ending-mirror`,
                  chance: (1 / 23).toFixed(5)
               }, {
                  name:   `peak`,
                  chance: (2 / 23).toFixed(5)
               }],
               "peak": [{
                  name:   `decreasing`,
                  chance: (1 / 23).toFixed(5)
               }, {
                  name:   `increasing`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `small-spike`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `large-spike`,
                  chance: (1 / 23).toFixed(5)
               }, {
                  name:   `false-spike`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `low-random`,
                  chance: (5 / 23).toFixed(5)
               }, {
                  name:   `high-random`,
                  chance: (5 / 23).toFixed(5)
               }, {
                  name:   `starting-mirror`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `ending-mirror`,
                  chance: (2 / 23).toFixed(5)
               }, {
                  name:   `peak`,
                  chance: (1 / 23).toFixed(5)
               }]
            }[stalkMarket.trend || `decreasing`];

            const smallestChance = Math.min(...trendChanceData.map(data => data.chance));

            const numberOfDecimals = `${smallestChance}`.split(`.`)[1].length;
            const multiplyByThis = Math.pow(10, numberOfDecimals);

            return choice(
               trendChanceData.flatMap(data =>
                  autoArray(Math.floor(data.chance * multiplyByThis), () => data)
               )
            )
               .name;
         })();

         let spikeIndex = 0;
         const trendPrices = {
            "decreasing": (() => {
               const prices = [ number(45, 55) ];
               let [ price ] = prices;

               for (let i = 0; i < 11; i ++) {
                  price -= number(2, 4);
                  prices.push(price);
               };

               return prices;
            })(),

            "increasing": (() => {
               const prices = [ number(25, 35) ];
               let [ price ] = prices;

               for (let i = 0; i < 11; i ++) {
                  price += number(2, 4);
                  prices.push(price);
               };

               return prices;
            })(),

            "small-spike": (() => {
               const prices = [ number(45, 55) ];
               let [ price ] = prices;
               let endPrice;

               spikeIndex = number(1, 7);
               for (let i = 0; i < 11; i ++) {
                  if ([ spikeIndex, spikeIndex + 1, spikeIndex + 2 ].includes(i))
                     price += number(20, 25);
                  else if (i > spikeIndex) {
                     const pricesAfterThis = 11 - i;
                     if (i === spikeIndex + 3)
                        endPrice = number(i * pricesAfterThis, i * pricesAfterThis + i * 5 + 1);
                     const decreaseBy = Math.round(((price - endPrice) / pricesAfterThis) - number(0, 5));
                     price -= decreaseBy;
                  } else
                     price -= number(3, 5);
                  prices.push(price);
               };

               return prices;
            })(),

            "large-spike": (() => {
               const prices = [ number(45, 65) ];
               let [ price ] = prices;
               let endPrice;

               spikeIndex = number(0, 6);
               for (let i = 0; i < 11; i ++) {
                  if (i === spikeIndex)
                     price += number(15, 25);
                  else if (i === spikeIndex + 1)
                     price -= number(10, 20);
                  else if ([ spikeIndex + 2, spikeIndex + 3 ].includes(i))
                     price += number(30, 50);
                  else if (i > spikeIndex) {
                     const pricesAfterThis = 11 - i;
                     if (i === spikeIndex + 4)
                        endPrice = number(i * pricesAfterThis, i * pricesAfterThis + i * 5 + 1);
                     const decreaseBy = Math.round(((price - endPrice) / pricesAfterThis) - number(0, 5));
                     price -= decreaseBy;
                  } else
                     price -= number(3, 5);
                  prices.push(price);
               };

               return prices;
            })(),

            "false-spike": (() => {
               const prices = [ number(45, 65) ];
               let [ price ] = prices;
               let endPrice;

               spikeIndex = number(0, 6);
               for (let i = 0; i < 11; i ++) {
                  if (i === spikeIndex)
                     price += number(30, 50);
                  else if (i > spikeIndex) {
                     const pricesAfterThis = 11 - i;
                     if (i === spikeIndex + 1)
                        endPrice = number(i * pricesAfterThis, i * pricesAfterThis + i * 5 + 1);
                     const decreaseBy = Math.round(((price - endPrice) / pricesAfterThis) - number(0, 5));
                     price -= decreaseBy;
                  } else
                     price -= number(3, 5);
                  prices.push(price);
               };

               return prices;
            })(),

            "low-random": (() => {
               return autoArray(12, () => number(25, 60));
            })(),

            "high-random": (() => {
               return autoArray(12, () => number(45, 80));
            })(),

            "starting-mirror": (() => {
               const prices = [ number(70, 90) ];
               let [ price ] = prices;
               let endPrice;

               spikeIndex = number(4, 6);
               for (let i = 0; i < 11; i ++) {
                  if (i < spikeIndex) {
                     const pricesToNewsDate = spikeIndex - i;
                     if (i === 0)
                        endPrice = number(20, 30);
                     const decreaseBy = Math.round(((price - endPrice) / pricesToNewsDate) - number(0, 3));
                     price -= decreaseBy;
                  } else {
                     const pricesAfterThis = 11 - i;
                     if (i === spikeIndex)
                        endPrice = number(45, 55);
                     const increaseBy = Math.round(((endPrice - price) / pricesAfterThis) + number(0, 1));
                     price += increaseBy;
                  };
                  prices.push(price);
               };

               return prices;
            })(),

            "ending-mirror": (() => {
               const prices = [ number(45, 55) ];
               let [ price ] = prices;
               let endPrice;

               spikeIndex = number(4, 6);
               for (let i = 0; i < 11; i ++) {
                  if (i < spikeIndex) {
                     const pricesToNewsDate = spikeIndex - i;
                     if (i === 0)
                        endPrice = number(20, 30);
                     const decreaseBy = Math.round(((price - endPrice) / pricesToNewsDate) - number(0, 3));
                     price -= decreaseBy;
                  } else {
                     const pricesAfterThis = 11 - i;
                     if (i === spikeIndex)
                        endPrice = number(70, 90);
                     const increaseBy = Math.round(((endPrice - price) / pricesAfterThis) + number(0, 3));
                     price += increaseBy;
                  };
                  prices.push(price);
               };

               return prices;
            })(),

            "peak": (() => {
               const prices = [ number(30, 40) ];
               let [ price ] = prices;
               let endPrice;

               spikeIndex = number(3, 7);
               for (let i = 0; i < 11; i ++) {
                  if (i < spikeIndex) {
                     const pricesToNewsDate = spikeIndex - i;
                     if (i === 0)
                        endPrice = number(75, 95);
                     const increaseBy = Math.round(((endPrice - price) / pricesToNewsDate) + number(0, 5));
                     price += increaseBy;
                  } else if (i >= spikeIndex) {
                     const pricesAfterThis = 11 - i;
                     if (i === spikeIndex)
                        endPrice = number(30, 40);
                     const decreaseBy = Math.round(((price - endPrice) / pricesAfterThis) - number(0, 5));
                     price -= decreaseBy;
                  };
                  prices.push(price);
               };

               return prices;
            })()
         }[trend];

         Object.assign(stalkMarket, {
            "current-price":   number(45, 55),
            "news-date-index": spikeIndex,
            "prices":          trendPrices,
            "trend":           trend
         });
      };


      // update the database
      await shopDocRef.update({
         "event":        event,
         "shop-items":   items,
         "stalk-market": stalkMarket
      });
   };
};