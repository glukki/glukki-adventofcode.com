import { getStdin } from "./getStdin.ts";

const input = await getStdin();

const lookup = {
  A: { // Rock
    X: 0 + 3, // Lose
    Y: 3 + 1, // Draw
    Z: 6 + 2, // Win
  },
  B: { // Paper
    X: 0 + 1, // Lose
    Y: 3 + 2, // Draw
    Z: 6 + 3, // Win
  },
  C: { // Scissors
    X: 0 + 2, // Lose
    Y: 3 + 3, // Draw
    Z: 6 + 1, // Win
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
