import Canvas from "@napi-rs/canvas";
import fs from "node:fs/promises";
import { emoji } from "@magicalbunny31/pawesome-utility-stuffs";


const fontsDir = `./src/assets/votekick/fonts`;
for (const font of await fs.readdir(fontsDir))
   Canvas.GlobalFonts.registerFromPath(
      `./src/assets/votekick/fonts/${font}`,
      font.split(`.`).shift().replaceAll(`-`, ` `)
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 * @param {number} currentVotes
 * @param {number} requiredVotes
 */
export const generateVotekickImage = async (interaction, currentVotes, requiredVotes) => {
   const user = interaction.options.getUser(`user`);
   const reason = interaction.options.getString(`reason`);

   const canvas = Canvas.createCanvas(1700, 425);
   const context = canvas.getContext(`2d`);

   const rectangleHeightOffset = canvas.height - 75;

   context.beginPath();
   context.roundRect(0, 0, canvas.width, rectangleHeightOffset, Math.ceil(rectangleHeightOffset / 4.7));
   context.fillStyle = `#212121`;
   context.closePath();
   context.fill();

   const borderPadding = 15;
   const avatarPositionWidth = canvas.width - rectangleHeightOffset + borderPadding;
   const avatarPositionHeight = borderPadding;
   const avatarWidthHeight = rectangleHeightOffset - borderPadding * 2;

   const textLeftPadding = 50;

   context.font = `75px Montserrat Black`;
   context.fillStyle = `#ffffff`;
   context.fillText(`Votekick? (${currentVotes}/${requiredVotes})`, textLeftPadding, 100);

   const getFontSize = (canvas, baseFontSize, font, text) => {
      baseFontSize += 1; // the initial loop will always -1
      do {
         context.font = `${baseFontSize -= 1}px ${font}`;
      } while (context.measureText(text).width > canvas.width - avatarWidthHeight - textLeftPadding - (borderPadding * 2));
      return baseFontSize;
   };

   const getFormattedName = async user => {
      const member = await interaction.guild.members.fetch(user);
      const displayName = member.displayName.replace(emoji, ``).trim();
      return displayName === user.username
         ? `@${user.username}`
         : `${displayName} (@${user.username})`;
   };

   const votekickedUser = await getFormattedName(user);
   const votekickedUserFontSize = getFontSize(canvas, 60, `Montserrat Light`, votekickedUser);
   context.font = `${votekickedUserFontSize}px Montserrat Light`;
   context.fillText(votekickedUser, textLeftPadding, 170);

   context.font = `${getFontSize(canvas, 100, `Montserrat Regular`, reason)}px Montserrat Regular`;
   context.fillText(reason, textLeftPadding, 300);

   const getVotekickingFontSize = (canvas, baseFontSize, font, text) => {
      baseFontSize += 1; // the initial loop will always -1
      do {
         context.font = `${baseFontSize -= 1}px ${font}`;
      } while (context.measureText(text).width > canvas.width);
      return baseFontSize;
   };

   const votekickingUser = await getFormattedName(interaction.user);
   const votekickingText = `Started by: ${votekickingUser}`;
   const votekickingUserFontSize = getVotekickingFontSize(canvas, 55, `Montserrat Black`, votekickingText);
   context.font = `${votekickingUserFontSize}px Montserrat Black`;
   const votekickingTextLeft = canvas.width / 2 - context.measureText(votekickingText).width / 2;
   const votekickingTextTop = canvas.height - 20;
   context.fillText(votekickingText, votekickingTextLeft, votekickingTextTop);
   context.strokeStyle = `#000000`;
   context.lineWidth = 2;
   context.strokeText(votekickingText, votekickingTextLeft, votekickingTextTop);

   context.beginPath();
   context.roundRect(avatarPositionWidth, avatarPositionHeight, avatarWidthHeight, avatarWidthHeight, Math.floor(avatarWidthHeight / 5.3));
   context.closePath();
   context.fillStyle = `#424242`;
   context.fill();
   context.clip();

   const avatar = await Canvas.loadImage(user.displayAvatarURL({ size: 4096, extension: `png`, forceStatic: true }));
   context.drawImage(avatar, avatarPositionWidth, avatarPositionHeight, avatarWidthHeight, avatarWidthHeight);

   return await canvas.encode(`png`);
};


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export const generateVotekickFailImage = async interaction => {
   const user = interaction.options.getUser(`user`);

   const canvas = Canvas.createCanvas(1700, 350);
   const context = canvas.getContext(`2d`);

   const rectangleHeightOffset = canvas.height + 0;

   context.beginPath();
   context.roundRect(0, 0, canvas.width, rectangleHeightOffset, Math.ceil(rectangleHeightOffset / 4.7));
   context.fillStyle = `#212121`;
   context.closePath();
   context.fill();

   const borderPadding = 15;
   const avatarPositionWidth = canvas.width - rectangleHeightOffset + borderPadding;
   const avatarPositionHeight = borderPadding;
   const avatarWidthHeight = rectangleHeightOffset - borderPadding * 2;

   const textLeftPadding = 50;

   context.font = `75px Montserrat Black`;
   context.fillStyle = `#ffffff`;
   context.fillText(`Votekick failed!`, textLeftPadding, 100);

   const getFontSize = (canvas, baseFontSize, font, text) => {
      baseFontSize += 1; // the initial loop will always -1
      do {
         context.font = `${baseFontSize -= 1}px ${font}`;
      } while (context.measureText(text).width > canvas.width - avatarWidthHeight - textLeftPadding - (borderPadding * 2));
      return baseFontSize;
   };

   const getFormattedName = async user => {
      const member = await interaction.guild.members.fetch(user);
      const displayName = member.displayName.replace(emoji, ``).trim();
      return displayName === user.username
         ? `@${user.username}`
         : `${displayName} (@${user.username})`;
   };

   const votekickedUser = await getFormattedName(user);
   const votekickedUserFontSize = getFontSize(canvas, 60, `Montserrat Light`, votekickedUser);
   context.font = `${votekickedUserFontSize}px Montserrat Light`;
   context.fillText(votekickedUser, textLeftPadding, 170);

   context.font = `100px Montserrat Regular`;
   context.fillText(`skill issue :/`, textLeftPadding, 300);

   context.beginPath();
   context.roundRect(avatarPositionWidth, avatarPositionHeight, avatarWidthHeight, avatarWidthHeight, Math.floor(avatarWidthHeight / 5.3));
   context.closePath();
   context.fillStyle = `#424242`;
   context.fill();
   context.clip();

   const avatar = await Canvas.loadImage(`./src/assets/votekick/images/fail.png`);
   context.drawImage(avatar, avatarPositionWidth, avatarPositionHeight, avatarWidthHeight, avatarWidthHeight);

   return await canvas.encode(`png`);
};


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export const generateVotekickSuccessImage = async interaction => {
   const user = interaction.options.getUser(`user`);

   const canvas = Canvas.createCanvas(1700, 350);
   const context = canvas.getContext(`2d`);

   const rectangleHeightOffset = canvas.height + 0;

   context.beginPath();
   context.roundRect(0, 0, canvas.width, rectangleHeightOffset, Math.ceil(rectangleHeightOffset / 4.7));
   context.fillStyle = `#212121`;
   context.closePath();
   context.fill();

   const borderPadding = 15;
   const avatarPositionWidth = canvas.width - rectangleHeightOffset + borderPadding;
   const avatarPositionHeight = borderPadding;
   const avatarWidthHeight = rectangleHeightOffset - borderPadding * 2;

   const textLeftPadding = 50;

   context.font = `75px Montserrat Black`;
   context.fillStyle = `#ffffff`;
   context.fillText(`Successfully votekicked!`, textLeftPadding, 100);

   const getFontSize = (canvas, baseFontSize, font, text) => {
      baseFontSize += 1; // the initial loop will always -1
      do {
         context.font = `${baseFontSize -= 1}px ${font}`;
      } while (context.measureText(text).width > canvas.width - avatarWidthHeight - textLeftPadding - (borderPadding * 2));
      return baseFontSize;
   };

   const getFormattedName = async user => {
      const member = await interaction.guild.members.fetch(user);
      const displayName = member.displayName.replace(emoji, ``).trim();
      return displayName === user.username
         ? `@${user.username}`
         : `${displayName} (@${user.username})`;
   };

   const votekickedUser = await getFormattedName(user);
   const votekickedUserFontSize = getFontSize(canvas, 60, `Montserrat Light`, votekickedUser);
   context.font = `${votekickedUserFontSize}px Montserrat Light`;
   context.fillText(votekickedUser, textLeftPadding, 170);

   context.font = `100px Montserrat Regular`;
   context.fillText(`a rare occurrence!`, textLeftPadding, 300);

   context.beginPath();
   context.roundRect(avatarPositionWidth, avatarPositionHeight, avatarWidthHeight, avatarWidthHeight, Math.floor(avatarWidthHeight / 5.3));
   context.closePath();
   context.fillStyle = `#424242`;
   context.fill();
   context.clip();

   const avatar = await Canvas.loadImage(`./src/assets/votekick/images/success.png`);
   context.drawImage(avatar, avatarPositionWidth, avatarPositionHeight, avatarWidthHeight, avatarWidthHeight);

   return await canvas.encode(`png`);
};