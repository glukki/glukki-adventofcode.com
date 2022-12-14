import { getStdin } from "./getStdin.ts";

const input = await getStdin();

class CountingSet {
  protected map: Map<string, number>;
  constructor() {
    this.map = new Map();
  }

  inc(key: string): CountingSet {
    this.map.set(key, (this.map.get(key) ?? 0) + 1);
    return this;
  }

  dec(key: string): CountingSet {
    const nextValue = (this.map.get(key) ?? 0) - 1;
    if (nextValue === -1) {
      throw new Error("Can't decrement missing key");
    }

    if (nextValue === 0) {
      this.map.delete(key);
    } else {
      this.map.set(key, nextValue);
    }

    return this;
  }

  get size(): number {
    return this.map.size;
  }
}

const window = new CountingSet();
let result = NaN;

for (let i = 0; i < input.length; i++) {
  if (i > 3) {
    window.dec(input[i - 4]);
  }
  window.inc(input[i]);
  if (window.size === 4) {
    result = i + 1;
    break;
  }
}

console.log(result);
