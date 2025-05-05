/**
 * TODO
 * this file has not yet been refactored~
 */


import dayjs from "dayjs";
import { hyperlink, time, TimestampStyles } from "discord.js";
import { choice, strip } from "@magicalbunny31/pawesome-utility-stuffs";


export default {
   "shop-items": {
      halo: {
         colour: 0x9000ff,
         welcome: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_halo} waaa..
                  ${allEmojis.currency_shopkeeper_halo} so eepy..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} bunny says they never sleeps on the job but..
                  ${allEmojis.currency_shopkeeper_halo} look at them, they're soo adorable when they're sleeping..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} now it's my turn to play shopkeeper!!!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} what's the weather like up there?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} hii~
                  ${allEmojis.currency_shopkeeper_halo} welcome to cutie's shop
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} im so silly :3
                  ${allEmojis.currency_shopkeeper_halo} im so silly :3
                  ${allEmojis.currency_shopkeeper_halo} im silly :3333333
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} i know something about bunny you don't :3
               `
            ]);
         },
         viewing: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_halo} this one has been at on shelves for too long
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} but i like that onee..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} i dont care about this one please take it
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} ooo..
                  ${allEmojis.currency_shopkeeper_halo} good choice!!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} can i go back to cuddling cutie after this?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} we accept coins, comets and dollar bucks
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} the last one in stock too!
               `
            ]);
         },
         purchase: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_halo} thank you for the dollar bucks!!
                  ${allEmojis.currency_shopkeeper_halo} you have a safe journey now!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} do you want an umbrella too?
                  ${allEmojis.currency_shopkeeper_halo} it looks like a thunderstorm is coming..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} can i go get a drink now
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} *cutie cutie cutie!!*
                  ${allEmojis.currency_shopkeeper_halo} *wake up i did a thing!!*
                  ${allEmojis.currency_shopkeeper_bunny} hm..~ ..huh? oh.... *snore mimimimi*
               `
            ]);
         }
      },

      bunny: {
         colour: 0xffc832,
         welcome: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} yeah, this is the same place as usual
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} what do you want?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} you get 🪙 \`1\` coin whenever you send a message, every minute!
                  ${allEmojis.currency_shopkeeper_bunny} ..so what are you waiting for? send a message already duh
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} zzz~
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} asleep on the job?
                  ${allEmojis.currency_shopkeeper_bunny} i would never!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} hurry up, i have a ticket to deal with
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} ruby recently took control of the flea market
                  ${allEmojis.currency_shopkeeper_bunny} go check it!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} you guys buy too many bunny plushies
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i am NOT a protogen!
                  ${allEmojis.currency_shopkeeper_bunny} i'm a folf! a fox-wolf!
                  ${allEmojis.currency_shopkeeper_bunny} one's a robot and the other's a literal animal: there's a BIG difference!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} why is there a black market for test items?
                  ${allEmojis.currency_shopkeeper_bunny} i just don't get the deal with them
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} hello, chat!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} what's up?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} why did the chicken cross the road?
                  ${allEmojis.currency_shopkeeper_bunny} ..why are you telling me this?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} don't tell anyone but i stole something from one of the mods
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} why am i saying stuff?
                  ${allEmojis.currency_shopkeeper_bunny} well, it's a reference to a particular game~
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} dm me a fox pic and i'll give you a few coins
                  ${allEmojis.currency_shopkeeper_bunny} trust
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i sell your items here does it look like i'm your personal maid
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} without me, this place would be in total ruin
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} don't step on the protogen oomba on your way out
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} am i....meant to be welcoming?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} you'll be surprised at how many furries there are in this server,
                  ${allEmojis.currency_shopkeeper_bunny} ..don't ask why i know that
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} hai!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} hewwo!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} meowdy!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} hi! hello! howdy!
                  ${allEmojis.currency_shopkeeper_bunny} what can i do ya for today?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} one time, someone replaced my bread with a piece of explosive bread
                  ${allEmojis.currency_shopkeeper_bunny} my jaw hurt afterwards
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} big explosive?
                  ${allEmojis.currency_shopkeeper_bunny} what is this? flooded area?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} this is the wrong shop to buy perks buddy
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i don't accept robux here sorry
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} did you know that you get 🪙 \`2\` coins per message during the weekend?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} no, you may not hold my tail thanks
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i'm just as thrilled to be here as much as you are
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} NO refunds!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} if you see halo around during the daytime, tell her she's cute
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} did you hear about the drama the other day?
                  ${allEmojis.currency_shopkeeper_bunny} yeah, apparently someone pinged everyone!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} take good care of yourself
                  ${allEmojis.currency_shopkeeper_bunny} please
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} explosive shocks are not a valid payment method
                  ${allEmojis.currency_shopkeeper_bunny} how did you get your hands on that anyway?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} come on in!
                  ${allEmojis.currency_shopkeeper_bunny} i have...."things" for you~
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} who buys these stuff?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} the special items here never rotate,
                  ${allEmojis.currency_shopkeeper_bunny} that means you can buy them at any time you like!
                  ${allEmojis.currency_shopkeeper_bunny} who knows, maybe an exclusive item will appear there~
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i don't trust the stalk market here
                  ${allEmojis.currency_shopkeeper_bunny} it's too much of a "get rich quick" simulator to me
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} oh, it's you again!
                  ${allEmojis.currency_shopkeeper_bunny} have a look, will ya?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} welcome!
                  ${allEmojis.currency_shopkeeper_bunny} take a look, no rush, no rush
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} try ${hyperlink(`Tide Rush 2 🌊`, `https://www.roblox.com/games/8936217743/Tide-Rush-2`)} whilst you're here!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} offer halo something and she'll literally do your job for you
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} what's the weather like down there?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i've got dirt on one of the developers
                  ${allEmojis.currency_shopkeeper_bunny} wanna hear about it? that'll be 4 coins please
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} items, items, items..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} is this what shop work is like..
                  ${allEmojis.currency_shopkeeper_bunny} ..every day?!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} a shop for a discord server?
                  ${allEmojis.currency_shopkeeper_bunny} no, that's ridiculous..
                  ${allEmojis.currency_shopkeeper_bunny} why would i spend so long on something like that?!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} there's so much talk about "gardening" when you retire
                  ${allEmojis.currency_shopkeeper_bunny} kit, just do what you love best~
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} who decided to build on these lands?
                  ${allEmojis.currency_shopkeeper_bunny} surely they recognise the area will in fact flood!!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} you sure look tired after surviving rounds of areas flooding
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} buy one, get none free!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} niko once told me pancakes is a command
                  ${allEmojis.currency_shopkeeper_bunny} it's....not a slash command, what did they mean by that?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} do you think peri knows how to make toast?
                  ${allEmojis.currency_shopkeeper_bunny} i'm hungy xwx
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i think ruby's stolen one of my items again
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} someone tell oxy to stop abusing the stalk market
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} it's scotty, not scottie
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} krakowski is such a cool name
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} erm, what the tuna?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} raphael ate ALL my balls and now i'm sad
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i should talk to blizzard more >w>
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} where's puppy dogruk 22 when you need him?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} #hugo2023
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} ..waiting for the day welololol visits my shop~
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} arla's tacos are probably the most sought after item since she doesn't restock like ever
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i'm on the fence whether to call him "yourstruly" or "MWMWMWMWMWMWMWMWMWMW"
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} MIMI!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} d'ya know when was the last time melody showed up here?
                  ${allEmojis.currency_shopkeeper_bunny} ..oh, that was more of a rhetorical question
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} my basement's exit is covered with le tape and lucrs is finding it hard to escape
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} okko precious
                  ${allEmojis.currency_shopkeeper_bunny} no touchies
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} me on my gay little paws
                  ${allEmojis.currency_shopkeeper_bunny} with my big gay ears
                  ${allEmojis.currency_shopkeeper_bunny} being gay
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} welcome to my shop!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} rawr ,':3
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} halo is a cutie~
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} halo takes over during the daytime while i fall into slumber
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} at least halo doesn't has a broken sleeping schedule..
                  ${allEmojis.currency_shopkeeper_bunny} ..unlike me..
               `
            ]);
         },
         viewing: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} ooh, that looks nice!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} no way
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i want that too
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} excellent choice!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i NEED that
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} hot off the stove!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} going once, going twice..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} get it before it's gone!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} what a beaut!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} oh, you want that?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} what do you think?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} it looks artificial
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} are you sure that's real?
                  ${allEmojis.currency_shopkeeper_bunny} it doesn't look like it is
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} found something?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} something's caught your eye?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} made lovingly by paw!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} hmm?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i didn't know i was selling that
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} where did that come from?!
               `
            ]);
         },
         purchase: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} thanks for supporting!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} thanks for buying!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} you come back now!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} thank you for your purchase!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} thank you kindly for your purchase!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} thanks much!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} awh, thanks a bunch!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} come back again!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} enjoy!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} here's your item!
                  ${allEmojis.currency_shopkeeper_bunny} you take care now~
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} i appreciate it~
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} hope it's useful!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} thanks!
                  ${allEmojis.currency_shopkeeper_bunny} ..now, what're ya gun do with that?
               `
            ]);
         }
      },

      haloBunny: {
         colour: 10 <= dayjs.utc().hour() && dayjs.utc().hour() < 22
            ? 0x9000ff  // halo's colour  : 10:00 - 21:59 : 0x9000ff
            : 0xffc832, // bunny's colour : 22:00 - 09:59 : 0xffc832
         welcome: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} call halo cute
                  ${allEmojis.currency_shopkeeper_bunny} NOW!
                  ${allEmojis.currency_shopkeeper_halo} NO
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} hey you should call bunny cute now!
                  ${allEmojis.currency_shopkeeper_bunny} nuh uh
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} ....
                  ${allEmojis.currency_shopkeeper_bunny} hold on i need to sort halo out rq
                  ${allEmojis.currency_shopkeeper_halo} waa
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} hi chat
                  ${allEmojis.currency_shopkeeper_halo} hi ruby
                  ${allEmojis.currency_shopkeeper_bunny} GET OUT OF MY SHOP
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} \\*distant crash\\*
                  ${allEmojis.currency_shopkeeper_bunny} ..ignore that, she's found the keys to the back
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} wake up cutie it's ${time(dayjs().unix(), TimestampStyles.ShortTime)}, time for your daily software update
                  ${allEmojis.currency_shopkeeper_halo} yes cutie
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} trees are real
                  ${allEmojis.currency_shopkeeper_bunny} huh
                  ${allEmojis.currency_shopkeeper_halo} how
                  ${allEmojis.currency_shopkeeper_bunny} 🐱❓
                  ${allEmojis.currency_shopkeeper_halo} i will cherish this moment forever
                  ${allEmojis.currency_shopkeeper_bunny} QHAR?!?!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} welcome~
                  ${allEmojis.currency_shopkeeper_halo} hey!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} we must cook.
                  ${allEmojis.currency_shopkeeper_halo} cutie are you alright
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} \\*boops\\*
                  ${allEmojis.currency_shopkeeper_halo} missed me!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} ..
                  ${allEmojis.currency_shopkeeper_bunny} ..we'll be with you in a sec!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} ..so eepy..
                  ${allEmojis.currency_shopkeeper_bunny} ..and cute..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} chicken sandwich
                  ${allEmojis.currency_shopkeeper_bunny} true
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} the fucking seagulls are back to squawk and haunt me
                  ${allEmojis.currency_shopkeeper_halo} run
                  ${allEmojis.currency_shopkeeper_bunny} run where
                  ${allEmojis.currency_shopkeeper_halo} uh uh uh uh uh idk uh air
                  ${allEmojis.currency_shopkeeper_bunny} i'm afraid the seagulls have air too
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} zzz
                  ${allEmojis.currency_shopkeeper_bunny} wake up
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} i have one purpose in life and--
                  ${allEmojis.currency_shopkeeper_bunny} *AHEM*
                  ${allEmojis.currency_shopkeeper_bunny} ..uhm, anyway, hi visitor!!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} is it just toasters that die when called cute or..
                  ${allEmojis.currency_shopkeeper_bunny} ${allEmojis.boop}
                  ${allEmojis.currency_shopkeeper_halo} ..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} welcome to the void!
                  ${allEmojis.currency_shopkeeper_bunny} hai hai!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} i'm a sneaky proto
                  ${allEmojis.currency_shopkeeper_halo} i sneaked in your house
                  ${allEmojis.currency_shopkeeper_halo} sat on your couch
                  ${allEmojis.currency_shopkeeper_halo} ate your usbs
                  ${allEmojis.currency_shopkeeper_halo} went thru your search history
                  ${allEmojis.currency_shopkeeper_bunny} WAIT NOO GET OFF MY LAPTOP
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} oh i love gex!
                  ${allEmojis.currency_shopkeeper_bunny} ${allEmojis.woah}
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} did i tell you about the time i fell down the stairs?
                  ${allEmojis.currency_shopkeeper_halo} again?
               `
            ]);
         },
         viewing: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} buy this and i call her cute
                  ${allEmojis.currency_shopkeeper_halo} do not buy this item
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} but i like this item..
                  ${allEmojis.currency_shopkeeper_bunny} name your price.
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} hey if you buy this item i'll boop the cutie a lot
                  ${allEmojis.currency_shopkeeper_bunny} do NOT buy this item i beg thee
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} i mean at least it's not an off-brand
                  ${allEmojis.currency_shopkeeper_bunny} what's wrong with them? i love them
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} this item scares me
                  ${allEmojis.currency_shopkeeper_bunny} it'll be fine
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} you must be nuts to buy this
                  ${allEmojis.currency_shopkeeper_bunny} uhm..
               `
            ]);
         },
         purchase: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} please don't give this item to ruby
                  ${allEmojis.currency_shopkeeper_halo} cutie it'll be fine trust
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} ..uhm, where did we get this item from again?
                  ${allEmojis.currency_shopkeeper_halo} shrug
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} WE MADE BANK !!
                  ${allEmojis.currency_shopkeeper_halo} W
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} i think its about to rain..
                  ${allEmojis.currency_shopkeeper_bunny} oh? uh, you'll be fine....right?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} thank you !!
                  ${allEmojis.currency_shopkeeper_halo} ..cutie....
                  ${allEmojis.currency_shopkeeper_bunny} ..now, if you'll excuse me..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_halo} brain....no..work..
                  ${allEmojis.currency_shopkeeper_bunny} hush hush, the hard work is over now..
                  ${allEmojis.currency_shopkeeper_bunny} be eepy..
               `
            ]);
         }
      }
   },

   get "special-items"() {
      return this[`shop-items`];
   },

   "flea-market": {
      ruby: {
         colour: 0xf371d4,
         welcome: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} sentimental value included!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} what's good here is that you don't pay tax on these items
                  ${allEmojis.currency_shopkeeper_ruby} bunny's shop, however, does!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} boop haiii
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} i may be retired but i still enjoy this place 
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} if you find any issues here just call bunny
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} i msobing
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} r
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} i forgot
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} did you know that you can get free flood coins by...
                  ${allEmojis.currency_shopkeeper_ruby} click to read more
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} that oomba's name is "rowan"
                  ${allEmojis.currency_shopkeeper_ruby} "oomba" is just the name of rowan himself
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} ..what's a "roomba"?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} boom! i'm here!
                  ${allEmojis.currency_shopkeeper_ruby} you can't get rid of me!!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} flooded area fell off
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} buy buy buy buy buy buy buy buy buy buy buy buy buy 
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} 90% of the gamblers quit before they win big
                  ${allEmojis.currency_shopkeeper_ruby} so what are you waiting for? buy some carrots at the stalk market! (after you waste your coins here of course)
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} hi chat
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} i wonder when the flooded area devs will actually listen to my suggestions..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} how long has it been since my demotion
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_bunny} <this response has been filtered by bunny>
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} guh
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} I HATE FLOODED A! I HATE FLOODED A! I HATE FLOODED A! I HATE FLOODED A! I HATE FLOODED A! I HATE FLOODED A! I HATE FLOODED A! I HATE FLOODED A!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} if seller = rapidrub then buy
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} silly !
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} zzzzzzz
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} these deals are good buy them while you can
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} press ctrl+r now
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} i'm doing this for free man i don't even earn money from this i msobing
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} i love fle markwt
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} \u200b🌘 〰️ 🌒
               ` // \u200b to make the emojis not big
            ]);
         },
         viewing: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} i remember seeing this in bunny's shop!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} please take this item it's right there
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} do NOT steal !!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} click the buy button
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} buy it
                  ${allEmojis.currency_shopkeeper_ruby} i dare you
                  ${allEmojis.currency_shopkeeper_ruby} do it
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} what are you looking at?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} is that yet another test item or something
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} this is a good deal buy it NOW!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} buy
               `
            ]);
         },
         purchase: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} treat that item well!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} thanks - i'll send these coins to them now!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} give it a nice new home!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} :3
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} waaaaa thank chuu
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} pawesome!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} good business!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} \\:happ\\:
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} that's swag!!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} come back again!
                  ${allEmojis.currency_shopkeeper_ruby} pleaseeeee
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_ruby} ty ty ty!!
               `
            ]);
         }
      }
   },

   "stalk-market": {
      deerie: {
         colour: 0x796853,
         welcome: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} market crashers: discord style!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} i have no idea what bunny is saying but you can totally trust me
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} let's hope the economy doesn't crash now..
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} you don't get taxed for being a stalkbroker, unlike buying things from bunny's shop
                  ${allEmojis.currency_shopkeeper_deerie} they'll tax your coins and take them for themselves! how selfish
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} remember to sell your carrots by next week!
                  ${allEmojis.currency_shopkeeper_deerie} ..why? they'll rot!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} sell these at the right price!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} these premium carrots are only sold in bunches of 1, kitto
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} carrying on a legacy!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} turning over a new leaf!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} looking over the new horizons!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} instead of walking around the server carrying a bag full of carrots you can come here instead
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} buying from me?
                  ${allEmojis.currency_shopkeeper_deerie} well, i sell carrots in bunches of 1~
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} welcome to the carrot farm!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} selling or buying?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} checking on our prices?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} lovely day out here, huh?
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} it's carrot season!
                  ${allEmojis.currency_shopkeeper_deerie} today, tomorrow, and every day!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} carrots are a *safe* investment!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} i cannot be held accountable for how the market will act
               `
            ]);
         },
         buy: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} have a good one!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} enjoy those stalks!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} take good care of those carrots!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} remember: the carrots will become rotten next sunday!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} good luck out there kitto!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} hopefully the stalk market treats you well!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} ..try not to eat these beautiful carrots!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} thanks for supporting local businesses!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} see you in the coming days!
               `
            ]);
         },
         sell: allEmojis => {
            return choice([
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} thank you for the carrots!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} ..don't ask why i'm buying these carrots *back* after selling them to you
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} now pray that was the right choice!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} thanks for these scrumptious carrots!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} here's your payment!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} have a good day!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} was nice bargaining with you!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} see you next sunday!
               `,
               strip`
                  ${allEmojis.currency_shopkeeper_deerie} safe choice!
                  ${allEmojis.currency_shopkeeper_deerie} i applaud all my sellers~
               `
            ]);
         }
      }
   }
};