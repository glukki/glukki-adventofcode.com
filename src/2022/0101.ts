import { getStdin } from "./getStdin.ts";

const input = await getStdin();

let max = 0;
let current = 0;
(input + "\n").split("\n").forEach((line) => {
  if (line) {
    current += Number(line);
    return;
  }

  max = Math.max(max, current);
  current = 0;
});

console.log(max);
