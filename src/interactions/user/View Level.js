/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../../data/guilds.js";

import Discord from "discord.js";
import { colours, strip } from "@magicalbunny31/pawesome-utility-stuffs";


export const guilds = [ FloodedAreaCommunity, UniverseLaboratories ];

export const data = new Discord.ContextMenuCommandBuilder()
   .setType(Discord.ApplicationCommandType.User)
   .setName(`View Level`);


/**
 * @param {import("@flooded-area-bot-types/client").UserContextMenuCommandInteraction} interaction
 */
export default async interaction => {
   // options
   const user = interaction.targetUser;


   // function to get experience needed from a level
   const getExperienceNeeded = level => 10 * Math.pow(level, 2);


   // function to get a level from experience
   const getLevel = experience => Math.floor(Math.sqrt(experience / 10));


   // data to show
   const data = {
      [FloodedAreaCommunity]: {
         colour: colours.flooded_area_bot
      },

      [UniverseLaboratories]: {
         colour: colours.purple
      }
   }[interaction.guild.id];


   // emojis
   const progressBar = {
      "flooded-area": {
         empty: {
            start:  interaction.client.allEmojis.progress_start_empty,
            middle: interaction.client.allEmojis.progress_middle_empty,
            end:    interaction.client.allEmojis.progress_end_empty
         },
         full: {
            start:  interaction.client.allEmojis.progress_start_full,
            middle: interaction.client.allEmojis.progress_middle_full,
            end:    interaction.client.allEmojis.progress_end_full
         }
      },

      "pride": {
         empty: {
            start:  interaction.client.allEmojis.progress_start_empty_pride,
            middle: interaction.client.allEmojis.progress_middle_empty_pride,
            end:    interaction.client.allEmojis.progress_end_empty_pride
         },
         full: {
            start:  interaction.client.allEmojis.progress_start_full_pride,
            middle: interaction.client.allEmojis.progress_middle_full_pride,
            end:    interaction.client.allEmojis.progress_end_full_pride
         }
      },

      "trans": {
         empty: {
            start:  interaction.client.allEmojis.progress_start_empty_trans,
            middle: interaction.client.allEmojis.progress_middle_empty_trans,
            end:    interaction.client.allEmojis.progress_end_empty_trans
         },
         full: {
            start:  interaction.client.allEmojis.progress_start_full_trans,
            middle: interaction.client.allEmojis.progress_middle_full_trans,
            end:    interaction.client.allEmojis.progress_end_full_trans
         }
      }
   };


   // this is a bot
   if (user.bot)
      return await interaction.reply({
         content: `### ❌ Bots aren't part of the levelling system`,
         ephemeral: true
      });


   // defer the interaction
   await interaction.deferReply({
      ephemeral: true
   });


   // database
   const userLevelsDocRef  = interaction.client.firestoreLegacy.collection(`levels`).doc(interaction.guild.id).collection(`users`).doc(user.id);
   const userLevelsDocSnap = await userLevelsDocRef.get();
   const userLevelsDocData = userLevelsDocSnap.data() || {};

   const experience = userLevelsDocData.experience || 0;
   const level      = getLevel(experience);

   const selectedProgressBar = userLevelsDocData[`progress-bar`] || `flooded-area`;


   // create a bar showing the experience towards the next level
   const levelExperienceThreshold        = getExperienceNeeded(level);
   const nextLevelExperienceThreshold    = getExperienceNeeded(level + 1);

   const experienceToNextLevel           = experience - levelExperienceThreshold;
   const experienceToNextLevelPercentage = Math.round((experienceToNextLevel / (nextLevelExperienceThreshold - levelExperienceThreshold)) * 100);
   const experienceToNextLevelFraction   = Math.round(experienceToNextLevelPercentage / 10);

   let bar = ``;

   for (let i = 0; i < 10; i ++) {
      const barType = (() => {
         switch (i) {
            case 0:  return `start`;
            default: return `middle`;
            case 9:  return `end`;
         };
      })();

      if (i + 1 <= experienceToNextLevelFraction)
         bar += progressBar[selectedProgressBar].full[barType];
      else
         bar += progressBar[selectedProgressBar].empty[barType];
   };


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(user.accentColor || (await user.fetch(true)).accentColor || data.colour)
         .setAuthor({
            name: `@${user.username}`,
            iconURL: user.displayAvatarURL()
         })
         .setTitle(`🌟 Levelling statistics`)
         .setFields({
            name: `💬 Experience`,
            value: `> \`${experience.toLocaleString()} experience\``,
            inline: true
         }, {
            name: `🏅 Level`,
            value: `> \`Level ${level}\``,
            inline: true
         }, {
            name: `📈 Experience Towards Next Level`,
            value: strip`
               > \`Level ${level.toLocaleString()}\` ${bar} \`Level ${level + 1}\`
               > ${(nextLevelExperienceThreshold - experience).toLocaleString()} more experience to level up
            `
         })
         .setFooter({
            text: strip`
               ✨ You earn 1 experience for every message you send in this server, per 5 seconds.
               💭 Your experience is a metric of your messages sent over a long period of time.
            `
         })
   ];


   // components
   const components = [
      ...user.id === interaction.user.id
         ? [
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.StringSelectMenuBuilder()
                     .setCustomId(`levels-progress-bar`)
                     .setPlaceholder(`Select a progress bar...`)
                     .setOptions(
                        new Discord.StringSelectMenuOptionBuilder()
                           .setValue(`flooded-area`)
                           .setLabel(`Default`)
                           .setEmoji(interaction.client.allEmojis.flooded_area)
                           .setDefault(selectedProgressBar === `flooded-area`),
                        new Discord.StringSelectMenuOptionBuilder()
                           .setValue(`pride`)
                           .setLabel(`Progress Pride`)
                           .setEmoji(`🏳️‍🌈`)
                           .setDefault(selectedProgressBar === `pride`),
                        new Discord.StringSelectMenuOptionBuilder()
                           .setValue(`trans`)
                           .setLabel(`Transgender`)
                           .setEmoji(`🏳️‍⚧️`)
                           .setDefault(selectedProgressBar === `trans`)
                     )
               )
         ]
         : [],

      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`levelling-rewards`)
               .setLabel(`Levelling rewards`)
               .setStyle(Discord.ButtonStyle.Secondary)
               .setEmoji(`📃`),
            new Discord.ButtonBuilder()
               .setCustomId(`levels-calculation`)
               .setLabel(`How are levels calculated?`)
               .setStyle(Discord.ButtonStyle.Secondary)
               .setEmoji(`❓`)
         )
   ];


   // edit the deferred interaction
   await interaction.editReply({
      embeds,
      components
   });
};