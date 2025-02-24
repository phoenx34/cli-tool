#! /usr/bin/env -S npx tsx

import { dirname } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));

(async () => {
  const oclif = await import(`@oclif/core`);
  await oclif.execute({ development: false, dir: dir});
})();