/**
 * TODO
 * this file has not yet been refactored~
 */


import cache from "../../data/cache.js";
import { FloodedAreaCommunity as FloodedAreaCommunityChannels } from "../../data/channels.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";
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
            displayName: player?.displayName || player?.name || null,
            name: player?.name,
            id: player?.id
         };
         cache.set(`bloxlink-linked-account`, bloxlinkLinkedAccounts);
      };
   };


   // this user is blacklisted
   if (interaction.member.roles.cache.has(FloodedAreaCommunityRoles.ReportAPlayerBanned))
      return await interaction.editReply({
         embeds: [
            new Discord.EmbedBuilder()
               .setColor(colours.red)
               .setDescription(strip`
                  ### 🚫 Can't open menu
                  > - You've been blacklisted from ${interaction.channel}.
                  > - If you believe this is in error, contact a member of the ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)}.
               `)
         ],
         components: []
      });


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(colours.flooded_area_bot)
         .setTitle(`📣 Report a Player`)
         .setDescription(strip`
            ### ${interaction.client.allEmojis.bun_paw_wave} ${choice([ `Hello`, `Hi`, `Welcome` ])}, ${interaction.user}!
            > - If you find anyone who is breaking our ${Discord.channelMention(FloodedAreaCommunityChannels.Rules)} in ${Discord.hyperlink(`Flooded Area`, `https://www.roblox.com/games/3976767347/Flooded-Area`)}, you can report them to us here.
            > - The ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} may not be able to respond to tickets immediately;
            >  - If you need them to join your server (due to someone hacking) **and you're unable to get proof of them**, you should mod call instead.
            > - Uploading images/videos/files for proof but they exceed Discord's file upload limits? Consider using a file upload site such as [Catbox](https://catbox.moe), [YouTube](https://www.youtube.com), or others.
            > - You can also ${Discord.hyperlink(`report players to Roblox`, `https://en.help.roblox.com/hc/en-us/articles/203312410-How-to-Report-Rule-Violations`)} too, if you think it's necessary.
            > - Remember that you can always ${Discord.hyperlink(`block`, `https://en.help.roblox.com/hc/en-us/articles/203314270-How-to-Block-Another-User`)} or ${Discord.hyperlink(`mute`, `https://alvarotrigo.com/blog/mute-someone-roblox`)} any players that you don't want to interact with in chat.
         `)
   ];


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.StringSelectMenuBuilder()
               .setCustomId(`report-a-player:0`)
               .setPlaceholder(`Select an option that best describes what you are reporting someone for`)
               .setOptions(
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Started a false votekick`)
                     .setEmoji(`🥾`)
                     .setValue(`false-votekicking`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Griefed me or someone else`)
                     .setEmoji(`💣`)
                     .setValue(`griefing`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Bypassing, swearing, or being inappropriate in chat/game`)
                     .setEmoji(`🗯️`)
                     .setValue(`bypassing`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Being toxic or harassing others`)
                     .setEmoji(`💢`)
                     .setValue(`toxicity`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Bigotry`)
                     .setEmoji(`🗣️`)
                     .setValue(`bigotry`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Has an inappropriate avatar or built something explicit or sexual`)
                     .setEmoji(`🔞`)
                     .setValue(`inappropriate`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Using exploits, cheats, or hacks`)
                     .setEmoji(`💻`)
                     .setValue(`exploiting`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Abusing a bug or glitch to gain an unfair advantage`)
                     .setEmoji(`🐛`)
                     .setValue(`bug-abuse`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Evading a ban with an alt account`)
                     .setEmoji(`👥`)
                     .setValue(`ban-evasion`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Moderator abusing their powers`)
                     .setEmoji(`🚨`)
                     .setValue(`moderator-abuse`),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Another reason...`)
                     .setEmoji(`❓`)
                     .setValue(`other`)
               )
         )
   ];


   // edit the deferred interaction
   await interaction.editReply({
      embeds,
      components
   });
};