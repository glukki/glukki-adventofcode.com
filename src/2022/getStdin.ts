export const getStdin = async (): Promise<string> => {
  const decoder = new TextDecoder();

  let input = "";
  for await (const chunk of Deno.stdin.readable) {
    input += decoder.decode(chunk);
  }

  return input;
};
