import Problem from '../models/Problem';

const classicProblems = [
  // 800 Rating
  { contestId: 4, index: 'A', name: 'Watermelon', rating: 800, tags: ['brute force', 'math'] },
  { contestId: 71, index: 'A', name: 'Way Too Long Words', rating: 800, tags: ['strings'] },
  { contestId: 231, index: 'A', name: 'Team', rating: 800, tags: ['brute force', 'greedy'] },
  { contestId: 158, index: 'A', name: 'Next Round', rating: 800, tags: ['implementation'] },
  { contestId: 282, index: 'A', name: 'Bit++', rating: 800, tags: ['implementation'] },
  { contestId: 112, index: 'A', name: 'Petya and Strings', rating: 800, tags: ['strings'] },
  { contestId: 263, index: 'A', name: 'Beautiful Matrix', rating: 800, tags: ['implementation'] },
  { contestId: 339, index: 'A', name: 'Helpful Maths', rating: 800, tags: ['greedy', 'strings'] },

  // 1000 Rating
  { contestId: 1, index: 'A', name: 'Theatre Square', rating: 1000, tags: ['math'] },
  { contestId: 58, index: 'A', name: 'Chat room', rating: 1000, tags: ['greedy', 'strings'] },
  { contestId: 69, index: 'A', name: 'Young Physicist', rating: 1000, tags: ['implementation', 'math'] },
  { contestId: 118, index: 'A', name: 'String Task', rating: 1000, tags: ['strings'] },
  { contestId: 122, index: 'A', name: 'Lucky Division', rating: 1000, tags: ['brute force', 'number theory'] },
  { contestId: 479, index: 'A', name: 'Expression', rating: 1000, tags: ['brute force', 'math'] },
  { contestId: 131, index: 'A', name: 'cAPS lOCK', rating: 1000, tags: ['implementation', 'strings'] },

  // 1200 Rating
  { contestId: 4, index: 'C', name: 'Registration System', rating: 1200, tags: ['hashing', 'data structures'] },
  { contestId: 489, index: 'B', name: 'BerSU Ball', rating: 1200, tags: ['greedy', 'sorting', 'two pointers'] },
  { contestId: 489, index: 'C', name: 'Given Length and Sum of Digits...', rating: 1200, tags: ['greedy'] },
  { contestId: 327, index: 'A', name: 'Flipping Game', rating: 1200, tags: ['dp', 'brute force'] },
  { contestId: 1352, index: 'C', name: 'K-th Beautiful String', rating: 1200, tags: ['binary search', 'math'] },
  { contestId: 466, index: 'A', name: 'Cheap Travel', rating: 1200, tags: ['implementation', 'math'] },
  { contestId: 344, index: 'B', name: 'Simple Molecules', rating: 1200, tags: ['greedy', 'math'] },

  // 1400 Rating
  { contestId: 479, index: 'C', name: 'Exams', rating: 1400, tags: ['greedy', 'sorting'] },
  { contestId: 489, index: 'D', name: 'Unbearable Lightness of Being', rating: 1400, tags: ['combinatorics', 'dfs', 'graphs'] },
  { contestId: 279, index: 'B', name: 'Books', rating: 1400, tags: ['binary search', 'two pointers'] },
  { contestId: 520, index: 'B', name: 'Two Buttons', rating: 1400, tags: ['graphs', 'bfs', 'greedy'] },
  { contestId: 1324, index: 'D', name: 'Pair of Topics', rating: 1400, tags: ['binary search', 'two pointers'] },
  { contestId: 1195, index: 'C', name: 'Basketball Exercise', rating: 1400, tags: ['dp'] },
  { contestId: 1363, index: 'B', name: 'Subsequence Hate', rating: 1400, tags: ['greedy', 'strings'] },

  // 1600 Rating
  { contestId: 1398, index: 'C', name: 'Good Subarrays', rating: 1600, tags: ['prefix sums', 'hashing'] },
  { contestId: 1526, index: 'C2', name: 'Potions (Hard Version)', rating: 1600, tags: ['greedy', 'data structures'] },
  { contestId: 455, index: 'A', name: 'Boredom', rating: 1600, tags: ['dp'] },
  { contestId: 189, index: 'A', name: 'Cut Ribbon', rating: 1600, tags: ['dp'] },
  { contestId: 1500, index: 'A', name: 'Same Differences', rating: 1600, tags: ['hashing', 'math'] },
  { contestId: 1399, index: 'D', name: 'Binary Subsequence Rotation', rating: 1600, tags: ['greedy', 'data structures'] },
  { contestId: 961, index: 'C', name: 'Chessboard', rating: 1600, tags: ['brute force', 'implementation'] },

  // 1800 Rating
  { contestId: 580, index: 'D', name: 'Kefa and Dishes', rating: 1800, tags: ['dp', 'bitmasks'] },
  { contestId: 343, index: 'B', name: 'Alternating Current', rating: 1800, tags: ['data structures', 'stack'] },
  { contestId: 474, index: 'D', name: 'Flowers', rating: 1800, tags: ['dp'] },
  { contestId: 1559, index: 'D1', name: 'Mocha and Diana (Easy Version)', rating: 1800, tags: ['dsu', 'graphs'] },
  { contestId: 1000, index: 'C', name: 'Covered Points Count', rating: 1800, tags: ['sorting', 'data structures'] },
  { contestId: 1463, index: 'B', name: 'Find The Array', rating: 1800, tags: ['greedy', 'math'] },

  // 2000 Rating
  { contestId: 547, index: 'B', name: 'Mike and Feet', rating: 2000, tags: ['dp', 'data structures'] },
  { contestId: 86, index: 'D', name: 'Powerful Array', rating: 2000, tags: ['data structures', 'math'] },
  { contestId: 13, index: 'E', name: 'Holes', rating: 2000, tags: ['data structures'] },
  { contestId: 228, index: 'D', name: 'Zigzag', rating: 2000, tags: ['data structures', 'segment trees'] },
  { contestId: 1619, index: 'H', name: 'Permutations Queries', rating: 2000, tags: ['data structures', 'math'] },
  { contestId: 1187, index: 'D', name: 'Subarray Sorting', rating: 2000, tags: ['data structures', 'segment trees'] }
];

export const seedProblems = async () => {
  try {
    const count = await Problem.countDocuments();
    if (count === 0) {
      console.log('Seeding classic Codeforces problems for practice ladder...');
      await Problem.insertMany(classicProblems);
      console.log(`Successfully seeded ${classicProblems.length} problems!`);
    } else {
      console.log('Problems collection already populated. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding problems:', (error as Error).message);
  }
};
