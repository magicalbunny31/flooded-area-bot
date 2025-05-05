import fs from "node:fs/promises";


const dotenvKey = await (async () => {
   try {
      const file = await fs.readFile(`./DOTENV_KEY`);
      return file.toString();
   } catch (error) {
      return undefined;
   };
})();


export default dotenvKey;