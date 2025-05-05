/**
 * TODO
 * this file has not yet been refactored~
 */


import { UniverseLaboratories } from "../../data/guilds.js";

import Discord from "discord.js";


export const guilds = [ UniverseLaboratories ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`update-roblosecurity-cookie`)
   .setDescription(`Update the ROBLOSECURITY cookie that's used in requests`)
   .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator);


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // modal
   const modal = new Discord.ModalBuilder()
      .setCustomId(`update-roblosecurity-cookie`)
      .setTitle(`update ROBLOSECURITY cookie`)
      .setComponents(
         new Discord.ActionRowBuilder()
            .setComponents(
               new Discord.TextInputBuilder()
                  .setCustomId(`roblosecurity-cookie`)
                  .setLabel(`ROBLOSECURITY COOKIE`)
                  .setPlaceholder(`input the ROBLOSECURITY cookie here..`)
                  .setStyle(Discord.TextInputStyle.Paragraph)
                  .setRequired(true)
            )
      );


   // show the modal
   await interaction.showModal(modal);
};