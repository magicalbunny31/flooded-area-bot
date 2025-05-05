/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../data/guilds.js";

import Discord from "discord.js";
import { Timestamp } from "@google-cloud/firestore";


export const name = Discord.Events.GuildMemberAdd;


/**
 * @param {import("@flooded-area-bot-types/client").GuildMember} member
 */
export default async member => {
   // this member isn't from these guilds
   if (![ FloodedAreaCommunity, UniverseLaboratories ].includes(member.guild.id))
      return;


   // database
   const whoJoinedAtDocRef  = member.client.firestoreLegacy.collection(`who-joined-at`).doc(member.guild.id);
   const whoJoinedAtDocSnap = await whoJoinedAtDocRef.get();
   const whoJoinedAtDocData = whoJoinedAtDocSnap.data() || {};


   // this member is already in the data
   if (member.id in whoJoinedAtDocData)
      return;


   // add this member to the data
   await whoJoinedAtDocRef.update({
      [member.id]: new Timestamp(
         Math.floor(member.joinedTimestamp / 1000),
         0
      )
   });
};