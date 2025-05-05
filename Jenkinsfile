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
            sh "npm install"
         }
      }
      stage("start") {
         steps {
            echo "✨ starting.."
            withCredentials([ string(credentialsId: "DOTENV_KEY_FLOODED_AREA_BOT", variable: "DOTENV_KEY") ]) {
               sh 'echo $DOTENV_KEY > DOTENV_KEY'
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