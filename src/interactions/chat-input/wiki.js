/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../../data/guilds.js";
import userAgent from "../../data/user-agent.js";

import Discord from "discord.js";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { colours, strip, sum } from "@magicalbunny31/pawesome-utility-stuffs";


export const guilds = [ FloodedAreaCommunity, UniverseLaboratories ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`wiki`)
   .setDescription(`Search the wiki`)
   .addStringOption(
      new Discord.SlashCommandStringOption()
         .setName(`search-term`)
         .setDescription(`The search term to query`)
         .setAutocomplete(true)
         .setRequired(true)
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // options
   const searchTerm = interaction.options.getString(`search-term`);


   // TODO
   if (interaction.guild.id === UniverseLaboratories)
      return await interaction.reply({
         content: strip`
            ### ❌ This command can't be used
            > - The wiki for this game must be public.
            > - Contact <@490178047325110282> to set-up this command.
         `,
         ephemeral: true
      });


   // function to replace a string for use in a regexp
   const escapeRegExp = string =>
      string.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);


   // defer the interaction
   await interaction.deferReply();


   // colour to show
   const colour = {
      [FloodedAreaCommunity]: colours.flooded_area_bot,
      [UniverseLaboratories]: colours.purple
   }[interaction.guild.id];


   // wikis
   const wiki = {
      [FloodedAreaCommunity]: {
         name: `Flooded Area Official Wiki`,
         url: `https://flooded-area-official.fandom.com`
      },
      [UniverseLaboratories]: {
         name: `Spaced Out Wiki`,
         url: `https://spacedout1.fandom.com`
      }
   }[interaction.guild.id];


   // base url for requests
   const baseUrl = wiki.url;


   // get this page
   const foundPage = await (async () => {
      // query string
      const query = [
         `action=query`,
         `prop=revisions`,
         `titles=${searchTerm}`,
         `rvslots=*`,
         `rvprop=content`,
         `formatversion=2`,
         `format=json`
      ]
         .join(`&`);

      // send a request to the api
      const response = await fetch(`${baseUrl}/api.php?${query}`, {
         headers: {
            "Accept": `application/json`,
            "User-Agent": userAgent
         }
      });

      // bad response
      if (!response.ok)
         throw new Error(`${baseUrl}/api.php?${query}: HTTP ${response.status} ${response.statusText}`);

      // parse the response data
      const data = await response.json();
      const [ foundPage ] = data.query.pages;
      return foundPage;
   })();

   if (!foundPage)
      return;


   // get this page's image
   const imageData = await (async () => {
      // query string
      const query = [
         `action=query`,
         `prop=pageimages`,
         `piprop=original`,
         `titles=${searchTerm}`,
         `format=json`
      ]
         .join(`&`);

      // send a request to the api
      const response = await fetch(`${baseUrl}/api.php?${query}`, {
         headers: {
            "Accept": `application/json`,
            "User-Agent": userAgent
         }
      });

      // bad response
      if (!response.ok)
         throw new Error(`${baseUrl}/api.php?${query}: HTTP ${response.status} ${response.statusText}`);

      // parse the response data
      const data = await response.json();
      return data;
   })();

   if (!imageData)
      return;


   // this page doesn't exist
   if (foundPage.missing)
      return await interaction.editReply({
         embeds: [
            new Discord.EmbedBuilder()
               .setColor(colour)
               .setTitle(foundPage.title)
               .setURL(encodeURI(`${baseUrl}/wiki/${foundPage.title}`))
               .setDescription(strip`
                  ### ❌ Page "${foundPage.title}" not found
                  > - Try selecting an option from the inline autocomplete choices when using ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`wiki`, interaction.commandId)}.
                  > - Or, this page may not exist on the ${Discord.hyperlink(wiki.name, `${wiki.url}/wiki`)} yet - ${Discord.hyperlink(`create this page yourself here`, encodeURI(`${baseUrl}/wiki/${foundPage.title}?action=edit`))}.
               `)
               .setThumbnail(`attachment://incomplete.png`)
         ],
         components: [
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.ButtonBuilder()
                     .setLabel(`Create this page`)
                     .setEmoji(interaction.client.allEmojis.flooded_area)
                     .setStyle(Discord.ButtonStyle.Link)
                     .setURL(encodeURI(`${baseUrl}/wiki/${foundPage.title}`))
               )
         ],
         files: [
            new Discord.AttachmentBuilder()
               .setFile(`./src/assets/wiki/incomplete.png`)
         ]
      });


   // get this page's html
   let [ html, table ] = await (async () => {
      // query string
      const query = [
         `action=parse`,
         `page=${foundPage.title}`,
         `format=json`
      ]
         .join(`&`);

      // send a request to the api
      const response = await fetch(`${baseUrl}/api.php?${query}`, {
         headers: {
            "Accept": `application/json`,
            "User-Agent": userAgent
         }
      });

      // bad response
      if (!response.ok)
         throw new Error(`${baseUrl}/api.php?${query}: HTTP ${response.status} ${response.statusText}`);

      // parse the response data
      const data = await response.json();
      const html = data.parse.text[`*`];
      const [ table ] = JSON.parse(data.parse.properties[0]?.[`*`] || JSON.stringify([]));
      return [ html, table ];
   })();

   if (!html)
      return;


   // remove any images, tables, titles and asides from the html
   html = html.replace(new RegExp(`(<img (.*?)>)|(<table (.*?)<\/table>)|(<h2 (.*?)>${escapeRegExp(foundPage.title)}<\/h2>)|(<aside ((.|\n)*)<\/aside>)`, `g`), ``);


   // format the html into discord-supported markdown
   const text = NodeHtmlMarkdown.translate(html);


   // get the first part of the text, up until the first found header
   let descriptionText = text.match(/^[\S\s]*?(?=#)/gm)?.[0]?.trim() || ``;


   // remove any empty hyperlinks
   descriptionText = descriptionText.replace(/\[\]\(((.*?))\)/g, ``);


   // replace any relative urls with its absolute url
   descriptionText = descriptionText.replace(/\[(.*?)\]\((\/(.*?)) "(.*?)"\)/g, (_match, content, url, _, title) => Discord.hyperlink(content, `${baseUrl}${url}`, title));


   // descriptionText too large
   if (descriptionText.length > 4096)
      descriptionText = `${descriptionText.slice(0, 4093)}...`;


   // table data
   const fields = table?.data.filter(data => data.type === `data`) || [];

   const thumbnail = table?.data.find(data => data.type === `image`)?.data[0].url;
   const image = imageData.query.pages[`${foundPage.pageid}`].original?.source === thumbnail
      ? null
      : imageData.query.pages[`${foundPage.pageid}`].original?.source;


   // embed will exceed limits
   if (
      foundPage.title.length
      + descriptionText.length
      + sum(fields.map(field => field.data.label.length + field.data.value.length))
      + baseUrl.length
      > 6000
   )
      return await interaction.editReply({
         embeds: [
            new Discord.EmbedBuilder()
               .setColor(colour)
               .setTitle(foundPage.title)
               .setURL(encodeURI(`${baseUrl}/wiki/${foundPage.title}`))
               .setDescription(strip`
                  ### 📃 Page "${foundPage.title}" too large to view on Discord
                  > - ${Discord.hyperlink(`View the full page online here`, encodeURI(`${baseUrl}/wiki/${foundPage.title}`))}.
               `)
               .setThumbnail(`attachment://removed.png`)
         ],
         components: [
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.ButtonBuilder()
                     .setLabel(`View full page`)
                     .setEmoji(colour)
                     .setStyle(Discord.ButtonStyle.Link)
                     .setURL(encodeURI(`${baseUrl}/wiki/${foundPage.title}`))
               )
         ],
         files: [
            new Discord.AttachmentBuilder()
               .setFile(`./src/assets/wiki/removed.png`)
         ]
      });


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(colour)
         .setTitle(foundPage.title)
         .setURL(encodeURI(`${baseUrl}/wiki/${foundPage.title}`))
         .setThumbnail(thumbnail)
         .setDescription(descriptionText || null)
         .setFields(
            fields.map(field =>
               ({
                  name: field.data.label,
                  value: field.data.value,
                  inline: true
               })
            )
         )
         .setImage(image)
         .setFooter({
            iconURL: `attachment://fandom.png`,
            text: baseUrl
         })
   ];


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setLabel(`View full page`)
               .setEmoji(interaction.client.allEmojis.flooded_area)
               .setStyle(Discord.ButtonStyle.Link)
               .setURL(encodeURI(`${baseUrl}/wiki/${foundPage.title}`))
         )
   ];


   // files
   const files = [
      new Discord.AttachmentBuilder()
         .setFile(`./src/assets/wiki/fandom.png`)
   ];


   // edit the deferred interaction
   await interaction.editReply({
      embeds,
      components,
      files
   });
};