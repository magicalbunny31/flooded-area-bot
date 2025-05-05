/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../../data/guilds.js";

import Discord from "discord.js";
import { colours, strip, wait } from "@magicalbunny31/pawesome-utility-stuffs";


export const guilds = [ FloodedAreaCommunity, UniverseLaboratories ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`view-join-dates`)
   .setDescription(`View join dates and positions for a member or an index`)
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`at-position`)
         .setDescription(`View the member who joined this server at this position`)
         .addIntegerOption(
            new Discord.SlashCommandIntegerOption()
               .setName(`position`)
               .setDescription(`Position's member to search for`)
               .setMinValue(1)
               .setRequired(true)
         )
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`for-member`)
         .setDescription(`View a member's join position in this server`)
         .addUserOption(
            new Discord.SlashCommandUserOption()
               .setName(`member`)
               .setDescription(`Member's position to search for`)
               .setRequired(true)
         )
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // what command to run based on the subcommand
   const subcommand = interaction.options.getSubcommand();

   switch (subcommand) {


      case `at-position`: {
         // options
         const position = interaction.options.getInteger(`position`);


         // data to show
         const data = {
            [FloodedAreaCommunity]: {
               colour: colours.flooded_area_bot
            },

            [UniverseLaboratories]: {
               colour: colours.purple
            }
         }[interaction.guild.id];


         // function to get the ordinal suffix of a number
         // https://stackoverflow.com/a/13627586
         const getOrdinalSuffix = number => {
            const oneth = number % 10;
            const tenth = number % 100;

            switch (true) {
               case oneth === 1 && tenth !== 11:
                  return `st`;
               case oneth === 2 && tenth !== 12:
                  return `nd`;
               case oneth === 3 && tenth !== 13:
                  return `rd`;
               default:
                  return `th`;
            };
         };


         // defer the interaction
         await interaction.deferReply();


         // fetch members in this guild and sort them by their join date
         const currentMembers = (
            await (async () => {
               const fetchedMembers = [];
               let lastMember;

               while (true) {
                  const members = (await interaction.guild.members.list({ limit: 1000, ...fetchedMembers.length ? { after: fetchedMembers.at(-1).id } : {} }));

                  fetchedMembers.push(...members.values());

                  if (lastMember?.id === fetchedMembers.at(-1).id)
                     break;

                  else
                     lastMember = fetchedMembers.at(-1);

                  await wait(1000);
               };

               return fetchedMembers;
            })()
         )
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);


         // fetch all historical members for this guild and sort them by their join date
         const historicalMembers = (
            await (async () => {
               const members = (await interaction.client.firestoreLegacy.collection(`who-joined-at`).doc(interaction.guild.id).get()).data() || {};
               return Object.entries(members)
                  .map(([ id, timestamp ]) => ({ id, joinedTimestamp: timestamp.seconds }));
            })()
         )
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);


         // get this join position's member in the arrays
         const currentMember = currentMembers
            .filter((v, i, s) =>
               i === s.findIndex(member => member.id === v.id)
            )
            .at(position - 1);

         const historicalMember = historicalMembers
            .filter((v, i, s) =>
               i === s.findIndex(member => member.id === v.id)
            )
            .at(position - 1);


         // this currentMember as a user
         const currentUser = currentMember
            ? currentMember.user || await interaction.client.users.fetch(currentMember.id)
            : undefined;

         const currentUserColour = currentUser
            ? currentUser.accentColor || (await interaction.client.users.fetch(currentMember.id, { force: true })).accentColor
            : undefined;


         // this historicalMember as a user
         const historicalUser = historicalMember
            ? historicalMember.user || await interaction.client.users.fetch(historicalMember.id)
            : undefined;

         const historicalUserColour = historicalUser
            ? historicalUser.accentColor || (await interaction.client.users.fetch(historicalMember.id, { force: true })).accentColor
            : undefined;


         // embeds
         const embeds = [
            new Discord.EmbedBuilder()
               .setColor(
                  position <= currentMembers.length
                     ? currentUserColour || data.colour
                     : colours.red
               )
               .setAuthor(
                  position <= currentMembers.length
                     ? {
                        name:    `@${currentUser.username}`,
                        iconURL: currentUser.displayAvatarURL()
                     }
                     : null
               )
               .setDescription(
                  position <= currentMembers.length
                     ? strip`
                        ### 👤 They're currently the ${position.toLocaleString()}${getOrdinalSuffix(position)} member
                        > - Joined at ${Discord.time(currentMember.joinedAt)}
                     `
                     : `### ❌ Nobody is currently the ${position.toLocaleString()}${getOrdinalSuffix(position)} member`
               )
               .setFooter({
                  text: `${currentMembers.length.toLocaleString()} members`,
                  iconURL: interaction.guild.iconURL()
               }),

            new Discord.EmbedBuilder()
               .setColor(
                  position <= historicalMembers.length
                     ? historicalUserColour || data.colour
                     : colours.red
               )
               .setAuthor(
                  position <= historicalMembers.length
                     ? {
                        name:    `@${historicalUser.username}`,
                        iconURL: historicalUser.displayAvatarURL()
                     }
                     : null
               )
               .setDescription(
                  position <= historicalMembers.length
                     ? strip`
                        ### 👤 They're historically the ${position.toLocaleString()}${getOrdinalSuffix(position)} member
                        > - First joined at ${Discord.time(historicalMember.joinedTimestamp)}
                     `
                     : `### ❌ Nobody was historically the ${position.toLocaleString()}${getOrdinalSuffix(position)} member`
               )
               .setFooter({
                  text: `${historicalMembers.length.toLocaleString()} total members`,
                  iconURL: interaction.guild.iconURL()
               })
         ];


         // edit the deferred interaction
         await interaction.editReply({
            embeds
         });


         // break out
         break;
      };


      case `for-member`: {
         // options
         const user   = interaction.options.getUser(`member`);
         const member = interaction.options.getMember(`member`);


         // data to show
         const data = {
            [FloodedAreaCommunity]: {
               colour: colours.flooded_area_bot
            },

            [UniverseLaboratories]: {
               colour: colours.purple
            }
         }[interaction.guild.id];


         // function to get the ordinal suffix of a number
         // https://stackoverflow.com/a/13627586
         const getOrdinalSuffix = number => {
            const oneth = number % 10;
            const tenth = number % 100;

            switch (true) {
               case oneth === 1 && tenth !== 11:
                  return `st`;
               case oneth === 2 && tenth !== 12:
                  return `nd`;
               case oneth === 3 && tenth !== 13:
                  return `rd`;
               default:
                  return `th`;
            };
         };


         // defer the interaction
         await interaction.deferReply();


         // fetch members in this guild and sort them by their join date
         const currentMembers = (
            await (async () => {
               const fetchedMembers = [];
               let lastMember;

               while (true) {
                  const members = (await interaction.guild.members.list({ limit: 1000, ...fetchedMembers.length ? { after: fetchedMembers.at(-1).id } : {} }));

                  fetchedMembers.push(...members.values());

                  if (lastMember?.id === fetchedMembers.at(-1).id)
                     break;

                  else
                     lastMember = fetchedMembers.at(-1);

                  await wait(1000);
               };

               return fetchedMembers;
            })()
         )
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);


         // fetch all historical members for this guild and sort them by their join date
         const historicalMembers = (
            await (async () => {
               const members = (await interaction.client.firestoreLegacy.collection(`who-joined-at`).doc(interaction.guild.id).get()).data() || {};
               return Object.entries(members)
                  .map(([ id, timestamp ]) => ({ id, joinedTimestamp: timestamp.seconds }));
            })()
         )
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);


         // get this member's join position in the array
         const currentPosition = currentMembers
            .filter((v, i, s) =>
               i === s.findIndex(member => member.id === v.id)
            )
            .findIndex(member => member.id === user.id) + 1;

         const historicalPosition = historicalMembers
            .filter((v, i, s) =>
               i === s.findIndex(member => member.id === v.id)
            )
            .findIndex(member => member.id === user.id) + 1;


         // embeds
         const userColour = user.accentColor || (await interaction.client.users.fetch(user.id, { force: true })).accentColor;

         const historicalMemberJoinedTimestamp = historicalMembers[historicalPosition - 1]?.joinedTimestamp;

         const embeds = [
            new Discord.EmbedBuilder()
               .setColor(
                  currentPosition
                     ? userColour || data.colour
                     : colours.red
               )
               .setAuthor(
                  currentPosition
                     ? {
                        name:    `@${user.username}`,
                        iconURL: user.displayAvatarURL()
                     }
                     : null
               )
               .setDescription(
                  currentPosition
                     ? strip`
                        ### 👤 They're currently the ${currentPosition.toLocaleString()}${getOrdinalSuffix(currentPosition)} member
                        > - Joined at ${Discord.time(member.joinedAt)}
                     `
                     : `### ❌ ${user} isn't in this server`
               )
               .setFooter({
                  text: `${currentMembers.length.toLocaleString()} members`,
                  iconURL: interaction.guild.iconURL()
               }),



            new Discord.EmbedBuilder()
               .setColor(
                  historicalPosition
                     ? userColour || data.colour
                     : colours.red
               )
               .setAuthor(
                  historicalPosition
                     ? {
                        name:    `@${user.username}`,
                        iconURL: user.displayAvatarURL()
                     }
                     : null
               )
               .setDescription(
                  historicalPosition
                     ? strip`
                        ### 👤 They're historically the ${historicalPosition.toLocaleString()}${getOrdinalSuffix(historicalPosition)} member
                        > - First joined at ${Discord.time(historicalMemberJoinedTimestamp)}
                     `
                     : `### ❌ ${user} has never joined this server`
               )
               .setFooter({
                  text: `${historicalMembers.length.toLocaleString()} total members`,
                  iconURL: interaction.guild.iconURL()
               })
         ];


         // edit the deferred interaction
         await interaction.editReply({
            embeds
         });


         // break out
         break;
      };


   };
};