import userAgent from "../data/user-agent.js";

import Discord from "discord.js";
import dayjs from "dayjs";
import Color from "color";
import { colours, autoArray } from "@magicalbunny31/pawesome-utility-stuffs";


export default class KnightMarket {
   constructor(interaction) {
      this.#interaction = interaction;
   };


   /**
    * @type {import("@flooded-area-bot-types/client").ChatInputCommandInteraction | import("@flooded-area-bot-types/client").ButtonInteraction}
    */
   #interaction;


   get #hidden() {
      const hidden = this.#interaction.options.getBoolean(`hidden`);
      return hidden;
   };


   /**
    * get the timestamps of which minutes are added to the start of the current hour
    * (simulates the value changing every 20 minutes)
    * examples:   xx:03 => xx:00
    *             xx:39 => xx:20
    *             xx:55 => xx:40
    */
   getDate() {
      const offset = 20 * Math.floor(dayjs().minute() / 20);
      const date = dayjs().utc().startOf(`hour`).add(offset, `minutes`);
      return date;
   };


   /**
    * subtracts in increments of 20 minutes from a date
    * @param {dayjs.Dayjs} date
    * @param {number} incrementsInPast
    */
   #subtractTimeFromDate(date, incrementsInPast) {
      return date.subtract(incrementsInPast * 20, `minutes`);
   };


   /**
    * i'll be honest i have no clue what the FUCK this does okai i just copied the roblox experience (anarchy chess)'s code
    * @param {dayjs.Dayjs} date
    */
   #getStockValuePrice(date) {
      const x = Math.floor(
         Math.floor(
            (date.minute() + date.hour() * 60) / 20
         )
         + date.date() * 24
         + (date.month() + 1) * 31 // months are NOT 0-indexed in roblox
         + date.year() * 256
      )
         / 20;

      const value = Math.sin(x * Math.PI)
         * Math.sin(x)
         * Math.sin(
            x * Math.log(x)
         )
         + 2;

      const price = Math.ceil(value * 10);
      return price;
   };


   async showChart() {
      // this is a chat-input command interaction, defer the interaction
      if (this.#interaction.isChatInputCommand())
         await this.#interaction.deferReply({
            flags: [
               ...this.#hidden
                  ? [ Discord.MessageFlags.Ephemeral ]
                  : []
            ]
         });

      else if (this.#interaction.isButton()) {
         const components = this.#interaction.message.components;
         components[3].accessory.data.emoji = Discord.parseEmoji(this.#interaction.client.allEmojis.loading);
         components[3].accessory.data.disabled = true;
         await this.#interaction.update({
            components // TODO "@magicalbunny31/pawesome-utility-stuffs".deferComponents() needs support for v2 components
         });
      };


      // generate a chart of the previous knight prices
      const date = this.getDate();

      const data = autoArray(24 * 3, (value, index) =>
         [
            this.#subtractTimeFromDate(date, index), this.#getStockValuePrice(this.#subtractTimeFromDate(date, index))
         ]
      )
         .reverse();

      const image = await (async () => {
         const red   = Color(colours.red)  .hex();
         const green = Color(colours.green).hex();
         const getLineColour = (currentValue, previousValue) => currentValue > previousValue
            ? green
            : red;

         const response = await fetch(`https://quickchart.io/chart`, {
            body: JSON.stringify({
               version: 4,
               backgroundColor: `white`,
               chart: {
                  type: `line`,
                  data: {
                     labels: data.map(data =>
                        dayjs.unix(data[0]).minute() === 0
                           ? dayjs.duration({ seconds: data[0].unix() - dayjs().unix() }).humanize(true)
                           : ``
                     ),
                     datasets: [{
                        datasetFill: true,
                        backgroundColor: `#ffff00`,
                        borderColor: data.map((data, index, array) => {
                           return index
                              ? getLineColour(data[1], array[index - 1][1])
                              : `#808080`; // first data point: set the line as grey
                        }),
                        borderWidth: 2,
                        data: data.map(data => data[1]),
                        label: `Price`
                     }]
                  },
                  options: {
                     elements: {
                        point: {
                           pointStyle: `cross`
                        }
                     },
                     plugins: {
                        legend: {
                           display: false
                        },
                        title: {
                           display: true,
                           text: `Knight Market`
                        }
                     }
                  }
               }
            }),
            headers: {
               "Content-Type": `application/json`,
               "User-Agent": userAgent
            },
            method: `POST`
         });

         return Buffer.from(await response.arrayBuffer());
      })();


      // edit the deferred interaction
      await this.#interaction.editReply({
         components: [
            new Discord.MediaGalleryBuilder()
               .addItems(
                  new Discord.MediaGalleryItemBuilder()
                     .setURL(`attachment://knight_market.png`)
               ),
            new Discord.TextDisplayBuilder()
               .setContent(
                  Discord.subtext(`Last updated at ${Discord.time(data.at(-1)[0].toDate())}`)
               ),
            new Discord.SeparatorBuilder()
               .setDivider(true)
               .setSpacing(Discord.SeparatorSpacingSize.Small),
            new Discord.SectionBuilder()
               .addTextDisplayComponents(
                  new Discord.TextDisplayBuilder()
                     .setContent(
                        Discord.heading(`Current Price: ${Discord.inlineCode(data.at(-1)[1])}`, Discord.HeadingLevel.Two)
                     )
               )
               .setButtonAccessory(
                  new Discord.ButtonBuilder()
                     .setCustomId(`knight-market:${data.at(-1)[0].unix()}`)
                     .setLabel(`Update Chart`)
                     .setEmoji(this.#interaction.client.allEmojis.integrations_channels_followed)
                     .setStyle(Discord.ButtonStyle.Primary)
               ),
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.ButtonBuilder()
                     .setLabel(`Anarchy Chess`)
                     .setEmoji(this.#interaction.client.allEmojis.roblox)
                     .setStyle(Discord.ButtonStyle.Link)
                     .setURL(`https://www.roblox.com/games/16813674681/Anarchy-Chess`)
               )
         ],
         files: [
            new Discord.AttachmentBuilder()
               .setFile(image)
               .setName(`knight_market.png`)
         ],
         flags: [
            Discord.MessageFlags.IsComponentsV2
         ]
      });
   };
};