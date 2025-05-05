/**
 * TODO
 * this file has not yet been refactored~
 */


import cache from "../../data/cache.js";
import { FloodedAreaCommunity } from "../../data/guilds.js";
import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import Discord from "discord.js";
import { strip } from "@magicalbunny31/pawesome-utility-stuffs";


export const guilds = [ FloodedAreaCommunity ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`create-event`)
   .setDescription(`Create a scheduled event`)
   .addAttachmentOption(
      new Discord.SlashCommandAttachmentOption()
         .setName(`cover-image`)
         .setDescription(`Upload a cover image for this scheduled event`)
         .setRequired(false)
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // options
   const coverImage = interaction.options.getAttachment(`cover-image`);


   // this member's roles
   const roles = interaction.member.roles.cache;


   // role constants
   const moderationTeam = FloodedAreaCommunityRoles.ModerationTeam;
   const eventHost      = FloodedAreaCommunityRoles.EventHost;


   // @Moderation Team or @Event Host role needed to @mention @Events
   if (![ moderationTeam, eventHost ].some(role => roles.has(role)))
      return await interaction.reply({
         content: `### ❌ You need the roles ${Discord.roleMention(moderationTeam)} or ${Discord.roleMention(eventHost)} to create events`,
         allowedMentions: {
            parse: []
         },
         ephemeral: true
      });


   // this attachment isn't an image
   if (coverImage && ![ `jpg`, `jpeg`, `png`, `gif` ].some(ext => coverImage.url.toLowerCase().endsWith(ext)))
      return await interaction.reply({
         content: strip`
            ### ❌ Invalid cover image
            > - Only \`.jpg\`, \`.jpeg\`, \`.png\` and \`.gif\` images are supported. 
         `,
         ephemeral: true
      });


   // cache the options
   cache.set(interaction.id, {
      image: coverImage?.url
   });


   const modal = new Discord.ModalBuilder()
      .setCustomId(`create-event:${interaction.id}`)
      .setTitle(`🗓️ What's your event about?`)
      .setComponents(
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`name`)
                  .setLabel(`EVENT TOPIC`)
                  .setPlaceholder(`What's your event?`)
                  .setStyle(Discord.TextInputStyle.Short)
                  .setMaxLength(100)
                  .setRequired(true)
            ),
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`description`)
                  .setLabel(`DESCRIPTION`)
                  .setPlaceholder(`Tell people a little more about your event. Markdown, new lines and links are supported.`)
                  .setStyle(Discord.TextInputStyle.Paragraph)
                  .setMaxLength(1000)
                  .setRequired(false)
            )
      );


   // show the modal
   await interaction.showModal(modal);
};