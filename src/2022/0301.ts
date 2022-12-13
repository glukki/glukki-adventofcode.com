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
  .map((line) => {
    const lookup = new Set(line.slice(0, line.length / 2)); // left
    return line.slice(line.length / 2) // right
      .split("")
      .find((char) => lookup.has(char));
  })
  .map((char) => typeLookup.get(char))
  .reduce((memo, score) => memo + score, 0);

console.log(result);
