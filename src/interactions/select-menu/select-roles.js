/**
 * TODO
 * this file has not yet been refactored~
 */


import { FloodedAreaCommunity as FloodedAreaCommunityRoles } from "../../data/roles.js";

import { partition } from "@magicalbunny31/pawesome-utility-stuffs";


/**
 * @param {import("@flooded-area-bot-types/client").StringSelectMenuInteraction} interaction
 */
export default async interaction => {
   // select menu info
   const [ _selectMenu, type ] = interaction.customId.split(`:`);
   const rolesStrings = interaction.values;


   // defer the interaction's update
   await interaction.deferUpdate();


   // this member's roles and whether they're set or not
   const setRoles = {
      "mention-roles": [
         [ `looking-for-group`,   rolesStrings.includes(`looking-for-group`)         ],
         [ `events`,              rolesStrings.includes(`events`)                    ],
         [ `polls`,               rolesStrings.includes(`polls`)                     ],
         [ `updates-sneak-peeks`, rolesStrings.includes(`updates-sneak-peeks`)       ],
         [ `giveaways`,           rolesStrings.includes(`giveaways`)                 ],
         [ `challenges`,          rolesStrings.includes(`challenges`)                ],
         [ `playtest`,            rolesStrings.includes(`playtest`)                  ],
         [ `archived-access`,     rolesStrings.includes(`archived-access`)           ],
         [ `qotd`,                rolesStrings.includes(`qotd`)                      ]
      ],

      "pronoun-roles": [
         [ `he-him`,           rolesStrings.includes(`he-him`)           ],
         [ `she-her`,          rolesStrings.includes(`she-her`)          ],
         [ `they-them`,        rolesStrings.includes(`they-them`)        ],
         [ `other-pronouns`,   rolesStrings.includes(`other-pronouns`)   ],
         [ `any-pronouns`,     rolesStrings.includes(`any-pronouns`)     ],
         [ `ask-for-pronouns`, rolesStrings.includes(`ask-for-pronouns`) ]
      ]
   }[type];


   // get role ids to set for this member
   const roles = {
      "mention-roles": {
         "looking-for-group":   `1002622412258545684`,
         "events":              FloodedAreaCommunityRoles.Events,
         "polls":               FloodedAreaCommunityRoles.Opinions,
         "updates-sneak-peeks": FloodedAreaCommunityRoles.UpdatesSneakPeeks,
         "giveaways":           FloodedAreaCommunityRoles.Giveaways,
         "challenges":          FloodedAreaCommunityRoles.Challenges,
         "playtest":            FloodedAreaCommunityRoles.Playtest,
         "archived-access":     FloodedAreaCommunityRoles.ArchivedAccess,
         "qotd":                FloodedAreaCommunityRoles.QoTD
      },

      "pronoun-roles": {
         "he-him":           FloodedAreaCommunityRoles.HeHim,
         "she-her":          FloodedAreaCommunityRoles.SheHer,
         "they-them":        FloodedAreaCommunityRoles.TheyThem,
         "other-pronouns":   FloodedAreaCommunityRoles.OtherPronouns,
         "any-pronouns":     FloodedAreaCommunityRoles.AnyPronouns,
         "ask-for-pronouns": FloodedAreaCommunityRoles.AskForPronouns
      }
   }[type];


   // give the member these roles
   const [ rolesToAdd, rolesToRemove ] = partition(setRoles, value => value[1]);

   await interaction.member.roles.add(
      rolesToAdd.map(roleId => roles[roleId[0]])
   );

   await interaction.member.roles.remove(
      rolesToRemove.map(roleId => roles[roleId[0]])
   );
};