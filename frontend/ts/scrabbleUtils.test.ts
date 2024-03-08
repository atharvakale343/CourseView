import {
  canConstructWord,
  letterHistogram,
  baseScore,
  possibleWords,
  bestPossibleWords,
} from "./scrabbleUtils";

describe("letterHistogram", () => {
  it("should return the correct histogram for a given word", () => {
    // Add your test cases here
    expect(letterHistogram("hello")).toEqual({ h: 1, e: 1, l: 2, o: 1 });
  });
});

describe("canConstructWord", () => {
  it("should return true if the word can be constructed 1", () => {
    // Add your test cases here
    expect(canConstructWord({ h: 1, e: 1, l: 2, o: 1 }, "hello")).toBe(true);
    expect(canConstructWord({ "*": 1, c: 2, t: 1 }, "cat")).toBe(true);
  });

  it("should return false if the word cannot be constructed", () => {
    // Add your test cases here
    expect(canConstructWord({ h: 1, e: 1, l: 2, o: 1 }, "world")).toBe(false);
    expect(canConstructWord({ h: 1, e: 1, l: 1, o: 1 }, "hello")).toBe(false);
  });
});

describe("baseScore", () => {
  it("should return the correct base score for a given word", () => {
    // Add your test cases here
    expect(baseScore("hello")).toBe(8);
    expect(baseScore("world")).toBe(9);
    expect(baseScore("cat")).toBe(5);
    expect(baseScore("c*t")).toBe(4);
  });
});

describe("possibleWords", () => {
  it("should return the correct list of possible words for a given set of tiles", () => {
    // Add your test cases here
    expect(possibleWords({ a: 2, b: 1 })).toEqual(
      ["aa", "ab", "ba", "aba", "baa"].sort()
    );
    expect(possibleWords({ "*": 2 })).toEqual([
      "aa",
      "ab",
      "ad",
      "ae",
      "ag",
      "ah",
      "ai",
      "al",
      "am",
      "an",
      "ar",
      "as",
      "at",
      "aw",
      "ax",
      "ay",
      "ba",
      "be",
      "bi",
      "bo",
      "by",
      "de",
      "do",
      "ed",
      "ef",
      "eh",
      "el",
      "em",
      "en",
      "er",
      "es",
      "et",
      "ex",
      "fa",
      "go",
      "ha",
      "he",
      "hi",
      "hm",
      "ho",
      "id",
      "if",
      "in",
      "is",
      "it",
      "jo",
      "ka",
      "la",
      "li",
      "lo",
      "ma",
      "me",
      "mi",
      "mm",
      "mo",
      "mu",
      "my",
      "na",
      "ne",
      "no",
      "nu",
      "od",
      "oe",
      "of",
      "oh",
      "om",
      "on",
      "op",
      "or",
      "os",
      "ow",
      "ox",
      "oy",
      "pa",
      "pe",
      "pi",
      "re",
      "sh",
      "si",
      "so",
      "ta",
      "ti",
      "to",
      "uh",
      "um",
      "un",
      "up",
      "us",
      "ut",
      "we",
      "wo",
      "xi",
      "xu",
      "ya",
      "ye",
      "yo",
    ]);
  });
});

describe("bestPossibleWords", () => {
  it("should return the correct list of best possible words for a given set of tiles", () => {
    // Add your test cases here
    expect(bestPossibleWords(letterHistogram("squeeze"))).toEqual(["squeeze"]);
  });
});
