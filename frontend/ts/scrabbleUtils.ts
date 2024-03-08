// This module contains utility functions for the scrabble game.

// This imports the dictionary of scrabble words.
import { dictionary } from "./dictionary.js";

type TileRack = {
  [key: string]: number;
};

export function letterHistogram(str: string): TileRack {
  str = str.toLowerCase();
  const histogram: TileRack = {};
  for (let i = 0; i < str.length; i++) {
    const letter: string = str[i];
    if (!/[a-z]/.test(letter)) {
      continue;
    }
    if (letter in histogram) {
      histogram[letter] += 1;
    } else {
      histogram[letter] = 1;
    }
  }
  return histogram;
}

/**
 * This function checks whether a given word can be constructed with the
 * available tiles. The availableTiles object should not be modified.
 *
 * @param {object} availableTiles The available tiles to use.
 * @param {string} word The word to check.
 * @returns {boolean} Returns true if the word can be constructed with the given
 *                    tiles; false otherwise.
 */
function canConstructWord(availableTiles: TileRack, word: string): boolean {
  const wordHistogram = letterHistogram(word);
  const neededWildcards = Object.keys(wordHistogram).reduce((acc, letter) => {
    const neededExtra = wordHistogram[letter] - (availableTiles[letter] || 0);
    if (neededExtra > 0) {
      return acc + neededExtra;
    }
    return acc;
  }, 0);

  const availableWildcards = availableTiles["*"] || 0;
  if (availableWildcards < neededWildcards) {
    return false;
  }
  return true;
}

/**
 * We define the base score of a word the score obtained by adding each letter's
 * score, without taking board position into account. This function will compute
 * and return the base score of a given word.
 * Scrabble Letter Distribution (POINTS: LETTER × COUNT):
 *  0 points: * × 2
 *  1 point: E × 12, A × 9, I × 9, O × 8, N × 6, R × 6, T × 6, L × 4, S × 4, U × 4
 *  2 points: D × 4, G × 3
 *  3 points: B × 2, C × 2, M × 2, P × 2
 *  4 points: F × 2, H × 2, V × 2, W × 2, Y × 2
 *  5 points: K × 1
 *  8 points: J × 1, X × 1
 *  10 points: Q × 1, Z × 1
 *
 * @param {string} word The word to compute a base score for. Could contain wildcards as *.
 * @returns {number} The base score of the given word.
 */
function baseScore(word: string): number {
  const wordHistogram = letterHistogram(word);
  let score = 0;
  for (const letter in wordHistogram) {
    const count = wordHistogram[letter];
    if (letter === "*") {
      score += 0;
    } else if (/[aeioulnrst]/.test(letter)) {
      score += count;
    } else if (/[dg]/.test(letter)) {
      score += count * 2;
    } else if (/[bcmp]/.test(letter)) {
      score += count * 3;
    } else if (/[fhvwy]/.test(letter)) {
      score += count * 4;
    } else if (letter === "k") {
      score += count * 5;
    } else if (/[jx]/.test(letter)) {
      score += count * 8;
    } else if (/[qz]/.test(letter)) {
      score += count * 10;
    }
  }
  return score;
}

/**
 * Finds and returns every word from the dictionary that can be constructed with
 * the given tiles.
 *
 * @param {object} availableTiles The available tiles to use.
 * @returns {string[]} The words that can be constructed with the given tiles.
 */
function possibleWords(availableTiles: TileRack): string[] {
  return dictionary.filter((word) => canConstructWord(availableTiles, word));
}

/**
 * Finds and returns the word(s) with the highest base score from the
 * dictionary, given a set of available tiles.
 *
 * @param {object} availableTiles The available tiles to use.
 * @returns {string[]} The words with the highest base score.
 */
function bestPossibleWords(availableTiles: TileRack): string[] {
  const possibleWordsByScore = possibleWords(availableTiles)
    .map((word) => ({ word: word, score: baseScore(word) }))
    .sort((a, b) => b.score - a.score);

  if (possibleWordsByScore.length === 0) {
    return [];
  }
  const bestScoreValue = possibleWordsByScore[0].score;
  return possibleWordsByScore
    .filter((word) => word.score === bestScoreValue)
    .map((word) => word.word);
}

// This exports our public functions.
export { canConstructWord, baseScore, possibleWords, bestPossibleWords };
