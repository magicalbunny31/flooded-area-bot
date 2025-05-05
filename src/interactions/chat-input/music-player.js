/**
 * TODO
 * this file has not yet been refactored~
 */


import cache from "../../data/cache.js";
import { BunnyFurFest, FloodedAreaCommunity } from "../../data/guilds.js";
import musicPlayer from "../../data/music-player.js";

import Discord from "discord.js";
import { createReadStream } from "fs";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, demuxProbe, entersState, getVoiceConnection, joinVoiceChannel, VoiceConnectionDisconnectReason, VoiceConnectionStatus } from "@discordjs/voice";
import { colours, choice, strip, wait } from "@magicalbunny31/pawesome-utility-stuffs";


export const guilds = [ BunnyFurFest, FloodedAreaCommunity ];

export const data = new Discord.SlashCommandBuilder()
   .setName(`music-player`)
   .setDescription(`Commands to play music found in-game`)
   .addSubcommandGroup(
      new Discord.SlashCommandSubcommandGroupBuilder()
         .setName(`play`)
         .setDescription(`Play music found in-game`)
         .addSubcommand(
            new Discord.SlashCommandSubcommandBuilder()
               .setName(`category`)
               .setDescription(`Play a random track from a specified category`)
               .addStringOption(
                  new Discord.SlashCommandStringOption()
                     .setName(`name`)
                     .setDescription(`Category to select a random track from`)
                     .setAutocomplete(true)
                     .setRequired(true)
               )
               .addStringOption(
                  new Discord.SlashCommandStringOption()
                     .setName(`behaviour`)
                     .setDescription(`What should happen when the track finishes playing`)
                     .setChoices({
                        name: `Play another track from this category`,
                        value: `loop-category`
                     }, {
                        name: `Repeat the last played track`,
                        value: `loop-track`
                     }, {
                        name: `Stop the music player and leave the voice channel`,
                        value: `disconnect`
                     })
                     .setRequired(true)
               )
         )
         .addSubcommand(
            new Discord.SlashCommandSubcommandBuilder()
               .setName(`random`)
               .setDescription(`Play a random track`)
               .addStringOption(
                  new Discord.SlashCommandStringOption()
                     .setName(`behaviour`)
                     .setDescription(`What should happen when the track finishes playing`)
                     .setChoices({
                        name: `Play another random track`,
                        value: `loop-random`
                     }, {
                        name: `Repeat the last played track`,
                        value: `loop-track`
                     }, {
                        name: `Stop the music player and leave the voice channel`,
                        value: `disconnect`
                     })
                     .setRequired(true)
               )
         )
         .addSubcommand(
            new Discord.SlashCommandSubcommandBuilder()
               .setName(`track`)
               .setDescription(`Play a specific track`)
               .addIntegerOption(
                  new Discord.SlashCommandIntegerOption()
                     .setName(`name`)
                     .setDescription(`Track to play`)
                     .setAutocomplete(true)
                     .setRequired(true)
               )
               .addStringOption(
                  new Discord.SlashCommandStringOption()
                     .setName(`behaviour`)
                     .setDescription(`What should happen when the track finishes playing`)
                     .setChoices({
                        name: `Repeat the track`,
                        value: `loop-track`
                     }, {
                        name: `Stop the music player and leave the voice channel`,
                        value: `disconnect`
                     })
                     .setRequired(true)
               )
         )
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`stop`)
         .setDescription(`Stop playing music in this server`)
   )
   .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
         .setName(`view-tracks`)
         .setDescription(`View the list of music that plays in-game`)
   );


/**
 * @param {import("@flooded-area-bot-types/client").ChatInputCommandInteraction} interaction
 */
