/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../data/guilds.js";

import Keyv from "keyv";
import { KeyvFile } from "keyv-file";


export const cron = {
   // at every midnight
   minute: 0,
   hour: 0
};


/**
 * @param {import("@flooded-area-bot-types/client").default} client
 */
export default async client => {
   // guilds to fetch
   const guilds = [
      FloodedAreaCommunity,
      UniverseLaboratories
   ];


   // data to fetch
   const data = [
      `currency`,
      `levels`
   ];


   // for each guild..
   for (const guild of guilds) {


      // for each data..
      for (const section of data) {


         // keyv
         const keyv = new Keyv({
            store: new KeyvFile({
               filename: `./src/database/leaderboards/${section}.json`
            })
         });

         // fetch documents
         const { docs } = await client.firestoreLegacy.collection(section).doc(guild).collection(`users`).get();

         // data fetched from the documents
         const data = Object.assign({},
            ...docs
               .filter(doc => doc.id !== `456226577798135808`) // filter discord's placeholder deleted user id
               .map(doc =>
                  ({
                     [doc.id]: doc.data()
                  })
               )
         );

         // set the data into the leaderboards database
         await keyv.set(guild, data);


      };


   };
};