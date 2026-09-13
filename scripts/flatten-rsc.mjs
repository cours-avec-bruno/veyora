// Static-export fix for plain file hosts (GitHub Pages).
// Next writes segment prefetch payloads as nested folders
//   out/guides/x/__next.guides/$d$slug/__PAGE__.txt
// but the client router requests the dotted file name
//   out/guides/x/__next.guides.$d$slug.__PAGE__.txt
// This copies each nested payload to its flattened name.
import { readdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("out");
let copied = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) await flatten(dir, full);
    else if (entry.name !== "_next") await walk(full);
  }
}

async function flatten(routeDir, segmentDir) {
  const stack = [segmentDir];
  while (stack.length) {
    const d = stack.pop();
    for (const e of await readdir(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) stack.push(f);
      else {
        const flat = path.relative(routeDir, f).split(path.sep).join(".");
        const target = path.join(routeDir, flat);
        try {
          await stat(target);
        } catch {
          await copyFile(f, target);
          copied++;
        }
      }
    }
  }
}

await walk(OUT);
console.log(`flatten-rsc: ${copied} prefetch payloads aliased`);
