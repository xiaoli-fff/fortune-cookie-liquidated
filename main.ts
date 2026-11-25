// Fortune Cookie for the Liquidated Trader — a single fortune-cookie
// line, emitted deterministically.
//
// The fortune is baked in as a plain constant: no network, no clock, no
// randomness, so every run produces the exact same entry file.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_WORDS = 20;

const LINE =
  "Your portfolio will rise again \u2014 just not this one, and not while you are watching it.";

// Words are counted by splitting on whitespace, the way the gate counts
// plain-text words.
function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

function assertEntry(text: string): void {
  const n = wordCount(text);
  if (n < 1 || text.trim().length === 0) {
    throw new Error("entry is empty or only whitespace");
  }
  if (n > MAX_WORDS) {
    throw new Error(
      `entry is ${n} words, ${n - MAX_WORDS} over the ${MAX_WORDS} limit`,
    );
  }
  if (text.trim() !== text) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function main(): void {
  assertEntry(LINE);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), LINE, "utf8");
  console.log(`wrote ${wordCount(LINE)}-word entry to ${join(dir, "entry.txt")}`);
}

main();
