pipeline {
   agent {
      node {
         label "fox-1 apps"
         customWorkspace "/home/apps/flooded-area-bot"
      }
   }

   stages {
      stage("build") {
         steps {
            echo "✨ building.."
            sh "npm install --production"
         }
      }
      stage("start") {
         steps {
            echo "✨ starting.."
            dir("src") {
               withCredentials([ file(credentialsId: "DOTENVX_ENV_KEYS_FOX_KIT", variable: "DOTENVX_ENV_KEYS") ]) {
                  writeFile file: ".env.keys", text: readFile(DOTENVX_ENV_KEYS), encoding: "UTF-8"
               }
            }
            sh "npm start"
         }
      }
   }

   post {
      cleanup {
         echo "✨ cleaning up.."
         dir("${workspace}@tmp") {
            deleteDir()
         }
      }
   }
}