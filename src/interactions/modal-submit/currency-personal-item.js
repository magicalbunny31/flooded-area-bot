/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity, UniverseLaboratories } from "../../data/guilds.js";

import Discord from "discord.js";
import { FieldValue } from "@google-cloud/firestore";
import { colours, strip } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").ModalSubmitInteraction} interaction
 */
export default async interaction => {
   // modal info
   const [ _modal ] = interaction.customId.split(`:`);


   // fields
   const name = interaction.fields.getTextInputValue(`name`).trim();

   const rawPrice = interaction.fields.getTextInputValue(`price`).trim();
   const price    = +rawPrice;


   // data to show
   const data = {
      [FloodedAreaCommunity]: {
         colour: colours.flooded_area_bot
      },

      [UniverseLaboratories]: {
         colour: colours.purple
      }
   }[interaction.guild.id];


   // "defer" this reply
   // update the message if this is a command reply and this is the same command user as the button booper (or if the message is ephemeral)
   const isSameCommandUser = interaction.user.id === interaction.message.interaction?.user.id;
   const isEphemeral = interaction.message.flags.has(Discord.MessageFlags.Ephemeral);

   if (isSameCommandUser || isEphemeral) {
      const deferComponents = interaction.message.components;

      Object.assign(deferComponents[1].components[0].data, {
         emoji: Discord.parseEmoji(interaction.client.allEmojis.loading),
         disabled: true
      });

      for (const actionRow of deferComponents)
         for (const component of actionRow.components)
            component.data.disabled = true;

      await interaction.update({
         components: deferComponents
      });

   } else // this isn't the same person who used the command: create a new reply to the interaction
      await interaction.deferReply({
         ephemeral: true
      });


   // currency shop
   const shopDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id);
   const shopDocSnap = await shopDocRef.get();
   const shopDocData = shopDocSnap.data() || {};


   // this user's currency
   const userCurrencyDocRef  = interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id).collection(`users`).doc(interaction.user.id);
   const userCurrencyDocSnap = await userCurrencyDocRef.get();
   const userCurrencyDocData = userCurrencyDocSnap.data() || {};


   // items
   const userItem = userCurrencyDocData.item || {};

   const shopItems = shopDocData[`shop-items`] || [];
   const shopItem  = shopItems.find(item =>
      item.ref.isEqual(
         interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id).collection(`users`).doc(interaction.user.id)
      )
   ) || {};

   const hasPersonalItem = !!Object.values(userItem).length;
   const hasShopItem     = !!Object.values(shopItem).length;


   // embeds
   const embeds = [
      new Discord.EmbedBuilder()
         .setColor(data.colour)
   ];


   // components
   const components = [
      new Discord.ActionRowBuilder()
         .setComponents(
            new Discord.ButtonBuilder()
               .setCustomId(`currency-items:item`)
               .setLabel(`Go back to your personal item`)
               .setEmoji(`🏷️`)
               .setStyle(Discord.ButtonStyle.Secondary)
         )
   ];


   // the user doesn't have enough coins to afford this edit/create
   const userCoins = userCurrencyDocData.coins || 0;

   if (userCoins < 100) {
      embeds[0]
         .setDescription(strip`
            ### ❌ Can't ${hasPersonalItem ? `edit` : `create`} personal item
            > - It costs 🪙 \`100\` coins to ${hasPersonalItem ? `edit` : `create`} your personal item.
         `);

      return await interaction.editReply({
         embeds,
         components
      });
   };


   // the inputted price isn't an integer
   if (isNaN(price) || !Number.isSafeInteger(price)) {
      embeds[0]
         .setDescription(strip`
            ### ❌ Can't ${hasPersonalItem ? `edit` : `create`} personal item
            > - \`${rawPrice}\` isn't a valid integer.
         `);

      return await interaction.editReply({
         embeds,
         components
      });
   };


   // the inputted price is a negative number or 0
   if (price <= 0) {
      embeds[0]
         .setDescription(strip`
            ### ❌ Can't ${hasPersonalItem ? `edit` : `create`} personal item
            > - Enter a number greater than or equal to 1.
         `);

      return await interaction.editReply({
         embeds,
         components
      });
   };


   // update this user's personal item
   Object.assign(userItem, {
      name,
      price
   });

   await userCurrencyDocRef.update({
      coins: FieldValue.increment(-100),
      item:  userItem
   });


   // update this user's personal item's shop item
   if (!hasShopItem) {
      shopItems.push({
         "displayed":      false,
         "quantity":       1,
         "ref":            interaction.client.firestoreLegacy.collection(`currency`).doc(interaction.guild.id).collection(`users`).doc(interaction.user.id),
         "seller":         interaction.user.id
      });

      await shopDocRef.update({
         "shop-items": shopItems
      });
   };


   // embeds
   embeds[0]
      .setDescription(`### 🏷️ Personal item ${hasPersonalItem ? `updated` : `created`}!`);


   // edit the interaction
   await interaction.editReply({
      embeds,
      components
   });
};