/**
 * 🌊 flooded-area-bot
 * 👥 magicalbunny31 (https://nuzzles.dev), wojtekhugo (https://github.com/wojtekhugo)
 * 🗓️ 2022 - 2025
 * 🏡 https://nuzzles.dev/dev/flooded-area-bot
 * 🔗 https://github.com/magicalbunny31/flooded-area-bot
 */


// environment variables
import dotenvKey from "./data/dotenv-key.js";
import dotenv from "dotenv";
dotenv.config({ DOTENV_KEY: dotenvKey, path: `./src/.env` });


// discord client
import Discord from "discord.js";

const client = new Discord.Client({
   partials: [
      Discord.Partials.Message,
      Discord.Partials.User,
      Discord.Partials.Reaction,
      Discord.Partials.Channel
   ],

   intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMembers,
      Discord.GatewayIntentBits.GuildMessages,
      Discord.GatewayIntentBits.DirectMessages,
      Discord.GatewayIntentBits.GuildMessageReactions,
      Discord.GatewayIntentBits.MessageContent,
      Discord.GatewayIntentBits.GuildVoiceStates
   ],

   presence: {
      status: Discord.PresenceUpdateStatus.DoNotDisturb,
      activities: [{
         name: `starting up..`,
         type: Discord.ActivityType.Custom
      }]
   }
});

await client.login(process.env.TOKEN);


// logging
import logger from "better-logging";
import chalk from "chalk";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

logger(console, {
   format: ctx => {
      const date = dayjs().format(`[[]HH:mm:ss] [[]DD-MMM-YYYY]`);
      return `${chalk.grey(date)} ${chalk.bold(ctx.type)} ${ctx.msg}`;
   }
});

console.logLevel = 4;


// pawesome logs
import fs from "node:fs/promises";
import { colours } from "@magicalbunny31/pawesome-utility-stuffs";

const logColours = [
   colours.red, colours.orange, colours.yellow, colours.green, colours.blue, colours.purple
];

const splash = await fs.readFile(`./src/assets/splash.txt`);

for (const [ index, line ] of splash.toString().split(/\r?\n/).entries())
   console.line(chalk.hex(logColours[index])(line));


// database
import { Firestore } from "@google-cloud/firestore";

client.firestore = new Firestore({
   credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY
   },
   databaseId: `flooded-area-bot-discord`,
   projectId: process.env.GCP_PROJECT_ID,
   ssl: true
});

// TODO
client.firestoreLegacy = new Firestore({
   credentials: {
      client_email: process.env.LEGACY_GCP_CLIENT_EMAIL,
      private_key: process.env.LEGACY_GCP_PRIVATE_KEY
   },
   projectId: process.env.LEGACY_GCP_PROJECT_ID,
   ssl: true
});


// fennec
import { FennecClient } from "@magicalbunny31/fennec-utilities";

client.fennec = new FennecClient({
   fennecProcess: `fox-1`,
   fennecUtilities: {
      baseUrl:       process.env.FENNEC_UTILITIES_URL,
      id:            `flooded-area-bot`,
      authorisation: process.env.FENNEC_UTILITIES_AUTHORISATION
   }
});

await client.fennec.initialise();


// emojis
import { emojis } from "@magicalbunny31/pawesome-utility-stuffs";

client.allEmojis = emojis(await client.application.emojis.fetch());


// voice channel disconnections
client.voiceChannelDisconnector = new Discord.Collection();


// discord application commands
import { partition, set } from "@magicalbunny31/pawesome-utility-stuffs";

client.interactions = {};
for (const interaction of await fs.readdir(`./src/interactions`)) {
   client.interactions[interaction] = new Discord.Collection();
   const interactions = await fs.readdir(`./src/interactions/${interaction}`);

   for (const file of interactions) {
      const [ name ] = file.split(`.`);
      const data = await import(`./interactions/${interaction}/${file}`);
      client.interactions[interaction].set(name, data);
   };
};

const [ globalCommands, guildCommands ] = partition(
   [
      ...client.interactions[`chat-input`]
         .concat(client.interactions.user)
         .values()
   ],
   command => !command.guilds
);

const globalCommandsData  = globalCommands.map(command => command.data);
const guildCommandsGuilds = set(guildCommands.flatMap(command => command.guilds));

for (const guildId of guildCommandsGuilds)
   await client.application.commands.set(
      guildCommands
         .filter(command => command.guilds.includes(guildId))
         .map(command => command.data),
      guildId
   );

await client.application.commands.set(globalCommandsData);


// discord client events
const events = await fs.readdir(`./src/events`);

for (const file of events) {
   const event = await import(`./events/${file}`);
   if (!event.once) client.on  (event.name, (...args) => event.default(...args));
   else             client.once(event.name, (...args) => event.default(...args));
};


// watch schedules
import { scheduleJob } from "node-schedule";

const schedules = await fs.readdir(`./src/schedules`);

for (const file of schedules) {
   const [ filename ] = file.split(`.`);
   const schedule = await import(`./schedules/${file}`);
   const job = scheduleJob(schedule.cron, async () => await schedule.default(client));

   job.once(`error`, async error => {
      // log this caught error
      console.error(chalk.hex(colours.flooded_area_bot)(`~ caught error in schedule! see below for the error..`));
      console.line(error.stack ?? error ?? `no error..?`);

      try {
         const source = `${Discord.inlineCode(`schedule`)}/${Discord.inlineCode(filename)}`;
         await client.fennec.postErrorLog(error, source, new Date());
      } catch (error) {
         console.error(chalk.hex(colours.flooded_area_bot)(`~ ..the error handler failed to log this caught error in schedule! see below for its error..`));
         console.line(error.stack ?? error ?? `no error..?`);
      };
   });
};


// process events
process.on("uncaughtException", async (error, origin) => {
   console.error(chalk.hex(colours.flooded_area_bot)(`~ uncaught exception! see below for the error..`));
   console.line(error.stack ?? error ?? `no error..?`);

   try {
      const source = `${Discord.inlineCode(origin)}`;
      await client.fennec.postErrorLog(error, source, new Date());
   } catch (error) {
      console.error(chalk.hex(colours.flooded_area_bot)(`~ ..the error handler failed to log this uncaught exception! see below for its error..`));
      console.line(error.stack ?? error ?? `no error..?`);
   } finally {
      console.error(chalk.hex(colours.flooded_area_bot)(`~ killing process..`));
      process.exit(1);
   };
});


// final logs
const guildCount = client.guilds.cache.size;
const tag = client.user.tag;

console.debug(chalk.hex(colours.flooded_area_bot)(`logged in as @${tag} with ${guildCount} ${guildCount === 1 ? `guild` : `guilds`}`));


// miscellaneous lines below !!