export default async interaction => {
   // what command to run based on the subcommand group
   const subcommandGroup = interaction.options.getSubcommandGroup();

   switch (subcommandGroup) {


      case `play`: {
         // what command to run based on the subcommand
         const subcommand = interaction.options.getSubcommand();

         switch (subcommand) {


            case `category`: {
               // options
               const categoryId = interaction.options.getString(`name`);
               const behaviour  = interaction.options.getString(`behaviour`);


               // data to show
               const data = {
                  [BunnyFurFest]: {
                     colour: colours.flooded_area_bot,
                     name:   `flooded-area`
                  },

                  [FloodedAreaCommunity]: {
                     colour: colours.flooded_area_bot,
                     name:   `flooded-area`
                  }
               }[interaction.guild.id];


               // function to get a track
               const getTrack = (categoryId, previousRobloxAssetId) =>
                  choice(
                     musicPlayer[data.name]
                        .filter(data => data.categoryId === categoryId && data.robloxAssetId !== previousRobloxAssetId)
                  );


               // function to create embeds
               const createEmbeds = (track, channelId, behaviour) => [
                  new Discord.EmbedBuilder()
                     .setColor(data.colour)
                     .setTitle(`🎶 ${track.name}`)
                     .setURL(`https://create.roblox.com/marketplace/asset/${track.robloxAssetId}`)
                     .setThumbnail(`attachment://${track.albumArtFile}`)
                     .setFields([
                        {
                           name: `📂 Category`,
                           value: `> ${track.categoryName}`,
                           inline: true
                        },
                        ...track.composers.length
                           ? [{
                              name: `🎼 Composers`,
                              value: track.composers
                                 .map(composer => `> ${composer}`)
                                 .join(`\n`),
                              inline: true
                           }]
                           : []
                     ])
                     .setFooter({
                        text: track.provider
                     }),

                  new Discord.EmbedBuilder()
                     .setColor(data.colour)
                     .setAuthor({
                        name: `Music Player`,
                        iconURL: `attachment://Music_Player.webp`
                     })
                     .setFields({
                        name: `🔉 Streaming to voice channel`,
                        value: `> ${Discord.channelMention(channelId)}`,
                        inline: true
                     }, {
                        name: `💭 When the track finishes playing...`,
                        value: `> ${
                           {
                              "loop-category": `Play another track from this category.`,
                              "loop-random":   `Play another random track.`,
                              "loop-track":    `Repeat the last played track.`,
                              "disconnect":    `Stop the music player and leave the voice channel.`
                           }[behaviour]
                        }`,
                        inline: true
                     })
               ];


               // function to create files
               const createFiles = track => [
                  ...track.albumArtFile
                     ? [
                        new Discord.AttachmentBuilder()
                           .setFile(`./src/assets/music-player/${track.albumArtFile}`)
                     ]
                     : [],

                  new Discord.AttachmentBuilder()
                     .setFile(`./src/assets/music-player/Music_Player.webp`)
               ];


               // there's only one track in this category
               if (musicPlayer[data.name].filter(data => data.categoryId === categoryId).length === 1)
                  return await interaction.reply({
                     content: strip`
                        ### ❌ There's only 1 track in this category
                        > - Use ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`music-player`, `play`, `track`, interaction.commandId)} instead to listen to this category's singular track.
                     `,
                     ephemeral: true
                  });


               // get a track from this category
               const track = getTrack(categoryId);


               // no track: this isn't a category
               if (!track)
                  return await interaction.reply({
                     content: strip`
                        ### ❌ Category not found
                        > - Try selecting an option from the inline autocomplete choices when using ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`music-player`, `play`, `category`, interaction.commandId)}.
                     `,
                     ephemeral: true
                  });


               // member isn't in a voice channel
               if (!interaction.member.voice.channel)
                  return await interaction.reply({
                     content: strip`
                        ### ❌ Can't start music player
                        > - You need to join a voice channel for ${interaction.client.user} to stream music to.
                     `,
                     ephemeral: true
                  });


               // the bot is in a voice channel and playing a track already
               const currentMusicPlayerInfo = cache.get(`music-player:${interaction.guild.id}`);
               const voiceConnection        = getVoiceConnection(interaction.guild.id);

               if (currentMusicPlayerInfo && voiceConnection) {
                  await interaction.deferReply({
                     ephemeral: true
                  });

                  const track = musicPlayer[data.name].find(data => data.robloxAssetId === currentMusicPlayerInfo.robloxAssetId);

                  return await interaction.editReply({
                     content: strip`
                        ### ❌ The music player is already on!
                        > - ${interaction.client.user} is already connected to ${Discord.channelMention(voiceConnection.joinConfig.channelId)}.
                        >  - Stop the music player with ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`music-player`, `stop`, interaction.commandId)} to make ${interaction.client.user} leave ${interaction.guild.members.me.voice.channel}.
                     `,
                     embeds: createEmbeds(track, voiceConnection.joinConfig.channelId, currentMusicPlayerInfo.behaviour),
                     files: createFiles(track)
                  });
               };


               // defer the interaction
               const message = await interaction.deferReply({
                  fetchReply: true
               });


               // set the music player info in the cache
               cache.set(`music-player:${interaction.guild.id}`, {
                  robloxAssetId: track.robloxAssetId,
                  behaviour
               });


               // connect to the channel
               const connection = joinVoiceChannel({
                  channelId: interaction.member.voice.channel.id,
                  guildId: interaction.guild.id,
                  selfDeaf: true,
                  adapterCreator: interaction.guild.voiceAdapterCreator
               });


               // handle logic for the connection to the voice channel
               connection.on(`stateChange`, async (_oldState, newState) => {
                  if (newState.status === VoiceConnectionStatus.Disconnected) { // the connection has been severed and was disconnected

                     if (
                        newState.reason === VoiceConnectionDisconnectReason.WebSocketClose // the bot was kicked from the voice channel - reconnecting is impossible
                        && newState.closeCode === 4014                                     // the bot may have switched voice channels (which will automatically reconnect in a bit) or something else happened (do not try to reconnect!!)
                     ) {
                        // depending on what happened, the bot may reconnect and we can ignore this disconnect ever happened!
                        try {
                           // wait if the bot reconnects to the voice channel within the next five seconds
                           await entersState(connection, VoiceConnectionStatus.Connecting, 5000);
                        } catch {
                           // assume that the bot was disconnected and destroy the connection
                           connection.destroy();
                        };

                     } else if (connection.rejoinAttempts < 5) { // seems like this disconnect is recoverable; give a max of five reattempts to rejoin the voice channel
                        await wait((connection.rejoinAttempts + 1) * 1000); // wait one second, multiplied by every rejoin attempt
                        connection.rejoin(); // try to rejoin the voice channel

                     } else // we did all we can, chef - just disconnect at this point
                        connection.destroy();

                  } else if (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling) { // the bot is trying to connect to the voice channel
                     try {
                        // wait if the bot reconnects to the voice channel within fifteen seconds
                        await entersState(connection, VoiceConnectionStatus.Ready, 15000);
                     } catch {
                        if (connection.state.status !== VoiceConnectionStatus.Destroyed) // the bot couldn't connect, destroy the connection if it hasn't been already
                           connection.destroy();
                     };

                  };
                  // any other state changed aren't of any concern~
               });


               // create the audio player
               const player = createAudioPlayer();
               connection.subscribe(player);


               // play audio
               const playTrack = async audioFile => {
                  const file             = createReadStream(`./src/assets/music-player/${audioFile}`);
                  const { stream, type } = await demuxProbe(file);
                  const resource         = createAudioResource(stream, {
                     inputType: type
                  });

                  player.play(resource);
               };

               await playTrack(track.audioFile);


               // when the music player finishes..
               player.on(AudioPlayerStatus.Idle, async () => {
                  if (behaviour === `loop-category`) { // play another track from this category
                     const { robloxAssetId: previousTrackRobloxAssetId } = cache.get(`music-player:${interaction.guild.id}`);

                     const newTrack = getTrack(categoryId, previousTrackRobloxAssetId);
                     await playTrack(newTrack.audioFile);

                     cache.set(`music-player:${interaction.guild.id}`, {
                        robloxAssetId: newTrack.robloxAssetId,
                        behaviour
                     });

                     await interaction.channel.send({
                        embeds: createEmbeds(newTrack, connection.joinConfig.channelId, behaviour),
                        files: createFiles(newTrack),
                        reply: {
                           messageReference: message,
                           failIfNotExists: false
                        }
                     });

                  } else if (behaviour === `loop-track`) { // repeat the track
                     await playTrack(track.audioFile);

                  } else { // disconnect from the voice channel
                     connection.destroy();
                  };
               });


               // embeds
               const embeds = createEmbeds(track, connection.joinConfig.channelId, behaviour);


               // files
               const files = createFiles(track);


               // edit the deferred interaction
               await interaction.editReply({
                  embeds,
                  files
               });


               // break out
               break;
            };


            case `random`: {
               // options
               const behaviour = interaction.options.getString(`behaviour`);


               // data to show
               const data = {
                  [BunnyFurFest]: {
                     colour: colours.flooded_area_bot,
                     name:   `flooded-area`
                  },

                  [FloodedAreaCommunity]: {
                     colour: colours.flooded_area_bot,
                     name:   `flooded-area`
                  }
               }[interaction.guild.id];


               // function to get a track
               const getTrack = previousRobloxAssetId => choice(
                  musicPlayer[data.name]
                     .filter(data => data.robloxAssetId !== previousRobloxAssetId)
               );


               // function to create embeds
               const createEmbeds = (track, channelId, behaviour) => [
                  new Discord.EmbedBuilder()
                     .setColor(data.colour)
                     .setTitle(`🎶 ${track.name}`)
                     .setURL(`https://create.roblox.com/marketplace/asset/${track.robloxAssetId}`)
                     .setThumbnail(`attachment://${track.albumArtFile}`)
                     .setFields([
                        {
                           name: `📂 Category`,
                           value: `> ${track.categoryName}`,
                           inline: true
                        },
                        ...track.composers.length
                           ? [{
                              name: `🎼 Composers`,
                              value: track.composers
                                 .map(composer => `> ${composer}`)
                                 .join(`\n`),
                              inline: true
                           }]
                           : []
                     ])
                     .setFooter({
                        text: track.provider
                     }),

                  new Discord.EmbedBuilder()
                     .setColor(data.colour)
                     .setAuthor({
                        name: `Music Player`,
                        iconURL: `attachment://Music_Player.webp`
                     })
                     .setFields({
                        name: `🔉 Streaming to voice channel`,
                        value: `> ${Discord.channelMention(channelId)}`,
                        inline: true
                     }, {
                        name: `💭 When the track finishes playing...`,
                        value: `> ${
                           {
                              "loop-category": `Play another track from this category.`,
                              "loop-random":   `Play another random track.`,
                              "loop-track":    `Repeat the last played track.`,
                              "disconnect":    `Stop the music player and leave the voice channel.`
                           }[behaviour]
                        }`,
                        inline: true
                     })
               ];


               // function to create files
               const createFiles = track => [
                  ...track.albumArtFile
                     ? [
                        new Discord.AttachmentBuilder()
                           .setFile(`./src/assets/music-player/${track.albumArtFile}`)
                     ]
                     : [],

                  new Discord.AttachmentBuilder()
                     .setFile(`./src/assets/music-player/Music_Player.webp`)
               ];


               // get a track
               const track = getTrack();


               // member isn't in a voice channel
               if (!interaction.member.voice.channel)
                  return await interaction.reply({
                     content: strip`
                        ### ❌ Can't start music player
                        > - You need to join a voice channel for ${interaction.client.user} to stream music to.
                     `,
                     ephemeral: true
                  });


               // the bot is in a voice channel and playing a track already
               const currentMusicPlayerInfo = cache.get(`music-player:${interaction.guild.id}`);
               const voiceConnection        = getVoiceConnection(interaction.guild.id);

               if (currentMusicPlayerInfo && voiceConnection) {
                  await interaction.deferReply({
                     ephemeral: true
                  });

                  const track = musicPlayer[data.name].find(data => data.robloxAssetId === currentMusicPlayerInfo.robloxAssetId);

                  return await interaction.editReply({
                     content: strip`
                        ### ❌ The music player is already on!
                        > - ${interaction.client.user} is already connected to ${Discord.channelMention(voiceConnection.joinConfig.channelId)}.
                        >  - Stop the music player with ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`music-player`, `stop`, interaction.commandId)} to make ${interaction.client.user} leave ${interaction.guild.members.me.voice.channel}.
                     `,
                     embeds: createEmbeds(track, voiceConnection.joinConfig.channelId, currentMusicPlayerInfo.behaviour),
                     files: createFiles(track)
                  });
               };


               // defer the interaction
               const message = await interaction.deferReply({
                  fetchReply: true
               });


               // set the music player info in the cache
               cache.set(`music-player:${interaction.guild.id}`, {
                  robloxAssetId: track.robloxAssetId,
                  behaviour
               });


               // connect to the channel
               const connection = joinVoiceChannel({
                  channelId: interaction.member.voice.channel.id,
                  guildId: interaction.guild.id,
                  selfDeaf: true,
                  adapterCreator: interaction.guild.voiceAdapterCreator
               });


               // handle logic for the connection to the voice channel
               connection.on(`stateChange`, async (_oldState, newState) => {
                  if (newState.status === VoiceConnectionStatus.Disconnected) { // the connection has been severed and was disconnected

                     if (
                        newState.reason === VoiceConnectionDisconnectReason.WebSocketClose // the bot was kicked from the voice channel - reconnecting is impossible
                        && newState.closeCode === 4014                                     // the bot may have switched voice channels (which will automatically reconnect in a bit) or something else happened (do not try to reconnect!!)
                     ) {
                        // depending on what happened, the bot may reconnect and we can ignore this disconnect ever happened!
                        try {
                           // wait if the bot reconnects to the voice channel within the next five seconds
                           await entersState(connection, VoiceConnectionStatus.Connecting, 5000);
                        } catch {
                           // assume that the bot was disconnected and destroy the connection
                           connection.destroy();
                        };

                     } else if (connection.rejoinAttempts < 5) { // seems like this disconnect is recoverable; give a max of five reattempts to rejoin the voice channel
                        await wait((connection.rejoinAttempts + 1) * 1000); // wait one second, multiplied by every rejoin attempt
                        connection.rejoin(); // try to rejoin the voice channel

                     } else // we did all we can, chef - just disconnect at this point
                        connection.destroy();

                  } else if (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling) { // the bot is trying to connect to the voice channel
                     try {
                        // wait if the bot reconnects to the voice channel within fifteen seconds
                        await entersState(connection, VoiceConnectionStatus.Ready, 15000);
                     } catch {
                        if (connection.state.status !== VoiceConnectionStatus.Destroyed) // the bot couldn't connect, destroy the connection if it hasn't been already
                           connection.destroy();
                     };

                  };
                  // any other state changed aren't of any concern~
               });


               // create the audio player
               const player = createAudioPlayer();
               connection.subscribe(player);


               // play audio
               const playTrack = async audioFile => {
                  const file             = createReadStream(`./src/assets/music-player/${audioFile}`);
                  const { stream, type } = await demuxProbe(file);
                  const resource         = createAudioResource(stream, {
                     inputType: type
                  });

                  player.play(resource);
               };

               await playTrack(track.audioFile);


               // when the music player finishes..
               player.on(AudioPlayerStatus.Idle, async () => {
                  if (behaviour === `loop-random`) { // play another random track
                     const { robloxAssetId: previousTrackRobloxAssetId } = cache.get(`music-player:${interaction.guild.id}`);

                     const newTrack = getTrack(previousTrackRobloxAssetId);
                     await playTrack(newTrack.audioFile);

                     cache.set(`music-player:${interaction.guild.id}`, {
                        robloxAssetId: newTrack.robloxAssetId,
                        behaviour
                     });

                     await interaction.channel.send({
                        embeds: createEmbeds(newTrack, connection.joinConfig.channelId, behaviour),
                        files: createFiles(newTrack),
                        reply: {
                           messageReference: message,
                           failIfNotExists: false
                        }
                     });

                  } else if (behaviour === `loop-track`) { // repeat the track
                     await playTrack(track.audioFile);

                  } else { // disconnect from the voice channel
                     connection.destroy();
                  };
               });


               // embeds
               const embeds = createEmbeds(track, connection.joinConfig.channelId, behaviour);


               // files
               const files = createFiles(track);


               // edit the deferred interaction
               await interaction.editReply({
                  embeds,
                  files
               });


               // break out
               break;
            };


            case `track`: {
               // options
               const robloxAssetId = interaction.options.getInteger(`name`);
               const behaviour     = interaction.options.getString(`behaviour`);


               // data to show
               const data = {
                  [BunnyFurFest]: {
                     colour: colours.flooded_area_bot,
                     name:   `flooded-area`
                  },

                  [FloodedAreaCommunity]: {
                     colour: colours.flooded_area_bot,
                     name:   `flooded-area`
                  }
               }[interaction.guild.id];


               // function to get this track
               const getTrack = robloxAssetId =>
                  musicPlayer[data.name].find(data => data.robloxAssetId === robloxAssetId);


               // function to create embeds
               const createEmbeds = (track, channelId, behaviour) => [
                  new Discord.EmbedBuilder()
                     .setColor(data.colour)
                     .setTitle(`🎶 ${track.name}`)
                     .setURL(`https://create.roblox.com/marketplace/asset/${track.robloxAssetId}`)
                     .setThumbnail(`attachment://${track.albumArtFile}`)
                     .setFields([
                        {
                           name: `📂 Category`,
                           value: `> ${track.categoryName}`,
                           inline: true
                        },
                        ...track.composers.length
                           ? [{
                              name: `🎼 Composers`,
                              value: track.composers
                                 .map(composer => `> ${composer}`)
                                 .join(`\n`),
                              inline: true
                           }]
                           : []
                     ])
                     .setFooter({
                        text: track.provider
                     }),

                  new Discord.EmbedBuilder()
                     .setColor(data.colour)
                     .setAuthor({
                        name: `Music Player`,
                        iconURL: `attachment://Music_Player.webp`
                     })
                     .setFields({
                        name: `🔉 Streaming to voice channel`,
                        value: `> ${Discord.channelMention(channelId)}`,
                        inline: true
                     }, {
                        name: `💭 When the track finishes playing...`,
                        value: `> ${
                           {
                              "loop-category": `Play another track from this category.`,
                              "loop-random":   `Play another random track.`,
                              "loop-track":    `Repeat the last played track.`,
                              "disconnect":    `Stop the music player and leave the voice channel.`
                           }[behaviour]
                        }`,
                        inline: true
                     })
               ];


               // function to create files
               const createFiles = track => [
                  ...track.albumArtFile
                     ? [
                        new Discord.AttachmentBuilder()
                           .setFile(`./src/assets/music-player/${track.albumArtFile}`)
                     ]
                     : [],

                  new Discord.AttachmentBuilder()
                     .setFile(`./src/assets/music-player/Music_Player.webp`)
               ];


               // get this track
               const track = getTrack(robloxAssetId);


               // no track
               if (!track)
                  return await interaction.reply({
                     content: strip`
                        ### ❌ Track not found
                        > - Try selecting an option from the inline autocomplete choices when using ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`music-player`, `play`, `track`, interaction.commandId)}.
                     `,
                     ephemeral: true
                  });


               // member isn't in a voice channel
               if (!interaction.member.voice.channel)
                  return await interaction.reply({
                     content: strip`
                        ### ❌ Can't start music player
                        > - You need to join a voice channel for ${interaction.client.user} to stream music to.
                     `,
                     ephemeral: true
                  });


               // the bot is in a voice channel and playing a track already
               const currentMusicPlayerInfo = cache.get(`music-player:${interaction.guild.id}`);
               const voiceConnection        = getVoiceConnection(interaction.guild.id);

               if (currentMusicPlayerInfo && voiceConnection) {
                  await interaction.deferReply({
                     ephemeral: true
                  });

                  const track = getTrack(currentMusicPlayerInfo.robloxAssetId);

                  return await interaction.editReply({
                     content: strip`
                        ### ❌ The music player is already on!
                        > - ${interaction.client.user} is already connected to ${Discord.channelMention(voiceConnection.joinConfig.channelId)}.
                        >  - Stop the music player with ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`music-player`, `stop`, interaction.commandId)} to make ${interaction.client.user} leave ${interaction.guild.members.me.voice.channel}.
                     `,
                     embeds: createEmbeds(track, voiceConnection.joinConfig.channelId, currentMusicPlayerInfo.behaviour),
                     files: createFiles(track)
                  });
               };


               // defer the interaction
               await interaction.deferReply();


               // set the music player info in the cache
               cache.set(`music-player:${interaction.guild.id}`, {
                  robloxAssetId,
                  behaviour
               });


               // connect to the channel
               const connection = joinVoiceChannel({
                  channelId: interaction.member.voice.channel.id,
                  guildId: interaction.guild.id,
                  selfDeaf: true,
                  adapterCreator: interaction.guild.voiceAdapterCreator
               });


               // handle logic for the connection to the voice channel
               connection.on(`stateChange`, async (_oldState, newState) => {
                  if (newState.status === VoiceConnectionStatus.Disconnected) { // the connection has been severed and was disconnected

                     if (
                        newState.reason === VoiceConnectionDisconnectReason.WebSocketClose // the bot was kicked from the voice channel - reconnecting is impossible
                        && newState.closeCode === 4014                                     // the bot may have switched voice channels (which will automatically reconnect in a bit) or something else happened (do not try to reconnect!!)
                     ) {
                        // depending on what happened, the bot may reconnect and we can ignore this disconnect ever happened!
                        try {
                           // wait if the bot reconnects to the voice channel within the next five seconds
                           await entersState(connection, VoiceConnectionStatus.Connecting, 5000);
                        } catch {
                           // assume that the bot was disconnected and destroy the connection
                           connection.destroy();
                        };

                     } else if (connection.rejoinAttempts < 5) { // seems like this disconnect is recoverable; give a max of five reattempts to rejoin the voice channel
                        await wait((connection.rejoinAttempts + 1) * 1000); // wait one second, multiplied by every rejoin attempt
                        connection.rejoin(); // try to rejoin the voice channel

                     } else // we did all we can, chef - just disconnect at this point
                        connection.destroy();

                  } else if (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling) { // the bot is trying to connect to the voice channel
                     try {
                        // wait if the bot reconnects to the voice channel within fifteen seconds
                        await entersState(connection, VoiceConnectionStatus.Ready, 15000);
                     } catch {
                        if (connection.state.status !== VoiceConnectionStatus.Destroyed) // the bot couldn't connect, destroy the connection if it hasn't been already
                           connection.destroy();
                     };

                  };
                  // any other state changed aren't of any concern~
               });


               // create the audio player
               const player = createAudioPlayer();
               connection.subscribe(player);


               // play audio
               const playTrack = async audioFile => {
                  const file             = createReadStream(`./src/assets/music-player/${audioFile}`);
                  const { stream, type } = await demuxProbe(file);
                  const resource         = createAudioResource(stream, {
                     inputType: type
                  });

                  player.play(resource);
               };

               await playTrack(track.audioFile);


               // when the music player finishes..
               player.on(AudioPlayerStatus.Idle, async () => {
                  if (behaviour === `loop-track`) { // repeat the track
                     await playTrack(track.audioFile);

                  } else { // disconnect from the voice channel
                     connection.destroy();
                  };
               });


               // embeds
               const embeds = createEmbeds(track, connection.joinConfig.channelId, behaviour);


               // files
               const files = createFiles(track);


               // edit the deferred interaction
               await interaction.editReply({
                  embeds,
                  files
               });


               // break out
               break;
            };


         };


         // break out
         break;
      };


      case `stop`: {
         // the bot isn't playing anything
         const currentMusicPlayerInfo = cache.get(`music-player:${interaction.guild.id}`);
         const voiceConnection        = getVoiceConnection(interaction.guild.id);

         if (!currentMusicPlayerInfo || !voiceConnection)
            return await interaction.reply({
               content: strip`
                  ### ❌ The music player is off
                  > - You can only use ${interaction.client.allEmojis.slash_command} ${Discord.chatInputApplicationCommandMention(`music-player`, `stop`, interaction.commandId)} when ${interaction.client.user} is streaming music to a voice channel.
               `,
               ephemeral: true
            });


         // defer the interaction
         await interaction.deferReply();


         // remove the music player info from the cache
         cache.del(`music-player:${interaction.guild.id}`);


         // destroy the voice connection
         voiceConnection.destroy();


         // edit the deferred interaction
         await interaction.editReply({
            content: strip`
               ### ✅ Stopped music player!
               > - ${interaction.client.user} has left ${Discord.channelMention(voiceConnection.joinConfig.channelId)}.
            `
         });


         // break out
         break;
      };


      case `view-tracks`: {
         // data to show
         const data = {
            [BunnyFurFest]: {
               colour: colours.flooded_area_bot,
               name:   `flooded-area`
            },

            [FloodedAreaCommunity]: {
               colour: colours.flooded_area_bot,
               name:   `flooded-area`
            }
         }[interaction.guild.id];


         // category to view
         const categoryId = musicPlayer[data.name][0].categoryId;


         // defer the interaction
         await interaction.deferReply();


         // embeds
         const embeds = [
            new Discord.EmbedBuilder()
               .setColor(data.colour)
               .setAuthor({
                  name: `Music Player`,
                  iconURL: `attachment://Music_Player.webp`
               })
               .setDescription(
                  musicPlayer[data.name]
                     .filter(data => data.categoryId === categoryId)
                     .map(data => `- ${Discord.hyperlink(data.name, `https://create.roblox.com/marketplace/asset/${data.robloxAssetId}`)}`)
                     .join(`\n`)
               )
         ];


         // components
         const components = [
            new Discord.ActionRowBuilder()
               .setComponents(
                  new Discord.StringSelectMenuBuilder()
                     .setCustomId(`music-player-view-tracks`)
                     .setPlaceholder(`Select a category...`)
                     .setOptions(
                        musicPlayer[data.name]
                           .filter((value, index, self) =>
                              index === self.findIndex(t => t.categoryId === value.categoryId)
                           )
                           .map(data =>
                              new Discord.StringSelectMenuOptionBuilder()
                                 .setValue(data.categoryId)
                                 .setLabel(data.categoryName)
                                 .setEmoji(data.emoji)
                                 .setDefault(data.categoryId === categoryId)
                           )
                     )
               )
         ];


         // files
         const files = [
            new Discord.AttachmentBuilder()
               .setFile(`./src/assets/music-player/Music_Player.webp`)
         ];


         // edit the deferred interaction
         await interaction.editReply({
            embeds,
            components,
            files
         });


         // break out
         break;
      };


   };
};