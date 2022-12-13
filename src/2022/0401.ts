import { getStdin } from "./getStdin.ts";

const input = await getStdin();

const result = input.split("\n")
  .map((line) => {
    return line.split(",").map((range) => {
      return range.split("-").map((id) => Number(id));
    });
  })
  .map(([rangeA, rangeB]) => {
    return (rangeA[0] <= rangeB[0] && rangeA[1] >= rangeB[1]) ||
      (rangeB[0] <= rangeA[0] && rangeB[1] >= rangeA[1]);
  })
  .reduce((memo, overlap) => (memo + (overlap ? 1 : 0)), 0);

console.log(result);
