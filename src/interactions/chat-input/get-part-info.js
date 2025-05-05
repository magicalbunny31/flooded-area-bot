/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import { FloodedAreaCommunity } from "../../data/guilds.js";

import Discord from "discord.js";


export const guilds = [ FloodedAreaCommunity ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`get-part-info`)
   .setDescription(`Get a part's id, for spawning with mod/admin panel`);


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // reply to the interaction
   await interaction.reply({
      content: `See ${Discord.channelMention(FloodedAreaCommunityChannels.PartIds)} for a list of the parts.`,
      ephemeral: true
   });
};