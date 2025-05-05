/**
 * TODO
 * this file has not yet been refactored~
 */



import { FloodedAreaCommunity } from "../../data/guilds.js";

import Discord from "discord.js";
import { strip } from "@magicalbunny31/pawesome-utility-stuffs";


export const guilds = [ FloodedAreaCommunity ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`map-submissions`)
   .setDescription(`Access the map submissions commands`)
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`add`)
         .setDescription(`Add a user to this ticket`)
         .addUserOption(
            new Discord.SlashCommandUserOption()
               .setName(`user`)
               .setDescription(`User to add`)
               .setRequired(true)
         )
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`remove`)
         .setDescription(`Remove a user from this ticket`)
         .addUserOption(
            new Discord.SlashCommandUserOption()
               .setName(`user`)
               .setDescription(`User to add`)
               .setRequired(true)
         )
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`close`)
         .setDescription(`Close this ticket`)
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // what command to run based on the subcommand
   const subcommand = interaction.options.getSubcommand();

   switch (subcommand) {


      case `add`: {
         // options
         const user = interaction.options.getUser(`user`);


         // this isn't a ticket
         if (interaction.channel.parentId !== `988808403738591294`)
            return await interaction.reply({
               content: `### This command only works for <#977297300567244801> tickets`,
               flags: [
                  Discord.MessageFlags.Ephemeral
               ]
            });


         // defer the interaction
         await interaction.deferReply({
            ephemeral: true
         });


         // add this user to the channel
         await interaction.channel.permissionOverwrites.edit(user, {
            "ViewChannel": true
         });


         // edit the deferred reply
         await interaction.editReply({
            content: strip`
               ### ${user} has been added to ${interaction.channel}
               You should let ${user} know that they can view ${interaction.channel} now.
            `
         });


         // break out
         break;
      };


      case `close`: {
         await interaction.reply({
            content: strip`
               ### Message from <@490178047325110282>:
               > - hai so i can't actually be bothered to create ${interaction.client.allEmojis.slash_command} </map-submissions close:${interaction.commandId}> if this is all "temporary"
               > - leave ${interaction.channel} here for archival purposes whilst i think of a solution! hopefully!!
               > - if there's something seriously wrong, you have permissions to delete this channel so please go do that instead
            `,
            flags: [
               Discord.MessageFlags.Ephemeral
            ]
         });


         // break out
         break;
      };


      case `remove`: {
         // options
         const user = interaction.options.getUser(`user`);


         // this isn't a ticket
         if (interaction.channel.parentId !== `988808403738591294`)
            return await interaction.reply({
               content: `### This command only works for <#977297300567244801> tickets`,
               flags: [
                  Discord.MessageFlags.Ephemeral
               ]
            });


         // defer the interaction
         await interaction.deferReply({
            ephemeral: true
         });


         // remove this user from the channel
         await interaction.channel.permissionOverwrites.delete(user);


         // edit the deferred reply
         await interaction.editReply({
            content: strip`
               ### ${user} has been removed from ${interaction.channel}
            `
         });


         // break out
         break;
      };


   };
};