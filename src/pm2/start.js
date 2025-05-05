/**
 * ✨ npm start
 */


// pm2
import { promisify } from "node:util";
import pm2 from "pm2";

const connect = promisify(pm2.connect).bind(pm2);
await connect();


// start the process
const start = promisify(pm2.start).bind(pm2);

try {
   await start({
      name: `flooded-area-bot`,
      script: `./src/index.js`,
      args: [ `--color` ],
      output: `./logs/output.log`,
      error: `./logs/error.log`,
      log_date_format: `[[]HH:mm:ss] [[]DD-MMM-YYYY]`,
      detached: true,
      min_uptime: 2 * 60 * 1000,
      max_restarts: 3
   });

} catch (error) {
   throw error;

} finally {
   const disconnect = promisify(pm2.disconnect).bind(pm2);
   await disconnect();
};