/**
 * TODO
 * this file has not yet been refactored~
 */


import cache from "../data/cache.js";

import Discord from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";


export const name = Discord.Events.VoiceStateUpdate;


/**
 * @param {import("@flooded-area-bot-types/client").VoiceState} oldState
 * @param {import("@flooded-area-bot-types/client").VoiceState} newState
 */
export default (oldState, newState) => {
   // the bot isn't in the voice channel of this VoiceState
   if (!(newState.channel?.members.get(newState.client.user.id) || oldState.channel?.members.get(newState.client.user.id)))
      return;


   // this guild
   const guildId = newState.guild.id || oldState.guild.id;


   if (newState.channel?.members.size === 1 || oldState.channel?.members.size === 1) { // the bot is alone in the voice channel
      // create a timeout leave this voice channel and remove the cache entry in one minute
      const oneMinute = 60000;
      const timeout = setTimeout(() => {
         const connection = getVoiceConnection(guildId);
         if (connection) {
            connection.destroy();
            cache.del(`music-player:${guildId}`);
         };
      }, oneMinute);

      // set this timeout
      newState.client.voiceChannelDisconnector.set(guildId, timeout);


   } else { // the bot isn't alone in the voice channel
      // create a timeout leave this voice channel (if it exists)
      const timeout = newState.client.voiceChannelDisconnector.get(guildId);
      if (timeout)
         clearTimeout(timeout);

      // delete this timeout
      newState.client.voiceChannelDisconnector.delete(guildId);
   };
};