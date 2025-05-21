import path from "node:path";
import Discord from "discord.js";
import chalk from "chalk";
import { ApplicationStatisticsStatusName, NotificationType, notify } from "@magicalbunny31/fennec-utilities";
import { colours, respondToErrorInteraction } from "@magicalbunny31/pawesome-utility-stuffs";


export const name = Discord.Events.InteractionCreate;
export const once = false;


/**
 * @param {import("@flooded-area-bot-types/client").BaseInteraction} interaction
 */
export default async interaction => {
   // app is offline
   if (interaction.client.fennec.getApplicationStatusApplicationStatisticsStatus()?.name === ApplicationStatisticsStatusName.Offline)
      return await notify(interaction, interaction.client.fennec, NotificationType.Offline, interaction.client.allEmojis);


   // get this interaction's file
   const type = (() => {
      switch (true) {
         case interaction.isAutocomplete():              return `autocomplete`;
         case interaction.isButton():                    return `button`;
         case interaction.isChatInputCommand():          return `chat-input`;
         case interaction.isModalSubmit():               return `modal-submit`;
         case interaction.isAnySelectMenu():             return `select-menu`;
         case interaction.isUserContextMenuCommand():    return `user`;
      };
   })();

   const name = (() => {
      switch (type) {
         case `autocomplete`:
         case `chat-input`:
         case `user`:
            return interaction.commandName;
         case `button`:
         case `modal-submit`:
         case `select-menu`:
            return interaction.customId.split(`:`)[0];
      };
   })();

   const file = interaction.client.interactions[type]?.get(name);

   if (!file)
      return;


   try {
      // run this interaction
      await file.default(interaction);


   } catch (error) {
      // log this caught error
      const cwd = process.cwd();
      const file = import.meta.filename;
      const location = path.relative(cwd, file);

      console.error(chalk.hex(colours.flooded_area_bot)(`~ caught error in ${location}! see below for the error..`));
      console.line(error.stack ?? error ?? `no error..?`);

      try {
         const source = `${Discord.inlineCode(type)}/${Discord.inlineCode(name)}`;
         await interaction.client.fennec.postErrorLog(error, source, interaction.createdAt, interaction.id);
      } catch (error) {
         console.error(chalk.hex(colours.flooded_area_bot)(`~ ..the error handler failed to log this caught error in ${location}! see below for its error..`));
         console.line(error.stack ?? error ?? `no error..?`);
      };

      try {
         await respondToErrorInteraction(interaction, `https://nuzzles.dev/discord`, error);
      } catch (error) {
         console.error(chalk.hex(colours.flooded_area_bot)(`~ ..the error user response failed to log this caught error in ${location}! see below for its error..`));
         console.line(error.stack ?? error ?? `no error..?`);
      };
   };


   // announcement
   if (interaction.client.fennec.getAnnouncement())
      await notify(interaction, interaction.client.fennec, NotificationType.Announcement, interaction.client.allEmojis);
};