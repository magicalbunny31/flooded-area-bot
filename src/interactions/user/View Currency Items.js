/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../../data/guilds.js";

import Discord from "discord.js";
import { colours, strip, sum } from "@magicalbunny31/pawesome-utility-stuffs";


export const guilds = [ FloodedAreaCommunity, UniverseLaboratories ];

export const data = new Discord.ContextMenuCommandBuilder()
   .setType(Discord.ApplicationCommandType.User)
   .setName(`View Currency Items`);


/**
 * @param {import("@flooded-area-bot-types/client").UserContextMenuCommandInteraction} interaction
 */
export default async interaction => {
   // options
   const user = interaction.targetUser;

   const area = `items`;


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
   await interaction.deferReply({
      ephemeral: true
   });


   // currency shop
   const shopDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id);
   const shopDocSnap = await shopDocRef.get();
   const shopDocData = shopDocSnap.data() || {};


   // this user's currency
   const userCurrencyDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id).collection(`users`).doc(user.id);
   const userCurrencyDocSnap = await userCurrencyDocRef.get();
   const userCurrencyDocData = userCurrencyDocSnap.data() || {};


   // commands
   const commands = await interaction.guild.commands.fetch();
   const commandCurrencyId = commands.find(command => command.name === `currency`)?.id || 0;


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
               : Math.ceil(userItem.price / 4) * 3;


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
                     📈 You'll earn 🪙 ${earnedCoins} ${earnedCoins === 1 ? `coin` : `coins`} per sale (${taxRateAsPercentage} tax rate)
                     📦 Buy your item for 75% of its price to increase its quantity by 1
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
                           .setLabel(`Edit personal item (🪙 500 coins)`)
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
                           .setLabel(`Create personal item (🪙 500 coins)`)
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
};