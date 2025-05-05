/**
 * TODO
 * this file has not yet been refactored~
 */


import cache from "../../data/cache.js";
import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import userAgent from "../../data/user-agent.js";

import Discord from "discord.js";
import { colours, choice, strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // button info
   const [ _button ] = interaction.customId.split(`:`);


   // defer the interaction
   await interaction.deferReply({
      ephemeral: true
   });


   // set this user's bloxlink linked account in the cache
   if (!cache.get(`bloxlink-linked-account`)?.[interaction.user.id]) {
      const playerId = await (async () => {
         const response = await fetch(`https://api.blox.link/v4/public/guilds/${interaction.guild.id}/discord-to-roblox/${interaction.user.id}`, {
            headers: {
               "Accept":        `application/json`,
               "Authorization": process.env[`BLOXLINK_SERVER_KEY_${interaction.guild.id}`],
               "User-Agent":    userAgent
            }
         });

         if (!response.ok)
            return null;

         const data = await response.json();
         return data.robloxID;
      })();

      // get this player's roblox account
      const player = await (async () => {
         const response = await fetch(`https://users.roblox.com/v1/users/${playerId}`, {
            headers: {
               "Content-Type": `application/json`,
               "User-Agent": userAgent
            }
         });

         if (!response.ok)
            return null;

         return await response.json();
      })();

      if (player) {
         const bloxlinkLinkedAccounts = cache.get(`bloxlink-linked-account`) || {};
         bloxlinkLinkedAccounts[interaction.user.id] = {
            displayName: player.displayName || player.name,
            name: player.name,
            id: player.id
         };
         cache.set(`bloxlink-linked-account`, bloxlinkLinkedAccounts);
      };
   };


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(colours.flooded_area_bot)
         .setTitle(`🔨 Ban Appeals`)
         .setDescription(strip`
            ### ${interaction.client.allEmojis.bun_paw_wave} ${choice([ `Hello`, `Hi`, `Welcome` ])}, ${interaction.user}!
            > - All players have the right to appeal against moderative actions against them in ${Discord.channelMention(FloodedAreaCommunityChannels.Rules)}.
            > - We try hard to only moderate when necessary, but we're not perfect: mistakes may happen!
            > - Note that we can't help you with actions taken against your Roblox account - if you wish to appeal against that, contact them via their ${Discord.hyperlink(`support forum`, `https://www.roblox.com/support`)}.

            ### ✅ You can submit an appeal for...
            > - Moderation taken for a reason you don't know
            > - A ban that you think is too harsh/long
            > - Still being banned after your ban gets appealed
            > - Believing we banned the wrong player

            ### ❌ You cannot submit an appeal for...
            > - A votekick ban
            > - Being banned from Roblox
            > - Not being banned from ${Discord.hyperlink(`Flooded Area`, `https://www.roblox.com/games/3976767347/Flooded-Area`)}
            > - Apologising
            > - Confessing
            > - Pleading that you will change
            > - Acting clueless about your actions
            > - Being moderated for doing something you did knowingly against the ${Discord.channelMention(FloodedAreaCommunityChannels.Rules)}
         `)
         .setFooter({
            text: `If you think your account was falsely moderated, you can appeal below.`
         })
   ];


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`create-appeal`)
               .setLabel(`Create appeal`)
               .setEmoji(`🗒️`)
               .setStyle(Discord.ButtonStyle.Success)
         )
   ];


   // edit the deferred interaction
   await interaction.editReply({
      embeds,
      components
   });
};