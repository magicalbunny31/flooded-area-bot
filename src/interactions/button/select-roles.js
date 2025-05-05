/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import Discord from "discord.js";
import { strip } from "@magicalbunny31/pawesome-utility-stuffs";

/**
 * @param {import("@flooded-area-bot-types/client").ButtonInteraction} interaction
 */
export default async interaction => {
   // defer the interaction
   await interaction.deferReply({
      ephemeral: true
   });


   // roles
   const roles = interaction.member.roles.cache;

   const mentionRoles = {
      "looking-for-group":   `1002622412258545684`, // TODO should be removed
      "events":              FloodedAreaCommunityRoles.Events,
      "polls":               FloodedAreaCommunityRoles.Opinions,
      "updates-sneak-peeks": FloodedAreaCommunityRoles.UpdatesSneakPeeks,
      "giveaways":           FloodedAreaCommunityRoles.Giveaways,
      "challenges":          FloodedAreaCommunityRoles.Challenges,
      "playtest":            FloodedAreaCommunityRoles.Playtest,
      "archived-access":     FloodedAreaCommunityRoles.ArchivedAccess,
      "qotd":                FloodedAreaCommunityRoles.QoTD
   };

   const pronounRoles = {
      "he-him":           FloodedAreaCommunityRoles.HeHim,
      "she-her":          FloodedAreaCommunityRoles.SheHer,
      "they-them":        FloodedAreaCommunityRoles.TheyThem,
      "other-pronouns":   FloodedAreaCommunityRoles.OtherPronouns,
      "any-pronouns":     FloodedAreaCommunityRoles.AnyPronouns,
      "ask-for-pronouns": FloodedAreaCommunityRoles.AskForPronouns
   };


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.StringSelectMenuBuilder()
               .setCustomId(`select-roles:mention-roles`)
               .setPlaceholder(`Select mention roles...`)
               .setOptions(
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Looking For Group`)
                     .setValue(`looking-for-group`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(mentionRoles[`looking-for-group`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Events`)
                     .setValue(`events`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(mentionRoles[`events`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Polls`)
                     .setValue(`polls`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(mentionRoles[`polls`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Updates/Sneak Peeks`)
                     .setValue(`updates-sneak-peeks`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(mentionRoles[`updates-sneak-peeks`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Giveaways`)
                     .setValue(`giveaways`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(mentionRoles[`giveaways`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Challenges`)
                     .setValue(`challenges`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(mentionRoles[`challenges`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Playtest`)
                     .setValue(`playtest`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(mentionRoles[`playtest`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`Archived Access`)
                     .setValue(`archived-access`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(mentionRoles[`archived-access`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`QoTD`)
                     .setValue(`qotd`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(mentionRoles[`qotd`]))
               )
               .setMinValues(0)
               .setMaxValues(9)
         ),

      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.StringSelectMenuBuilder()
               .setCustomId(`select-roles:pronoun-roles`)
               .setPlaceholder(`Select pronoun roles...`)
               .setOptions(
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`he/him`)
                     .setValue(`he-him`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(pronounRoles[`he-him`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`she/her`)
                     .setValue(`she-her`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(pronounRoles[`she-her`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`they/them`)
                     .setValue(`they-them`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(pronounRoles[`they-them`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`other pronouns`)
                     .setValue(`other-pronouns`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(pronounRoles[`other-pronouns`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`ask for pronouns`)
                     .setValue(`ask-for-pronouns`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(pronounRoles[`ask-for-pronouns`])),
                  new Discord.StringSelectMenuOptionBuilder()
                     .setLabel(`any pronouns`)
                     .setValue(`any-pronouns`)
                     .setEmoji(interaction.client.allEmojis.mention)
                     .setDefault(roles.has(pronounRoles[`any-pronouns`]))
               )
               .setMinValues(0)
               .setMaxValues(6)
         ),

      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`what-are-pronouns`)
               .setLabel(`What are pronouns?`)
               .setEmoji(`❓`)
               .setStyle(Discord.ButtonStyle.Secondary)
         )
   ];


   // edit the deferred interaction
   await interaction.editReply({
      content: strip`
         Pronoun roles are simply here to make it easier for everyone to refer to one another!
         Misusing the roles will result in punishment: please be mature about this.
         ~ ${Discord.roleMention(FloodedAreaCommunityRoles.ModerationTeam)} ${interaction.client.allEmojis.happ}
      `,
      components
   });
};