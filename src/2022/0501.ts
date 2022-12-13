const decoder = new TextDecoder();

let input = "";
for await (const chunk of Deno.stdin.readable) {
  input += decoder.decode(chunk);
}

const inputSections = input.split("\n\n");

const stacks = inputSections[0].split("\n")
  .reverse()
  .reduce((memo, line, idx) => {
    for (let i = 0; (i * 4 + 1) < line.length; i++) {
      if (idx === 0) {
        memo.push([]);
        continue;
      }

      const cargo = line[1 + i * 4];
      if (cargo && cargo !== " ") {
        memo[i].push(cargo);
      }
    }

    return memo;
  }, [] as string[][]);

const instructions = inputSections[1].split("\n")
  .map((line) => {
    const [, count, , source, , destination] = line.split(" ");
    return {
      source: Number(source) - 1,
      destination: Number(destination) - 1,
      count: Number(count),
    };
  });

const result = instructions.reduce((memo, instruction) => {
  for (let i = 0; i < instruction.count; i++) {
    const cargo = memo[instruction.source].pop();
    if (!cargo) {
      throw new Error("Bad instruction");
    }
    memo[instruction.destination].push(cargo);
  }

  return memo;
}, stacks)
  .map((stack) => stack.slice(-1)[0] || " ")
  .join("");

console.log(result);
