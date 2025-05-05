/**
 * TODO
 * this file has not yet been refactored~
 */


import { UniverseLaboratories } from "../../data/guilds.js";

import Discord from "discord.js";
import Noblox from "noblox.js";
import crypto from "crypto";
import { strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ModalSubmitInteraction} interaction
 */
export default async interaction => {
   // modal info
   const [ _modal ] = interaction.customId.split(`:`);


   // defer the interaction
   await interaction.deferReply({
      ephemeral: true
   });


   // fields
   const roblosecurityCookie = interaction.fields.getTextInputValue(`roblosecurity-cookie`).trim();


   // validate that this cookie is correct
   const expectedUserId = 5631124345;

   const cookieIsValid = await (async () => {
      try {
         const loggedInUser = await Noblox.setCookie(roblosecurityCookie);
         return loggedInUser.UserID === expectedUserId;
      } catch (error) {
         return false;
      };
   })();

   if (!cookieIsValid)
      return await interaction.editReply({
         content: strip`
            ### ❌ looks like this \`.ROBLOSECURITY\` cookie is invalid..
            > - make sure you've copied the whole string (including the warning at the start) and that you've removed any \`"\`s within it too
            > - the \`.ROBLOSECURITY\` cookie should correspond to ${Discord.hyperlink(`@UniverseLabMLoader`, `https://www.roblox.com/users/${expectedUserId}/profile`)}'s account - not anyone else's!
         `
      });


   // encrypt the cookie and update it in the database
   const cipher = crypto.createCipheriv(`aes-256-cbc`, Buffer.from(process.env.ROBLOSECURITY_KEY, `hex`), Buffer.from(process.env.ROBLOSECURITY_IV, `hex`));
   const encryptedCookie = Buffer.concat([ cipher.update(roblosecurityCookie), cipher.final() ]);

   await interaction.client.firestoreLegacy.collection(`bot-model-submission`).doc(UniverseLaboratories).update({
      ROBLOSECURITY: encryptedCookie
   });


   // edit the deferred interaction
   await interaction.editReply({
      content: `### ✅ updated \`.ROBLOSECURITY\` cookie!`
   });
};