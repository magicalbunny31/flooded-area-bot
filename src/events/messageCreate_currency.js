/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../data/guilds.js";

import Discord from "discord.js";
import dayjs from "dayjs";
import { FieldValue, Timestamp } from "@google-cloud/firestore";


export const name = Discord.Events.MessageCreate;
export const once = false;


/**
 * @param {import("@flooded-area-bot-types/client").Message} message
 */
export default async message => {
   // ignore messages from bots/webhooks/system
   if (message.author.bot || message.webhookId || message.system)
      return;


   // this message isn't from these guilds
   if (![ FloodedAreaCommunity, UniverseLaboratories ].includes(message.guild?.id))
      return;


   // database
   const userCurrencyDocRef  = message.client.firestoreLegacy.collection(`currency`).doc(message.guild.id).collection(`users`).doc(message.author.id);
   const userCurrencyDocSnap = await userCurrencyDocRef.get();
   const userCurrencyDocData = userCurrencyDocSnap.data() || {};


   // this user is on cooldown for earning coins
   const canEarnCoin = (userCurrencyDocData[`can-earn-coins-at`]?.seconds || 0) < dayjs().unix();

   if (!canEarnCoin)
      return;


   // the coins this user has earned (double coins on the weekend)
   let coinsEarned = 1;

   if ([ 0, 6 ].includes(dayjs.utc().day()))
      coinsEarned *= 2;


   // update this user's 24hr expenditure/income
   const expenditure24Hour = (userCurrencyDocData[`24-hour-stats`]?.expenditure || [])
      .filter(data => dayjs.unix(data.at.seconds).add(1, `day`).unix() > dayjs().unix());

   const income24Hour = (userCurrencyDocData[`24-hour-stats`]?.income || [])
      .filter(data => dayjs.unix(data.at.seconds).add(1, `day`).unix() > dayjs().unix());

   income24Hour.push({
      coins: coinsEarned,
      at: new Timestamp(dayjs(message.createdAt).unix(), 0)
   });


   // update the user's currency data
   const data = {
      "24-hour-stats.expenditure": expenditure24Hour,
      "24-hour-stats.income":      income24Hour,
      "can-earn-coins-at":         new Timestamp(dayjs().add(1, `minute`).unix(), 0),
      coins:                       FieldValue.increment(coinsEarned),
      "total-coins-earned":        FieldValue.increment(coinsEarned)
   };

   if (userCurrencyDocSnap.exists)
      await userCurrencyDocRef.update(data);
   else
      await userCurrencyDocRef.set(data);
};