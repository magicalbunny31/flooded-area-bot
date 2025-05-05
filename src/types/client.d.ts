import Discord from "discord.js";
import { Firestore } from "@google-cloud/firestore";
import { emojis } from "@magicalbunny31/pawesome-utility-stuffs";
import { FennecClient } from "@magicalbunny31/fennec-utilities";


interface ApplicationCommandData {
   guilds?: string[];
   data: Discord.ApplicationCommandData;
};

interface AutocompleteCommandData extends Omit<ApplicationCommandData, "guilds" | "data" | "default"> {
   default: (interaction: Discord.AutocompleteInteraction, common: common) => Promise<void>;
};

interface ButtonCommandData extends Omit<ApplicationCommandData, "guilds" | "data" | "default"> {
   default: (interaction: Discord.ButtonInteraction, common: common) => Promise<void>;
};

interface ChatInputCommandData extends ApplicationCommandData {
   default: (interaction: Discord.ChatInputCommandInteraction) => Promise<void>;
};

interface ModalSubmitCommandData extends Omit<ApplicationCommandData, "guilds" | "data" | "default"> {
   default: (interaction: Discord.ModalSubmitInteraction) => Promise<void>;
};

interface AnySelectMenuCommandData extends Omit<ApplicationCommandData, "guilds" | "data" | "default"> {
   default: (interaction: Discord.AnySelectMenuInteraction) => Promise<void>;
};

interface UserCommandData extends ApplicationCommandData {
   default: (interaction: Discord.UserContextMenuCommandInteraction) => Promise<void>;
};


interface Client extends Discord.Client {
   allEmojis: ReturnType<typeof emojis>;
   fennec: FennecClient;
   firestore: Firestore;
   firestoreLegacy: Firestore; // TODO
   interactions: {
      "autocomplete": Discord.Collection<string, AutocompleteCommandData>;
      "button":       Discord.Collection<string, ButtonCommandData>;
      "chat-input":   Discord.Collection<string, ChatInputCommandData>;
      "modal-submit": Discord.Collection<string, ModalSubmitCommandData>;
      "select-menu":  Discord.Collection<string, AnySelectMenuCommandData>;
      "user":         Discord.Collection<string, UserCommandData>;
   };
   voiceChannelDisconnector: Discord.Collection<Discord.Snowflake, NodeJS.Timeout>;
};

export interface BaseInteraction extends Discord.BaseInteraction {
   client: Client;
};

export interface AutocompleteInteraction extends Discord.AutocompleteInteraction {
   client: Client;
};

export interface ButtonInteraction extends Discord.ButtonInteraction {
   client: Client;
};

export interface ChatInputCommandInteraction extends Discord.ChatInputCommandInteraction {
   client: Client;
};

export interface ModalSubmitInteraction extends Discord.ModalSubmitInteraction {
   client: Client;
};

export interface AnySelectMenuInteraction extends Discord.AnySelectMenuInteraction {
   client: Client;
};

export interface ChannelSelectMenuInteraction extends Discord.ChannelSelectMenuInteraction {
   client: Client;
};

export interface StringSelectMenuInteraction extends Discord.StringSelectMenuInteraction {
   client: Client;
};

export interface UserSelectMenuInteraction extends Discord.UserSelectMenuInteraction {
   client: Client;
};

export interface UserContextMenuCommandInteraction extends Discord.UserContextMenuCommandInteraction {
   client: Client;
};

export interface GuildMember extends Discord.GuildMember {
   client: Client;
};

export interface Message extends Discord.Message {
   client: Client;
};

export interface MessageReaction extends Discord.MessageReaction {
   client: Client;
};

export interface ThreadChannel extends Discord.ThreadChannel {
   client: Client;
};

export interface VoiceState extends Discord.VoiceState {
   client: Client;
};


export default Client;