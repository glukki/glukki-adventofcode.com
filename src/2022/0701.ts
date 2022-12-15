import { getStdin } from "./getStdin.ts";

const input = await getStdin();

interface Node {
  size: number;
}

const sizeLimit = 100000;
let result = 0;

const stack: Node[] = [];

const cdOut = (): void => {
  const cwd = stack.pop();
  if (!cwd) {
    throw new Error("Stack is empty");
  }

  // when leaving directory, add it's size to the result
  if (cwd.size <= sizeLimit) {
    result += cwd.size;
  }

  // add current directory size to the parent
  const parent = stack[stack.length - 1];
  if (parent) {
    parent.size += cwd.size;
  }
};

input.split("\n")
  .forEach((line) => {
    const words = line.split(" ");

    if (words[0] === "$") {
      const command = words[1];
      const arg = words[2];

      if (command === "ls") {
        return;
      }

      if (command === "cd") {
        if (arg === "..") {
          return cdOut();
        }

        stack.push({ size: 0 });
        return;
      }

      throw new Error(`Unknown command: '${command}'`);
    }

    if (words[0] === "dir") {
      return;
    }

    // ls file line
    if (!stack.length) {
      throw new Error(`Empty stack, can't ad file`);
    }
    stack[stack.length - 1].size += Number(words[0]); // add file size to the current directory size
  });

// take into account directories remaining on the stack
while (stack.length) {
  cdOut();
}

console.log(result);
