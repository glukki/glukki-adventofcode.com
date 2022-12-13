import { getStdin } from "./getStdin.ts";

const input = await getStdin();

const lookup = {
  A: { // Rock
    X: 1 + 3, // Rock
    Y: 2 + 6, // Paper
    Z: 3 + 0, // Scissors
  },
  B: { // Paper
    X: 1 + 0, // Rock
    Y: 2 + 3, // Paper
    Z: 3 + 6, // Scissors
  },
  C: { // Scissors
    X: 1 + 6, // Rock
    Y: 2 + 0, // Paper
    Z: 3 + 3, // Scissors
  },
};

const result = input.split("\n")
  .map((line) => {
    const [opponent, , you] = line;
    const score = lookup[opponent as "A" | "B" | "C"][you as "X" | "Y" | "Z"];

    if (typeof score !== "number") {
      throw new Error("Unknown character:" + line);
    }

    return score;
  })
  .reduce((memo, score) => memo + score, 0);

console.log(result);
