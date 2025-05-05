/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import { FloodedAreaCommunity } from "../../data/guilds.js";

import Discord from "discord.js";


export const guilds = [ FloodedAreaCommunity ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`get-map-info`)
   .setDescription(`Get a map's id, for queuing maps with mod/admin panel`);


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // reply to the interaction
   await interaction.reply({
      content: `See ${Discord.channelMention(FloodedAreaCommunityChannels.MapIds)} for a list of the maps.`,
      ephemeral: true
   });
};