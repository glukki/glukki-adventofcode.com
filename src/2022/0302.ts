import { getStdin } from "./getStdin.ts";

const input = await getStdin();

const typeLookup = new Map();
for (let i = 97; i < 123; i++) { // a=97, z=122
  typeLookup.set(String.fromCharCode(i), i - 96);
}
for (let i = 65; i < 91; i++) { // A=65, Z=90
  typeLookup.set(String.fromCharCode(i), i - 38);
}

const result = input.split("\n")
  .reduce((memo, line, idx) => { // groups of 3 lines
    if (idx % 3 === 0) {
      memo.push([]);
    }
    memo[memo.length - 1].push(line);
    return memo;
  }, [] as unknown as string[][])
  .map((lines) => {
    const shared = new Set(lines[0]);

    for (let i = 1; i < lines.length; i++) {
      const backpack = new Set(lines[i]);
      for (const item of shared.values()) {
        if (!backpack.has(item)) {
          shared.delete(item);
        }
      }
    }

    if (shared.size > 1) {
      throw new Error("Too big shared" + JSON.stringify(lines));
    }

    return shared.values().next().value;
  })
  .map((item) => typeLookup.get(item))
  .reduce((memo, value) => memo + value, 0);

console.log(result);
