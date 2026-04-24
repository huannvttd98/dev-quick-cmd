import { readFile } from "node:fs/promises";
import { zip } from "zip-a-folder";

const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const outName = `cli-toolbox-v${pkg.version}.zip`;

await zip("dist", outName);
console.log(`✓ Packed ${outName}`);
