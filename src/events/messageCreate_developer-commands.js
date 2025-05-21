import developers from "../data/developers.js";

import Discord from "discord.js";
import { developerCommands } from "@magicalbunny31/fennec-utilities";


export const name = Discord.Events.MessageCreate;


/**
 * @param {import("@flooded-area-bot-types/client").Message} message
 */
export default async message => await developerCommands(
   message,
   message.client.fennec,
   developers,
   message.client.allEmojis
);