const decoder = new TextDecoder();

let input = "";
for await (const chunk of Deno.stdin.readable) {
  input += decoder.decode(chunk);
}

const result = input.split("\n")
  .map((line) => {
    return line.split(",").map((range) => {
      return range.split("-").map((id) => Number(id));
    });
  })
  .map(([rangeA, rangeB]) => {
    const [lower, higher] = rangeA[0] < rangeB[0]
      ? [rangeA, rangeB]
      : [rangeB, rangeA];

    return (lower[1] >= higher[0] && lower[1] <= higher[1]) ||
      (higher[0] >= lower[0] && higher[0] <= lower[1]);
  })
  .reduce((memo, overlap) => (memo + (overlap ? 1 : 0)), 0);

console.log(result);
