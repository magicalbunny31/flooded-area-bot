/**
 * ✨ npm stop
 */


// pm2
import { promisify } from "node:util";
import pm2 from "pm2";

const connect = promisify(pm2.connect).bind(pm2);
await connect();


// stop the process
const stop = promisify(pm2.stop).bind(pm2);

try {
   await stop(`flooded-area-bot`);

} catch (error) {
   throw error;

} finally {
   const disconnect = promisify(pm2.disconnect).bind(pm2);
   await disconnect();
};