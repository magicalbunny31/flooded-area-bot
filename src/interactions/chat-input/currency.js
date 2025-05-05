/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../../data/guilds.js";
import shopResponses from "../../data/shop-responses.js";

import Discord from "discord.js";
import dayjs from "dayjs";
import { FieldValue } from "@google-cloud/firestore";
import { colours, autoArray, strip, sum } from "@magicalbunny31/pawesome-utility-stuffs";


export const guilds = [ FloodedAreaCommunity, UniverseLaboratories ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`currency`)
   .setDescription(`Access the currency commands`)
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`balance`)
         .setDescription(`View your currency statistics`)
         .addUserOption(
            new Discord.SlashCommandUserOption()
               .setName(`user`)
               .setDescription(`User's currency statistics to view`)
               .setRequired(false)
         )
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`events`)
         .setDescription(`See any events that may affect the economy`)
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`items`)
         .setDescription(`View your items`)
         .addUserOption(
            new Discord.SlashCommandUserOption()
               .setName(`user`)
               .setDescription(`User's items to view`)
               .setRequired(false)
         )
         .addStringOption(
            new Discord.SlashCommandStringOption()
               .setName(`menu`)
               .setDescription(`Start the menu at a specific area`)
               .setChoices({
                  name: `Items`,
                  value: `items`
               }, {
                  name: `Personal item`,
                  value: `item`
               }, {
                  name: `Flea market`,
                  value: `flea-market`
               })
               .setRequired(false)
         )
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`shop`)
         .setDescription(`Enter the currency shop to exchange coins for items`)
         .addStringOption(
            new Discord.SlashCommandStringOption()
               .setName(`marketplace`)
               .setDescription(`Start the menu at a specific area`)
               .setChoices({
                  name: `🏷️ Items`,
                  value: `shop-items`
               }, {
                  name: `🏬 Special items`,
                  value: `special-items`
               }, {
                  name: `💸 Flea market`,
                  value: `flea-market`
               }, {
                  name: `🥕 Stalk market`,
                  value: `stalk-market`
               })
               .setRequired(false)
         )
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`trade`)
         .setDescription(`Send a trade request to another member`)
         .addUserOption(
            new Discord.SlashCommandUserOption()
               .setName(`user`)
               .setDescription(`The user to send the trade request to`)
               .setRequired(true)
         )
         .addStringOption(
            new Discord.SlashCommandStringOption()
               .setName(`item-given`)
               .setDescription(`The item that you'd give to this member`)
               .setAutocomplete(true)
               .setRequired(true)
         )
         .addIntegerOption(
            new Discord.SlashCommandIntegerOption()
               .setName(`item-given-quantity`)
               .setDescription(`The quantity of the items you'd give to this member`)
               .setMinValue(1)
               .setRequired(false)
         )
         .addStringOption(
            new Discord.SlashCommandStringOption()
               .setName(`item-wanted`)
               .setDescription(`The item that you want to receive in exchange for the item given from this member`)
               .setAutocomplete(true)
               .setRequired(false)
         )
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // what command to run based on the subcommand
   const subcommand = interaction.options.getSubcommand();

   switch (subcommand) {


      case `balance`: {
         // options
         const user = interaction.options.getUser(`user`)
            || interaction.user;


         // data to show
         const data = {
            [FloodedAreaCommunity]: {
               colour: colours.flooded_area_bot
            },

            [UniverseLaboratories]: {
               colour: colours.purple
            }
         }[interaction.guild.id];


         // this is a bot
         if (user.bot)
            return await interaction.reply({
               content: `### ❌ Bots aren't part of the currency system`,
               ephemeral: true
            });


         // defer the interaction
         await interaction.deferReply();


         // database
         const userCurrencyDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id).collection(`users`).doc(user.id);
         const userCurrencyDocSnap = await userCurrencyDocRef.get();
         const userCurrencyDocData = userCurrencyDocSnap.data() || {};

         const userCoins      = userCurrencyDocData.coins                 || 0;
         const userTotalCoins = userCurrencyDocData[`total-coins-earned`] || 0;

         const userItem      = userCurrencyDocData.item || {};
         const userItemPrice = userItem.price           || 0;

         const userItems = userCurrencyDocData.items || [];
         const userItemsValue = sum(
            userItems.map(item => item[`bought-for`]),
            0
         );

         const userCarrots            = userCurrencyDocData.carrots || {};
         const previousCarrotsExpired = userCarrots[`expires-at`]?.seconds < dayjs().unix(); // expired carrot values are calculated as item values
         const userCarrotsValue = previousCarrotsExpired
            ? 0
            : (userCarrots.quantity || 0) * (userCarrots.price || 0);

         const user24HourIncome = userCurrencyDocData[`24-hour-stats`]?.income || [];
         const userIncome = sum(
            user24HourIncome
               .filter(data => dayjs.unix(data.at.seconds).add(1, `day`).unix() > dayjs().unix())
               .map(data => data.coins),
            0
         );

         const user24HourExpenditure = userCurrencyDocData[`24-hour-stats`]?.expenditure || [];
         const userExpenditure = sum(
            user24HourExpenditure
               .filter(data => dayjs.unix(data.at.seconds).add(1, `day`).unix() > dayjs().unix())
               .map(data => data.coins),
            0
         );


         // embeds
         const embeds = [
            new Discord.EmbedBuilder()
               .setColor(user.accentColor || (await user.fetch(true)).accentColor || data.colour)
               .setAuthor({
                  name: `@${user.username}`,
                  iconURL: user.displayAvatarURL()
               })
               .setTitle(`🏦 Bank`)
               .setFields({
                  name: `🪙 Current balance`,
                  value: `> \`${userCoins.toLocaleString()}\` ${userCoins === 1 ? `coin` : `coins`}`,
                  inline: true
               }, {
                  name: `💰 Net worth`,
                  value: `> \`${(userCoins + userItemPrice + userItemsValue + userCarrotsValue).toLocaleString()}\` ${(userCoins + userItemPrice + userItemsValue + userCarrotsValue) === 1 ? `coin` : `coins`}`,
                  inline: true
               }, {
                  name: `👛 Coins earned from talking`,
                  value: `> \`${userTotalCoins.toLocaleString()}\` ${userTotalCoins === 1 ? `coin` : `coins`}`,
                  inline: true
               }, {
                  name: `📈 Income (past 24 hours)`,
                  value: `> \`${userIncome.toLocaleString()}\` ${userIncome === 1 ? `coin` : `coins`}`,
                  inline: true
               }, {
                  name: `📉 Expenditure (past 24 hours)`,
                  value: `> \`${userExpenditure.toLocaleString()}\` ${userExpenditure === 1 ? `coin` : `coins`}`,
                  inline: true
               })
               .setFooter({
                  text: strip`
                     🪙 You earn 1 coin for every message you send in this server, per minute.
                     📈 During the weekend, you'll earn 2 coins for every message!
                  `
               })
         ];


         // edit the deferred interaction
         await interaction.editReply({
            embeds
         });


         // break out
         break;
      };


      case `events`: {
         // TODO
         // wip :3


         // data to show
         const data = {
            [FloodedAreaCommunity]: {
               colour: colours.flooded_area_bot
            },

            [UniverseLaboratories]: {
               colour: colours.purple
            }
         }[interaction.guild.id];


         // defer the interaction
         await interaction.deferReply();


         // embeds
         const embeds = [
            new Discord.EmbedBuilder()
               .setColor(data.colour)
               .setTitle(`💣 Active Events`)
               .setDescription(strip`
                  *It's...empty in here.* ${interaction.client.allEmojis.foxsleep}
               `)
         ];


         // edit the deferred interaction
         await interaction.editReply({
            embeds
         });


         // break out
         break;
      };


      case `items`: {
         // options
         const user = interaction.options.getUser(`user`)
            || interaction.user;

         const area = interaction.options.getString(`menu`) || `items`;


         // data to show
         const data = {
            [FloodedAreaCommunity]: {
               colour: colours.flooded_area_bot
            },

            [UniverseLaboratories]: {
               colour: colours.purple
            }
         }[interaction.guild.id];


         // this is a bot
         if (user.bot)
            return await interaction.reply({
               content: `### ❌ Bots aren't part of the currency system`,
               ephemeral: true
            });


         // can only view items when another user is specified
         if (user.id !== interaction.user.id && area !== `items`)
            return await interaction.reply({
               content: `### ❌ You can only view another user's items`,
               ephemeral: true
            });


         // defer the interaction
         await interaction.deferReply();


         // currency shop
         const shopDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id);
         const shopDocSnap = await shopDocRef.get();
         const shopDocData = shopDocSnap.data() || {};


         // this user's currency
         const userCurrencyDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id).collection(`users`).doc(user.id);
         const userCurrencyDocSnap = await userCurrencyDocRef.get();
         const userCurrencyDocData = userCurrencyDocSnap.data() || {};


         // commands
         const commandCurrencyId = interaction.commandId;


         // embeds
         const embeds = [
            new Discord.EmbedBuilder()
               .setColor(data.colour)
         ];


         // components
         const components = [
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.StringSelectMenuBuilder()
                     .setCustomId(`currency-items`)
                     .setPlaceholder(`Browse the menu...`)
                     .setOptions(
                        new Discord.StringSelectMenuOptionBuilder()
                           .setEmoji(`🎒`)
                           .setLabel(`Items`)
                           .setValue(`items`)
                           .setDescription(`All items that you own.`)
                           .setDefault(area === `items`),
                        new Discord.StringSelectMenuOptionBuilder()
                           .setEmoji(`🏷️`)
                           .setLabel(`Personal item`)
                           .setValue(`item`)
                           .setDescription(`The item that you sell in bunny's shop.`)
                           .setDefault(area === `item`),
                        new Discord.StringSelectMenuOptionBuilder()
                           .setEmoji(`💸`)
                           .setLabel(`Flea market`)
                           .setValue(`flea-market`)
                           .setDescription(`The items that you've listed on the flea market.`)
                           .setDefault(area === `flea-market`)
                     )
               )
         ];


         // what area to go to
         switch (area) {


            // user's items
            case `items`: {
               // items
               const userItems = userCurrencyDocData.items || [];

               const items = (
                  await Promise.all(
                     userItems
                        .map(item => // map these items into partial data of the seller's id or the item's name
                           item.ref
                              ? ({ sellerId: item.ref.id })
                              : ({ name:     item.name   })
                        )
                        .filter((value, index, self) => // remove duplicate objects from the list
                           index === self.findIndex(t => (
                              t.sellerId === value.sellerId && t.name === value.name
                           ))
                        )
                        .map(data => // now add each partial data's quantity when compared to the original userItems list
                           ({
                              ...data,
                              quantity: userItems
                                 .filter(item =>
                                    item.ref
                                       ? item.ref.isEqual(
                                          interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id).collection(`users`).doc(data.sellerId || `0`)
                                       )
                                       : item.name === data.name
                                 )
                                 .length
                           })
                        )
                        .map(async data => { // map each partial data to both contain its name (and seller if it has a sellerId)
                           if (data.name) {
                              return {
                                 name:     data.name,
                                 quantity: data.quantity
                              };

                           } else {
                              const itemDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id).collection(`users`).doc(data.sellerId);
                              const itemDocSnap = await itemDocRef.get();
                              const itemDocData = itemDocSnap.data() || {};

                              if (!Object.values(itemDocData).length)
                                 return null;

                              else
                                 return {
                                    name:     itemDocData.item.name,
                                    quantity: data.quantity,
                                    seller:   data.sellerId
                                 };
                           };
                        })
                  )
               )
                  .filter(Boolean); // some sellerIds may have no personal items: remove them from the list

               const userItemsValue = sum(
                  userItems.map(item => item[`bought-for`]),
                  0
               );


               // embeds
               const index = 0;
               const size = 15;
               const itemsToShow = items.slice(index * size, size + (index * size));

               embeds[0]
                  .setColor(user.accentColor || (await user.fetch(true)).accentColor || data.colour)
                  .setAuthor({
                     name: `@${user.username}`,
                     iconURL: user.displayAvatarURL()
                  })
                  .setTitle(`🎒 ${user.id === interaction.user.id ? `Your` : `Their`} items`)
                  .setFields(
                     items.length
                        ? []
                        : {
                           name: `${user.id === interaction.user.id ? `You've` : `They've`} got no items`,
                           value: `> Buy some items at bunny's shop with ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`currency`, `shop`, commandCurrencyId)}`
                        }
                  )
                  .setDescription(
                     items.length
                        ? itemsToShow
                           .map(item =>
                              item.seller
                                 ? `> - **\`${item.quantity}\` ${item.name}** sold by ${Discord.userMention(item.seller)}`
                                 : `> - **\`${item.quantity}\` ${item.name}**`
                           )
                           .join(`\n`)
                        : null
                  )
                  .setFooter({
                     text: `💰 Total value: ${userItemsValue.toLocaleString()} ${userItemsValue === 1 ? `coin` : `coins`}`
                  });


               // components
               const pages = Math.ceil(items.length / size);

               components.splice(1, 4,
                  new Discord.ActionRowBuilder()
                     .setComponents(
                        new Discord.ButtonBuilder()
                           .setCustomId(`currency-items:items:${index - 1}:${user.id}`)
                           .setEmoji(`⬅️`)
                           .setStyle(Discord.ButtonStyle.Primary)
                           .setDisabled(index - 1 < 0),
                        new Discord.ButtonBuilder()
                           .setCustomId(`currency-items:items:${index + 1}:${user.id}`)
                           .setEmoji(`➡️`)
                           .setStyle(Discord.ButtonStyle.Primary)
                           .setDisabled(index + 1 >= pages),
                        new Discord.ButtonBuilder()
                           .setCustomId(`🦊`)
                           .setLabel(`${index + 1} / ${pages}`)
                           .setStyle(Discord.ButtonStyle.Secondary)
                           .setDisabled(true)
                     )
               );


               // break out
               break;
            };


            // user's personal item
            case `item`: {
               // items
               const userItem = userCurrencyDocData.item || {};

               const shopItems = shopDocData[`shop-items`] || [];
               const shopItem  = shopItems.find(item =>
                  item.ref.isEqual(
                     interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id).collection(`users`).doc(interaction.user.id)
                  )
               );

               const hasPersonalItem = !!Object.values(userItem).length;

               const costToIncreaseQuantity = userItem.price === 1
                  ? 1
                  : userItem.price <= 3
                     ? userItem.price - 1
                     : Math.ceil(userItem.price / 4);


               // current shop tax rate
               const taxRate             = shopDocSnap.data()[`tax-rate`];
               const taxRateAsPercentage = `${(taxRate * 100).toFixed(0)}%`;

               const earnedCoins = Math.floor(userItem.price * (1 - taxRate));


               // embeds
               embeds[0]
                  .setTitle(`🏷️ Your personal item`)
                  .setFields(
                     hasPersonalItem
                        ? {
                           name: userItem.name,
                           value: strip`
                              > - Seller: ${Discord.userMention(interaction.user.id)}
                              > - Cost per item: 🪙 \`${userItem.price.toLocaleString()}\` ${userItem.price === 1 ? `coin` : `coins`}
                              > - Quantity: ${shopItem.quantity.toLocaleString()} left
                           `
                        }
                        : {
                           name: `You don't have a personal item`,
                           value: `> Create one with the button below!`
                        }
                  )
                  .setFooter({
                     text: hasPersonalItem
                        ? strip`
                           📈 🪙 ${earnedCoins} ${earnedCoins === 1 ? `coin` : `coins`} per sale (${taxRateAsPercentage} tax rate)
                           📦 Buy for 25% of its price to increase its quantity
                        `
                        : null
                  });


               // components
               components.splice(1, 4,
                  ...hasPersonalItem
                     ? [
                        new Discord.ActionRowBuilder()
                           .setComponents(
                              new Discord.ButtonBuilder()
                                 .setCustomId(`currency-personal-item`)
                                 .setLabel(`Edit personal item (🪙 100 coins)`)
                                 .setStyle(Discord.ButtonStyle.Primary)
                                 .setEmoji(`🏷️`)
                           ),
                        new Discord.ActionRowBuilder()
                           .setComponents(
                              new Discord.ButtonBuilder()
                                 .setCustomId(`currency-increase-personal-shop-item-quantity`)
                                 .setLabel(`Increase your item's quantity (🪙 ${costToIncreaseQuantity} ${costToIncreaseQuantity === 1 ? `coin` : `coins`})`)
                                 .setStyle(Discord.ButtonStyle.Secondary)
                                 .setEmoji(`📦`)
                           )
                     ]
                     : [
                        new Discord.ActionRowBuilder()
                           .setComponents(
                              new Discord.ButtonBuilder()
                                 .setCustomId(`currency-personal-item`)
                                 .setLabel(`Create personal item (🪙 100 coins)`)
                                 .setStyle(Discord.ButtonStyle.Primary)
                                 .setEmoji(`🏷️`)
                           )
                     ]
               );


               // break out
               break;
            };


            // flea market
            case `flea-market`: {
               // items
               const fleaMarket          = shopDocData[`flea-market`] || [];
               const userFleaMarketItems = fleaMarket.filter(item => item.seller === interaction.user.id);

               const items = (
                  await Promise.all(
                     userFleaMarketItems
                        .map(async data => {
                           if (data.name) { // cool this item is a name, return it as it was
                              return data;

                           } else { // this item has a DocumentRef
                              const itemDocSnap = await data.ref.get();     // fetch this user's personal item
                              const itemDocData = itemDocSnap.data() || {}; // get their personal item's data

                              if (!Object.values(itemDocData).length) // ok for some reason this user doesn't actually have a personal item
                                 return null;

                              else
                                 return { // return this item's name in the json too
                                    ...data,
                                    name: itemDocData.item.name
                                 };
                           };
                        })
                  )
               )
                  .filter(Boolean); // `null` is present if there was no personal item present, just filter those out of the list


               // embeds
               embeds[0]
                  .setTitle(`💸 Your flea market listings`)
                  .setFields([
                     ...items.length
                        ? items
                           .map(item =>
                              ({
                                 name: item.name,
                                 value: `> Priced at 🪙 \`${item.price.toLocaleString()}\` ${item.price === 1 ? `coin` : `coins`}`,
                                 inline: true
                              })
                           )
                        : [{
                           name: `You haven't listed any items on the flea market`,
                           value: `> List one with the button below!`
                        }]
                  ]);


               // components
               components.splice(1, 4,
                  new Discord.ActionRowBuilder()
                     .setComponents(
                        new Discord.ButtonBuilder()
                           .setCustomId(`currency-create-flea-market-listing`)
                           .setLabel(`List an item on the flea market`)
                           .setStyle(Discord.ButtonStyle.Primary)
                           .setEmoji(`💸`)
                     )
               );


               // break out
               break;
            };


         };


         // modify the components when viewing another member
         if (user.id !== interaction.user.id)
            if (area === `items`)
               components.shift();
            else
               components.splice(0, 5);


         // edit the deferred interaction
         await interaction.editReply({
            embeds,
            components
         });


         // break out
         break;
      };


      case `shop`: {
         // options
         const area = interaction.options.getString(`marketplace`) || `shop-items`;


         // defer the interaction
         await interaction.deferReply();


         // currency shop
         const shopDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id);
         const shopDocSnap = await shopDocRef.get();
         const shopDocData = shopDocSnap.data() || {};


         // this user's currency
         const userCurrencyDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id).collection(`users`).doc(interaction.user.id);
         const userCurrencyDocSnap = await userCurrencyDocRef.get();
         const userCurrencyDocData = userCurrencyDocSnap.data() || {};


         // commands
         const commandCurrencyId = interaction.commandId;


         // who's in charge of bunny's shop
         /**
          * halo  : 10:00 - 03:59  |  halo         : 10:00 - 15:59
          *                        |  halo + bunny : 16:00 - 03:59
          * bunny : 16:00 - 09:59  |         bunny : 04:00 - 09:59
          */
         const bunnyShopShopkeeper = (() => {
            const hour = dayjs.utc().hour();
            switch (true) {
               case 10 <= hour && hour < 16: return shopResponses[area].halo;
               default:                      return shopResponses[area].haloBunny;
               case  4 <= hour && hour < 10: return shopResponses[area].    bunny;
            };
         })();


         // embeds
         const embeds = [
            new Discord.EmbedBuilder()
               .setFooter({
                  text: `🪙 ${(userCurrencyDocData.coins || 0).toLocaleString()} ${userCurrencyDocData.coins === 1 ? `coin` : `coins`}`
               })
         ];


         // components
         const components = [
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.StringSelectMenuBuilder()
                     .setCustomId(`currency-shop`)
                     .setPlaceholder(`Browse the marketplace...`)
                     .setOptions(
                        new Discord.StringSelectMenuOptionBuilder()
                           .setEmoji(`🏷️`)
                           .setLabel(`Items`)
                           .setValue(`shop-items`)
                           .setDescription(`🏪 bunny's shop`)
                           .setDefault(area === `shop-items`),
                        new Discord.StringSelectMenuOptionBuilder()
                           .setEmoji(`🏬`)
                           .setLabel(`Special items`)
                           .setValue(`special-items`)
                           .setDescription(`🏪 bunny's shop`)
                           .setDefault(area === `special-items`),
                        new Discord.StringSelectMenuOptionBuilder()
                           .setEmoji(`💸`)
                           .setLabel(`Flea market`)
                           .setValue(`flea-market`)
                           .setDescription(`🐉 dragon deals`)
                           .setDefault(area === `flea-market`),
                        new Discord.StringSelectMenuOptionBuilder()
                           .setEmoji(`🥕`)
                           .setLabel(`Stalk market`)
                           .setValue(`stalk-market`)
                           .setDescription(`🧺 your local carrot farm`)
                           .setDefault(area === `stalk-market`)
                     )
               )
         ];


         // what area to go to
         switch (area) {


            // shop items
            case `shop-items`: {
               // items
               const shopDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id);
               const shopDocSnap = await shopDocRef.get();
               const shopDocData = shopDocSnap.data() || {};

               const items = await (async () => {
                  const itemsWithRef      = shopDocData[`shop-items`] || [];
                  const itemsWithItemData = [];

                  for (let i = itemsWithRef.length - 1; i >= 0; i --) { // decrement loop to remove values
                     const item = itemsWithRef[i];

                     const itemDocRef  = item.ref;
                     const itemDocSnap = await itemDocRef.get();
                     const itemDocData = itemDocSnap.data() || {};

                     if (!(itemDocData.item?.name && itemDocData.item?.price)) {
                        itemsWithRef.splice(i, 1);
                        continue;
                     };

                     itemsWithItemData.push({
                        ...item,
                        ref: undefined,
                        name: itemDocData.item.name,
                        price: itemDocData.item.price
                     });
                  };

                  if (itemsWithRef.length !== itemsWithItemData.length)
                     await shopDocRef.update({
                        "shop-items": itemsWithRef
                     });

                  return itemsWithItemData;
               })();

               const displayedItems = items.filter(item => item.displayed && item.quantity > 0);


               // embeds
               embeds[0]
                  .setColor(bunnyShopShopkeeper.colour)
                  .setTitle(`🏪 bunny's shop`)
                  .setDescription(bunnyShopShopkeeper.welcome(interaction.client.allEmojis))
                  .setFields([
                     ...displayedItems.length
                        ? displayedItems
                           .map(item =>
                              ({
                                 name: item.name,
                                 value: strip`
                                    > Sold by ${Discord.userMention(item.seller)}
                                    > Costs 🪙 \`${item.price.toLocaleString()}\` ${item.price === 1 ? `coin` : `coins`}
                                 `,
                                 inline: true
                              })
                           )
                        : [{
                           name: `No items to display`,
                           value: strip`
                              > - Wait until the shop refreshes to buy more items.
                              > - Or, how about selling your own items in ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`currency`, `items`, commandCurrencyId)}?
                           `
                        }],
                     {
                        name: `\u200b`,
                        value: `🏷️ **Items** refresh ${
                           Discord.time(
                              dayjs
                                 .utc()
                                 .startOf(`hour`)
                                 .add(1, `hours`)
                                 .toDate(),
                              Discord.TimestampStyles.RelativeTime
                           )
                        }`
                     }
                  ]);


               // components
               components.splice(1, 4,
                  new Discord.ActionRowBuilder()
                     .setComponents(
                        new Discord.StringSelectMenuBuilder()
                           .setCustomId(`currency-buy-shop-item`)
                           .setPlaceholder(`Select an item to buy...`)
                           .setOptions(
                              displayedItems.length
                                 ? displayedItems
                                    .map(item =>
                                       new Discord.StringSelectMenuOptionBuilder()
                                          .setLabel(item.name)
                                          .setDescription(`🪙 ${item.price.toLocaleString()} coins`)
                                          .setValue(item.seller)
                                    )
                                 : new Discord.StringSelectMenuOptionBuilder()
                                    .setLabel(`fox`)
                                    .setValue(`fox`)
                           )
                           .setDisabled(!displayedItems.length)
                     ),

                  new Discord.ActionRowBuilder()
                     .setComponents(
                        new Discord.ButtonBuilder()
                           .setCustomId(`currency-how-shop-works`)
                           .setLabel(`How does the shop work?`)
                           .setEmoji(`❓`)
                           .setStyle(Discord.ButtonStyle.Secondary)
                     )
               );


               // break out
               break;
            };


            // special items
            case `special-items`: {
               // items
               const specialItems = shopDocData[`special-items`] || [];


               // embeds
               embeds[0]
                  .setColor(bunnyShopShopkeeper.colour)
                  .setTitle(`🏪 bunny's shop`)
                  .setDescription(bunnyShopShopkeeper.welcome(interaction.client.allEmojis))
                  .setFields([
                     ...specialItems.length
                        ? specialItems
                           .map(item =>
                              ({
                                 name: item.name,
                                 value: `> Costs 🪙 \`${item.price.toLocaleString()}\` ${item.price === 1 ? `coin` : `coins`}`,
                                 inline: true
                              })
                           )
                           : [{
                              name: `No items to display`,
                              value: `> Check back again later!`
                           }],
                     {
                        name: `\u200b`,
                        value: `🏬 **Special items** last updated ${
                           Discord.time(
                              interaction.createdAt,
                              Discord.TimestampStyles.RelativeTime
                           )
                        }`
                     }
                  ]);


               // components
               components.splice(1, 4,
                  new Discord.ActionRowBuilder()
                     .setComponents(
                        new Discord.StringSelectMenuBuilder()
                           .setCustomId(`currency-buy-special-item`)
                           .setPlaceholder(`Select an item to buy...`)
                           .setOptions(
                              specialItems.length
                                 ? specialItems
                                 .map(item =>
                                    new Discord.StringSelectMenuOptionBuilder()
                                       .setLabel(item.name)
                                       .setDescription(`🪙 ${item.price.toLocaleString()} coins`)
                                       .setValue(item.name)
                                 )
                                 : new Discord.StringSelectMenuOptionBuilder()
                                    .setLabel(`fox`)
                                    .setValue(`fox`)
                           )
                           .setDisabled(!specialItems.length)
                     )
               );


               // break out
               break;
            };


            // flea market
            case `flea-market`: {
               // items
               const fleaMarket = shopDocData[`flea-market`] || [];

               const items = (
                  await Promise.all(
                     fleaMarket
                        .map(async data => {
                           if (data.name) { // cool this item is a name, return it as it was
                              return data;

                           } else { // this item has a DocumentRef
                              const itemDocSnap = await data.ref.get();     // fetch this user's personal item
                              const itemDocData = itemDocSnap.data() || {}; // get their personal item's data

                              if (!Object.values(itemDocData).length) // ok for some reason this user doesn't actually have a personal item
                                 return null;

                              else
                                 return { // return this item's name in the json too
                                    ...data,
                                    name: itemDocData.item.name
                                 };
                           };
                        })
                  )
               )
                  .filter(Boolean); // `null` is present if there was no personal item present, just filter those out of the list


               // embeds
               embeds[0]
                  .setColor(shopResponses[`flea-market`].ruby.colour)
                  .setTitle(`🐉 dragon deals`)
                  .setDescription(shopResponses[`flea-market`].ruby.welcome(interaction.client.allEmojis))
                  .setFields([
                     ...items.length
                        ? items
                           .map(item =>
                              ({
                                 name: item.name,
                                 value: strip`
                                    > From ${Discord.userMention(item.seller)}
                                    > Priced at 🪙 \`${item.price.toLocaleString()}\` ${item.price === 1 ? `coin` : `coins`}
                                 `,
                                 inline: true
                              })
                           )
                        : [{
                           name: `No items to display`,
                           value: `> You can sell one of your items here with ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`currency`, `items`, commandCurrencyId)}.`
                        }],
                     {
                        name: `\u200b`,
                        value: `💸 **Flea market** last updated ${
                           Discord.time(
                              interaction.createdAt,
                              Discord.TimestampStyles.RelativeTime
                           )
                        }`
                     }
                  ]);


               // components
               components.splice(1, 4,
                  new Discord.ActionRowBuilder()
                     .setComponents(
                        new Discord.StringSelectMenuBuilder()
                           .setCustomId(`currency-buy-flea-market-item`)
                           .setPlaceholder(`Select an item to buy...`)
                           .setOptions(
                              items.length
                                 ? items
                                    .map(item =>
                                       new Discord.StringSelectMenuOptionBuilder()
                                          .setLabel(item.name)
                                          .setDescription(`🪙 ${item.price.toLocaleString()} coins`)
                                          .setValue(`${item.ref?.id || item.name}:${item.seller}`)
                                    )
                                 : new Discord.StringSelectMenuOptionBuilder()
                                    .setLabel(`fox`)
                                    .setValue(`fox`)
                           )
                           .setDisabled(!fleaMarket.length)
                     )
               );


               // break out
               break;
            };


            // stalk market
            case `stalk-market`: {
               // the stalk market
               const stalkMarket = shopDocData[`stalk-market`];

               const period = (dayjs.utc().day() - 1) * 2
                  + (dayjs.utc().isAfter(dayjs.utc().startOf(`day`).add(12, `hours`)) ? 1 : 0);

               const isBuyingDay = dayjs.utc().day() === 0;

               const carrotsBeforeExpire = userCurrencyDocData.carrots?.quantity || 0;

               const carrotsExpired = userCurrencyDocData.carrots?.[`expires-at`]?.seconds < dayjs().unix();
               const previousCarrotsExpired = carrotsBeforeExpire && carrotsExpired;

               const carrots = !previousCarrotsExpired
                  ? carrotsBeforeExpire
                  : 0;


               // this user's carrots have expired, put them as their items
               if (carrotsExpired) {
                  const { quantity, price } = userCurrencyDocData.carrots;
                  const items = userCurrencyDocData.items || [];

                  items.push(
                     ...autoArray(quantity, () =>
                        ({
                           name:         `Rotten Carrot`,
                           "bought-for": price
                        })
                     )
                  );

                  await userCurrencyDocRef.update({
                     items,
                     carrots: FieldValue.delete()
                  });
               };


               // embeds
               embeds[0]
                  .setColor(shopResponses[`stalk-market`].deerie.colour)
                  .setTitle(`🧺 your local carrot farm`)
                  .setDescription(shopResponses[`stalk-market`].deerie.welcome(interaction.client.allEmojis))
                  .setFields({
                     name: `🗓️ Today is \`${[ `Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday` ][dayjs.utc().day()]}\``,
                     value: isBuyingDay
                        ? strip`
                           > 💳 This week's buy price is 🪙 \`${stalkMarket[`current-price`]}\` coins per 🥕 \`1\` carrot
                           > 💰 You can sell these carrots on \`Monday\`, \`Tuesday\`, \`Wednesday\`, \`Thursday\`, \`Friday\` and \`Saturday\`
                        `
                        : strip`
                           > 💰 Today's sell price is 🪙 \`${stalkMarket.prices[period].toLocaleString()}\` coins per 🥕 \`1\` carrot
                           > 💳 You can buy more carrots on \`Sunday\`
                        `
                  }, {
                     name: `\u200b`,
                     value: strip`
                        🥕 The **stalk market** will refresh ${Discord.time(
                           isBuyingDay
                              ? dayjs.utc().startOf(`day`).add(1, `day`).unix()
                              : dayjs.utc().hour() < 12
                                 ? dayjs.utc().startOf(`day`).add(12, `hours`).unix()
                                 : dayjs.utc().startOf(`day`).add(1,  `day`)  .unix(),
                           Discord.TimestampStyles.RelativeTime
                        )}
                     `
                  })
                  .setFooter({
                     text: strip`
                        ${embeds[0].data.footer.text}
                        🥕 ${
                           !previousCarrotsExpired
                              ? `${carrots.toLocaleString()} ${carrots === 1 ? `carrot` : `carrots`}`
                              : `0 carrots (your previous ${carrotsBeforeExpire.toLocaleString()} ${carrotsBeforeExpire === 1 ? `carrot` : `carrots`} became rotten!)`
                        } 
                     `
                  });


               // components
               components.splice(1, 4,
                  new Discord.ActionRowBuilder()
                     .setComponents(
                        isBuyingDay
                           ? new Discord.ButtonBuilder()
                              .setCustomId(`currency-stalk-market:buy-carrots`)
                              .setLabel(`Buy carrots`)
                              .setEmoji(`💳`)
                              .setStyle(Discord.ButtonStyle.Success)
                           : new Discord.ButtonBuilder()
                              .setCustomId(`currency-stalk-market:sell-carrots`)
                              .setLabel(`Sell carrots`)
                              .setEmoji(`💰`)
                              .setStyle(Discord.ButtonStyle.Success)
                     ),

                  new Discord.ActionRowBuilder()
                     .setComponents(
                        new Discord.ButtonBuilder()
                           .setCustomId(`currency-how-stalk-market-works`)
                           .setLabel(`A deer's guide to the stalk market`)
                           .setEmoji(interaction.client.allEmojis.currency_shopkeeper_deerie)
                           .setStyle(Discord.ButtonStyle.Secondary)
                     )
               );


               // break out
               break;
            };


         };


         // edit the deferred interaction
         await interaction.editReply({
            embeds,
            components
         });


         // break out
         break;
      };


      case `trade`: {
         // TODO
         // wip :3


         // data to show
         const data = {
            [FloodedAreaCommunity]: {
               colour: colours.flooded_area_bot
            },

            [UniverseLaboratories]: {
               colour: colours.purple
            }
         }[interaction.guild.id];


         // defer the interaction
         await interaction.deferReply();


         // embeds
         const embeds = [
            new Discord.EmbedBuilder()
               .setColor(data.colour)
               .setTitle(`👥 Trading with another member`)
               .setDescription(strip`
                  *It's...empty in here.* ${interaction.client.allEmojis.foxsleep}
               `)
         ];


         // edit the deferred interaction
         await interaction.editReply({
            embeds
         });


         // break out
         break;
      };


   };
};