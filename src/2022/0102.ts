import { getStdin } from "./getStdin.ts";

const input = await getStdin();

const elves = input.split("\n\n").map((block) => {
  return block.split("\n")
    .reduce((memo, line) => (memo + Number(line)), 0);
});

const result = elves.sort()
  .reverse()
  .slice(0, 3)
  .reduce((memo, elf) => memo + elf, 0);

console.log(result);
