/**
 * TODO
 * this file has not yet been refactored~
 */


import userAgent from "../data/user-agent.js";

import Discord from "discord.js";
import { ApplicationStatisticsStatusName } from "@magicalbunny31/fennec-utilities";
import { choice } from "@magicalbunny31/pawesome-utility-stuffs";


export const cron = "*/10 * * * *"; // at every 10th minute


/**
 * @param {import("@flooded-area-bot-types/client").default} client
 */
export default async client => {
   // set offline by fennec
   const fennecStatus = client.fennec.getApplicationStatusApplicationStatisticsStatus();

   if (fennecStatus?.name === ApplicationStatisticsStatusName.Offline)
      return client.user.setPresence({
         status: Discord.PresenceUpdateStatus.DoNotDisturb,
         activities: [{
            name: `currently offline..`,
            type: Discord.ActivityType.Custom
         }]
      });


   // fetch player counts for the games
   const [ floodedAreaPlayerCount ] = await (async () => {
      const response = await fetch(`https://games.roblox.com/v1/games?universeIds=1338193767`, {
         headers: {
            "Accept": `application/json`,
            "User-Agent": userAgent
         }
      });

      if (response.ok) {
         const json = await response.json();
         return [ json.data[0].playing || 0 ];
      } else
         return [ 0, 0 ];
   })();


   // list of statuses
   const statuses = [
      `Flooded Area 🌊`,
      `visit bunny's shop with /currency shop`,
      `view your level with /levels`,
      `STOP GRIEFING ME!!!!!`,
      `don't touch the waves :scary:`,
      `when will there be a new challenge?`,
      `trying to build a boat`,
      `trying to build a rocket`,
      `when's the next event?`,
      `hello, chat!`,
      `hello world`,
      `don't dm me for modmail`,
      `i got votekicked for eating bread`,
      `@everyone`,
      `hi`,
      `i hate flooded a`,
      `zzz`,
      `why are you in this server`,
      `balls`,
      `whar`,
      `:3`,
      `/cmd pancakes`,
      `raphael ate ALL my balls and now i'm sad`,
      `erm, what the tuna?`,
      `fish issue`,
      `#hugo2025`,
      `le tape`,
      `rawr ✨`,
      `can i have cool role`,
      `don't get rabies it's bad for you`,
      `why does the sun give us light when it's already bright`,
      `flooded area lost the braincells it never had from spaced out`,
      `flooded area mfs when their family members drown inside a flood and die (flooded area reference)`,
      `thousands of players active (flooded area reference)`,
      `boat = flooded area`,
      `/america`,
      `sily !`,
      `need a dispenser here`,
      `spy!`,
      `his mom its a cancer`,
      `good morning let's basketball`,
      `HUH`,
      `YOU MASH`,
      `the streets aint for u cuzzz`,
      `NOT READING ALLAT 🤦‍♂️🤣`,
      `go back to your cage you animal`,
      `boop haiii`,
      `i forgor`,
      `cheese`,
      `bread`,
      `[BLIZZARD] WAS HERE!!`,
      `boo!`,
      `i learned how to ## #### ###### in 1 second`,
      `fortnite or among us?`,
      `go away numbskull moron`,
      `Bro That's very fatphobic of you`,
      `flooded area won by doing absolutely nothing`,
      `The Scout is a Spy!`,
      `someone hacked it was uhhh orange juice guy`,
      `HE IS BUILDED PE`,
      `MOD PURGE MOD PURGE DESTROY THE MODERATION TEAM`,
      `Is the moderation system fair for all these people`,
      `That sounds illegal. Is cool.`,
      `the BREAD hungry flooded area players`,
      `I AM DROWNING`,
      `snore mimimimi`,
      `i dont know who you are`,
      `Ain't you Nathaniel B?`,
      `owo so cute`,
      `we are not playing kerbal space program`,
      `i am devastated`,
      `PLZ BAN FURRY PLZ`,
      `guh  help`,
      `im stimming im stimming im stimming im stimming im stimming im stimm`,
      `is this a tree`,
      `Im 90% sure insects count as animals`,
      `dont u dare`,
      `BEANS AND STONE!!!!!!`,
      `he eat jeff he monster >:(`,
      `water turns to acid and then into lava, classic ohio moment`,
      `fix server lags please`,
      `HOW DO I GLUE THINGS. PLEASE. I CAN'T PASS THE TUTORIAL.`,
      `exp.BlastRadius = 59.478 - math.pi`,
      `local num_num =  0 --// num num 💀`,
      `local c = 0  while c <=4 do  c += 4`,
      `;votekick tried to died`,
      `ah yes so flooded area supports lgbtq`,
      `Ive been here for a few minutes and realized you all are cancer. Bye!`,
      `flooded area mfs after killing a moderator`,
      `what the actual ####`,
      `@welololol since I didn't get accepted for mod, my team and I have been building a server cra`,
      `📦🦊`,
      `(icey was here)`
   ];
   const status = choice(statuses);


   // set status
   client.user.setPresence({
      status: Discord.PresenceUpdateStatus.Online,
      activities: [{
         name: `🌊👥${floodedAreaPlayerCount} • ${status}`,
         type: Discord.ActivityType.Custom
      }]
   });
};