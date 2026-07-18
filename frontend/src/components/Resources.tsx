import React, { useState } from 'react';
import { BookOpen, ExternalLink, PlayCircle, ChevronDown, ChevronUp, Layers, Star, Zap, Target, TrendingUp, Code, GitBranch, Hash, Sigma, Search } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Reading {
  name: string;
  url: string;
  source: 'CP-Algorithms' | 'USACO Guide' | 'Codeforces EDU' | 'Other';
  desc: string;
}

interface Playlist {
  name: string;
  url: string;
  channel: string;
  desc: string;
}

interface TopicData {
  id: string;
  name: string;
  icon: React.ReactNode;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  accentColor: string;
  summary: string;
  whatYouLearn: string[];
  readings: Reading[];
  playlists: Playlist[];
}

// ─── Topic Definitions ────────────────────────────────────────────────────────
const TOPICS: TopicData[] = [
  {
    id: 'dp',
    name: 'Dynamic Programming',
    icon: <Layers size={16} />,
    difficulty: 'Intermediate',
    accentColor: '#a855f7',
    summary:
      'Dynamic Programming (DP) breaks complex problems into overlapping subproblems, storing solutions to avoid redundant computation. It powers solutions for knapsack, LCS, LIS, interval DP, bitmask DP, and many more paradigms critical in competitive programming.',
    whatYouLearn: [
      'Memoization vs Tabulation',
      'State space design',
      'DP on Grids & Strings',
      'DP on Trees (rerooting)',
      'Bitmask DP',
      'Interval DP',
      'Digit DP',
    ],
    readings: [
      {
        name: 'CP-Algorithms DP Intro',
        url: 'https://cp-algorithms.com/dynamic_programming/intro-to-dp.html',
        source: 'CP-Algorithms',
        desc: 'Covers core DP intuition, state design, and tabulation vs memoization with C++ examples.',
      },
      {
        name: 'CP-Algorithms DP on Trees',
        url: 'https://cp-algorithms.com/dynamic_programming/dp-on-trees.html',
        source: 'CP-Algorithms',
        desc: 'Tree traversal DP, rerooting technique, finding diameters and subtree sizes.',
      },
      {
        name: 'USACO Guide – DP Gold',
        url: 'https://usaco.guide/gold/dp-bitmasks?lang=cpp',
        source: 'USACO Guide',
        desc: 'Gold-level bitmask DP with structured contest problems and editorial insights.',
      },
      {
        name: 'USACO Guide – Intro DP',
        url: 'https://usaco.guide/gold/intro-dp?lang=cpp',
        source: 'USACO Guide',
        desc: 'Classic knapsack, LIS, LCS modules with USACO-style practice problems.',
      },
      {
        name: 'Codeforces EDU – DP',
        url: 'https://codeforces.com/edu/courses',
        source: 'Codeforces EDU',
        desc: 'Interactive DP segments with step-graded contest problems directly on Codeforces.',
      },
    ],
    playlists: [
      {
        name: 'Kartik Arora – DP Series',
        url: 'https://www.youtube.com/watch?v=24hk2qW_BCU&list=PLb3g_Z8nEv1h1w6MI8vNMuL_wrI0FtqE7',
        channel: 'Kartik Arora',
        desc: 'In-depth Hindi DP series covering everything from basics to advanced contest-level DP problems.',
      },
      {
        name: 'Luv – CP Playlist (DP included)',
        url: 'https://www.youtube.com/watch?v=OMcxQ3IY-qc&list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-',
        channel: 'Luv',
        desc: 'Beginner-friendly Hinglish playlist covering fundamental DP patterns with clean implementations.',
      },
      {
        name: 'Algorithms with Shayan – DP',
        url: 'https://www.youtube.com/watch?v=oN_Cnzl5W9c&list=PLzDmwrrgE-UVnyEtA-_zuffIm3smCO2eA',
        channel: 'Algorithms with Shayan',
        desc: 'Structured problem-solving walkthroughs focusing on DP state formulation and transitions.',
      },
      {
        name: 'TLE Eliminators – DP Track',
        url: 'https://www.youtube.com/watch?v=nEEROBg1kbg&list=PLcXpkI9A-RZI-xF76L0sZq_u-k_yHz8pd',
        channel: 'TLE Eliminators',
        desc: 'Contest-oriented DP tutorial series designed for Codeforces Div 2/3 competitive programmers.',
      },
      {
        name: 'Vivek Gupta – DP Playlist',
        url: 'https://www.youtube.com/watch?v=syDV-PzET-M&list=PLqf9emQRQrnKA_EeveiXQj_uP25w8_5qL',
        channel: 'Vivek Gupta',
        desc: 'Detailed explanations of DP patterns, includes grid, knapsack, and digit DP.',
      },
    ],
  },
  {
    id: 'trees',
    name: 'Trees',
    icon: <GitBranch size={16} />,
    difficulty: 'Intermediate',
    accentColor: '#22c55e',
    summary:
      'Trees are hierarchical graphs used extensively in CP. Topics include LCA (Lowest Common Ancestor), tree DFS/BFS, diameter, centroid decomposition, heavy-light decomposition, and DP on trees. They appear in most Codeforces Div 2 C–E problems.',
    whatYouLearn: [
      'DFS Tree traversal',
      'LCA (Binary Lifting)',
      'Tree Diameter & Centers',
      'DP on Trees',
      'Euler Tour / Flattening',
      'Centroid Decomposition',
      'Heavy-Light Decomposition',
    ],
    readings: [
      {
        name: 'CP-Algorithms – Rooted Trees',
        url: 'https://cp-algorithms.com/graph/fixed_root.html',
        source: 'CP-Algorithms',
        desc: 'Fixed-root tree concepts including DFS ordering, subtree sizes, and in/out times.',
      },
      {
        name: 'CP-Algorithms – LCA (Binary Lifting)',
        url: 'https://cp-algorithms.com/graph/lca_binary_lifting.html',
        source: 'CP-Algorithms',
        desc: 'Efficient LCA algorithm using binary lifting with O(log N) per query.',
      },
      {
        name: 'CP-Algorithms – Centroid Decomposition',
        url: 'https://cp-algorithms.com/graph/centroid-decomposition.html',
        source: 'CP-Algorithms',
        desc: 'Divide-and-conquer on trees for path queries, a must-know advanced technique.',
      },
      {
        name: 'USACO Guide – Tree Queries (Platinum)',
        url: 'https://usaco.guide/platinum/tree-queries?lang=cpp',
        source: 'USACO Guide',
        desc: 'Advanced tree queries, HLD, and subtree operations for platinum-level problems.',
      },
      {
        name: 'USACO Guide – Intro to Trees (Silver)',
        url: 'https://usaco.guide/silver/tree-traversal?lang=cpp',
        source: 'USACO Guide',
        desc: 'Tree traversal basics with structured problems suitable for Silver/Gold level.',
      },
    ],
    playlists: [
      {
        name: 'Kartik Arora – DP on Trees',
        url: 'https://www.youtube.com/watch?v=fGznXJ-LTbI&list=PLb3g_Z8nEv1j_BC-fmZWHFe6jmU_zv-8s',
        channel: 'Kartik Arora',
        desc: 'Comprehensive Hindi series on tree DP including rerooting, LCA, diameter, and subtree counting.',
      },
      {
        name: 'Luv – Tree/Graph Series',
        url: 'https://www.youtube.com/watch?v=OMcxQ3IY-qc&list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-',
        channel: 'Luv',
        desc: 'Tree fundamentals in Hinglish — parent tracking, DFS tree, BFS level traversal.',
      },
    ],
  },
  {
    id: 'graphs',
    name: 'Graph Algorithms',
    icon: <Target size={16} />,
    difficulty: 'Intermediate',
    accentColor: '#3b82f6',
    summary:
      'Graphs model real-world relationships. In CP, graph algorithms cover BFS/DFS, shortest paths (Dijkstra, Bellman-Ford, Floyd-Warshall), MST (Kruskal, Prim), topological sort, SCC, bridges, and articulation points.',
    whatYouLearn: [
      'BFS & DFS traversals',
      'Dijkstra (weighted SSSP)',
      'Bellman-Ford & SPFA',
      'Floyd-Warshall (APSP)',
      'Kruskal & Prim MST',
      'Topological Sort',
      'Bridges & Articulation Points',
      'Strongly Connected Components',
    ],
    readings: [
      {
        name: 'CP-Algorithms – BFS',
        url: 'https://cp-algorithms.com/graph/breadth-first-search.html',
        source: 'CP-Algorithms',
        desc: 'BFS for shortest paths in unweighted graphs with grid traversal applications.',
      },
      {
        name: 'CP-Algorithms – Dijkstra',
        url: 'https://cp-algorithms.com/graph/dijkstra.html',
        source: 'CP-Algorithms',
        desc: 'Efficient single-source shortest path with priority queue, O((V+E) log V).',
      },
      {
        name: 'CP-Algorithms – Bridges & Cut Vertices',
        url: 'https://cp-algorithms.com/graph/bridge-searching.html',
        source: 'CP-Algorithms',
        desc: 'Tarjan algorithm for finding bridges and articulation points in undirected graphs.',
      },
      {
        name: 'USACO Guide – Graph Traversal (Silver)',
        url: 'https://usaco.guide/silver/graph-traversal?lang=cpp',
        source: 'USACO Guide',
        desc: 'DFS/BFS fundamentals with USACO-style silver problems and editorial solutions.',
      },
      {
        name: 'USACO Guide – Shortest Paths (Gold)',
        url: 'https://usaco.guide/gold/shortest-paths?lang=cpp',
        source: 'USACO Guide',
        desc: 'Dijkstra, Bellman-Ford, and BFS variations with modular practice problems.',
      },
    ],
    playlists: [
      {
        name: 'Luv – Graph Playlist',
        url: 'https://www.youtube.com/watch?v=OMcxQ3IY-qc&list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-',
        channel: 'Luv',
        desc: 'Excellent Hinglish series covering graph representation, BFS, DFS, Dijkstra, and more with C++.',
      },
    ],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    icon: <Search size={16} />,
    difficulty: 'Beginner',
    accentColor: '#06b6d4',
    summary:
      'Binary Search is one of the most powerful and frequently used techniques in CP. Beyond searching in arrays, it is used on monotonic functions, answer space, and combined with greedy/DP to solve complex problems efficiently.',
    whatYouLearn: [
      'Classic Binary Search',
      'Lower / Upper Bound (STL)',
      'Binary Search on Answer',
      'Binary Search on Monotone Functions',
      'Fractional Cascading',
      'Ternary Search',
    ],
    readings: [
      {
        name: 'CP-Algorithms – Binary Search',
        url: 'https://cp-algorithms.com/num_methods/binary_search.html',
        source: 'CP-Algorithms',
        desc: 'Complete guide on binary search, including predicate-based binary search and edge cases.',
      },
      {
        name: 'CP-Algorithms – Ternary Search',
        url: 'https://cp-algorithms.com/num_methods/ternary_search.html',
        source: 'CP-Algorithms',
        desc: 'Finding the minimum/maximum of unimodal functions using ternary search.',
      },
      {
        name: 'USACO Guide – Binary Search (Silver)',
        url: 'https://usaco.guide/silver/binary-search?lang=cpp',
        source: 'USACO Guide',
        desc: 'Silver-level binary search on answers with structured contest problems.',
      },
      {
        name: 'USACO Guide – More on Sorting (Silver)',
        url: 'https://usaco.guide/silver/sorting-custom?lang=cpp',
        source: 'USACO Guide',
        desc: 'Custom comparators and sorting with binary search applications.',
      },
    ],
    playlists: [
      {
        name: 'Luv – Binary Search Guide',
        url: 'https://www.youtube.com/watch?v=OMcxQ3IY-qc&list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-',
        channel: 'Luv',
        desc: 'Covers STL lower/upper bound, binary search on answer, and contest-level applications in Hinglish.',
      },
    ],
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    icon: <Hash size={16} />,
    difficulty: 'Beginner',
    accentColor: '#f59e0b',
    summary:
      'Bit manipulation leverages binary representation to solve problems in O(1) or O(log N). It powers bitmask DP, subset enumeration, fast I/O tricks, and many greedy optimizations used in competitive programming.',
    whatYouLearn: [
      'Bitwise AND, OR, XOR, NOT',
      'Left/Right Shifts',
      'Set / Clear / Toggle bits',
      'Popcount & __builtin functions',
      'Bitmask DP (2^N states)',
      'Subset Enumeration',
      'Power of 2 tricks',
    ],
    readings: [
      {
        name: 'CP-Algorithms – Bit Manipulation Intro',
        url: 'https://cp-algorithms.com/algebra/bit-manipulation.html',
        source: 'CP-Algorithms',
        desc: 'Complete reference for bitwise operations, builtin functions, and bitmask tricks.',
      },
      {
        name: 'CP-Algorithms – Bitmask DP',
        url: 'https://cp-algorithms.com/dynamic_programming/dp-on-bitmasks.html',
        source: 'CP-Algorithms',
        desc: 'Subset DP with bitmask states — classic TSP and assignment problems.',
      },
      {
        name: 'USACO Guide – Bitmasking Basics (Silver)',
        url: 'https://usaco.guide/silver/bitmasks?lang=cpp',
        source: 'USACO Guide',
        desc: 'Bitmask fundamentals with USACO-style problems for silver level.',
      },
      {
        name: 'USACO Guide – Bitmask DP (Gold)',
        url: 'https://usaco.guide/gold/dp-bitmasks?lang=cpp',
        source: 'USACO Guide',
        desc: 'Gold-level bitmask DP with subset enumeration and profile DP techniques.',
      },
    ],
    playlists: [
      {
        name: 'Luv – Bit Manipulation Series',
        url: 'https://www.youtube.com/watch?v=OMcxQ3IY-qc&list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-',
        channel: 'Luv',
        desc: 'Clear and beginner-friendly Hinglish explanation of all bitwise operations and competitive applications.',
      },
    ],
  },
  {
    id: 'number-theory',
    name: 'Number Theory',
    icon: <Sigma size={16} />,
    difficulty: 'Intermediate',
    accentColor: '#ef4444',
    summary:
      'Number theory is the backbone of math problems in CP. Topics include prime factorization, sieve of Eratosthenes, GCD/LCM, modular arithmetic, Euler\'s totient, modular inverse, and fast exponentiation (binary exponentiation).',
    whatYouLearn: [
      'Sieve of Eratosthenes',
      'Prime Factorization',
      'GCD / LCM (Euclidean)',
      'Modular Arithmetic',
      'Binary Exponentiation',
      'Modular Inverse (Fermat)',
      "Euler's Totient Function",
      'Chinese Remainder Theorem',
    ],
    readings: [
      {
        name: 'CP-Algorithms – Sieve of Eratosthenes',
        url: 'https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html',
        source: 'CP-Algorithms',
        desc: 'Finding all primes up to N in O(N log log N). Linear sieve variant also covered.',
      },
      {
        name: 'CP-Algorithms – Binary Exponentiation',
        url: 'https://cp-algorithms.com/algebra/binary-exp.html',
        source: 'CP-Algorithms',
        desc: 'Fast O(log N) exponentiation for computing a^b mod p efficiently.',
      },
      {
        name: 'CP-Algorithms – Extended Euclidean Algorithm',
        url: 'https://cp-algorithms.com/algebra/extended-euclid-algorithm.html',
        source: 'CP-Algorithms',
        desc: 'Bezout coefficients, GCD, and finding modular inverse using extended Euclidean.',
      },
      {
        name: 'USACO Guide – Modular Arithmetic (Gold)',
        url: 'https://usaco.guide/gold/divisibility?lang=cpp',
        source: 'USACO Guide',
        desc: 'Modular division, Fermat little theorem, and modular inverse with gold-level problems.',
      },
    ],
    playlists: [
      {
        name: 'Luv – Number Theory Series',
        url: 'https://www.youtube.com/watch?v=OMcxQ3IY-qc&list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-',
        channel: 'Luv',
        desc: 'Deep-dive into primes, binary exponentiation, combinatorics, and modular arithmetic in Hinglish.',
      },
    ],
  },
  {
    id: 'combinatorics',
    name: 'Combinatorics',
    icon: <Zap size={16} />,
    difficulty: 'Intermediate',
    accentColor: '#ec4899',
    summary:
      'Combinatorics deals with counting, arrangements, and selections. In CP, it covers permutations, combinations, Pascal\'s triangle, Catalan numbers, inclusion-exclusion principle, and generating functions used in many math-heavy contests.',
    whatYouLearn: [
      'Permutations & Combinations',
      'Pascal\'s Triangle',
      'nCr with Modular Inverse',
      'Catalan Numbers',
      'Inclusion-Exclusion Principle',
      'Stars and Bars',
      'Derangements',
      'Generating Functions (intro)',
    ],
    readings: [
      {
        name: 'CP-Algorithms – Combinatorics Basics',
        url: 'https://cp-algorithms.com/combinatorics/binomial-coefficients.html',
        source: 'CP-Algorithms',
        desc: 'Computing binomial coefficients with modular arithmetic and Pascal triangle precomputation.',
      },
      {
        name: 'CP-Algorithms – Catalan Numbers',
        url: 'https://cp-algorithms.com/combinatorics/catalan-numbers.html',
        source: 'CP-Algorithms',
        desc: 'Derivation and applications of Catalan numbers in bracket sequences, BSTs, triangulations.',
      },
      {
        name: 'CP-Algorithms – Inclusion-Exclusion',
        url: 'https://cp-algorithms.com/combinatorics/inclusion-exclusion.html',
        source: 'CP-Algorithms',
        desc: 'Counting with overlapping sets using inclusion-exclusion principle with CP examples.',
      },
      {
        name: 'USACO Guide – Combinatorics (Gold)',
        url: 'https://usaco.guide/gold/combinatorics?lang=cpp',
        source: 'USACO Guide',
        desc: 'Gold-level counting techniques with precomputed factorials and inverse factorials.',
      },
    ],
    playlists: [
      {
        name: 'Luv – Combinatorics / Math',
        url: 'https://www.youtube.com/watch?v=OMcxQ3IY-qc&list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-',
        channel: 'Luv',
        desc: 'Math-focused Hinglish explanations covering counting techniques used in CP contests.',
      },
    ],
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    icon: <Code size={16} />,
    difficulty: 'Advanced',
    accentColor: '#8b5cf6',
    summary:
      'Advanced data structures are essential for solving range query problems in O(log N). This includes Segment Trees, Fenwick Trees (BIT), Sparse Tables, DSU (Union-Find), Treaps, and more.',
    whatYouLearn: [
      'Segment Tree (point/range updates)',
      'Lazy Propagation',
      'Fenwick Tree / BIT',
      'Sparse Table (RMQ)',
      'Disjoint Set Union (DSU)',
      'Persistent Segment Tree',
      'Merge Sort Tree',
    ],
    readings: [
      {
        name: 'CP-Algorithms – Segment Tree',
        url: 'https://cp-algorithms.com/data_structures/segment_tree.html',
        source: 'CP-Algorithms',
        desc: 'Full guide: build, point update, range query, lazy propagation in O(log N).',
      },
      {
        name: 'CP-Algorithms – DSU (Union-Find)',
        url: 'https://cp-algorithms.com/data_structures/disjoint_set_union.html',
        source: 'CP-Algorithms',
        desc: 'Path compression + union by rank for near O(1) amortized operations.',
      },
      {
        name: 'CP-Algorithms – Fenwick Tree (BIT)',
        url: 'https://cp-algorithms.com/data_structures/fenwick.html',
        source: 'CP-Algorithms',
        desc: 'Binary Indexed Tree for prefix sum queries and updates in O(log N).',
      },
      {
        name: 'USACO Guide – Segment Trees (Platinum)',
        url: 'https://usaco.guide/plat/segtree?lang=cpp',
        source: 'USACO Guide',
        desc: 'Dynamic segment trees, merge-sort trees, and offline range queries.',
      },
      {
        name: 'Codeforces EDU – Segment Tree',
        url: 'https://codeforces.com/edu/course/2',
        source: 'Codeforces EDU',
        desc: 'Interactive step-by-step segment tree course with graded problems on CF.',
      },
    ],
    playlists: [
      {
        name: 'Luv – Data Structures Series',
        url: 'https://www.youtube.com/watch?v=OMcxQ3IY-qc&list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-',
        channel: 'Luv',
        desc: 'Hinglish explanations of segment trees, BIT, sparse table, and DSU with code.',
      },
    ],
  },
];

// ─── Source Badge Colors ──────────────────────────────────────────────────────
const SOURCE_STYLES: Record<string, { bg: string; color: string }> = {
  'CP-Algorithms': { bg: 'rgba(236,72,153,0.12)', color: '#f472b6' },
  'USACO Guide': { bg: 'rgba(99,102,241,0.12)', color: '#a5b4fc' },
  'Codeforces EDU': { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  'Other': { bg: 'rgba(255,255,255,0.06)', color: '#94a3b8' },
};

const DIFFICULTY_STYLES: Record<string, { bg: string; color: string }> = {
  Beginner: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80' },
  Intermediate: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  Advanced: { bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
};

// ─── Playlist Card ────────────────────────────────────────────────────────────
const PlaylistCard: React.FC<{ playlist: Playlist; accent: string; index: number }> = ({ playlist, accent, index }) => (
  <div style={{
    padding: '14px 16px',
    background: `rgba(${hexToRgb(accent)}, 0.04)`,
    border: `1px solid rgba(${hexToRgb(accent)}, 0.15)`,
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    transition: 'all 0.2s ease',
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{
          width: '22px', height: '22px', borderRadius: '6px',
          background: `rgba(${hexToRgb(accent)}, 0.15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 800, color: accent, flexShrink: 0
        }}>
          {index + 1}
        </div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: 0 }}>{playlist.name}</h4>
      </div>
      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 30px', lineHeight: 1.5 }}>
        {playlist.desc}
      </p>
      <p style={{ fontSize: '0.72rem', color: accent, margin: '4px 0 0 30px', fontWeight: 600, opacity: 0.8 }}>
        📺 {playlist.channel}
      </p>
    </div>
    <a
      href={playlist.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        background: accent, color: '#000',
        padding: '6px 12px', borderRadius: '6px',
        fontSize: '0.78rem', fontWeight: 700,
        textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0
      }}
    >
      <PlayCircle size={13} /> Watch
    </a>
  </div>
);

// ─── Reading Card ─────────────────────────────────────────────────────────────
const ReadingCard: React.FC<{ reading: Reading }> = ({ reading }) => {
  const style = SOURCE_STYLES[reading.source] || SOURCE_STYLES['Other'];
  return (
    <div style={{
      padding: '14px 16px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '10px',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{reading.name}</h4>
          <span style={{
            fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
            background: style.bg, color: style.color
          }}>
            {reading.source}
          </span>
        </div>
        <a
          href={reading.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            color: style.color, fontSize: '0.78rem', fontWeight: 600,
            textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            border: `1px solid ${style.color}44`, padding: '4px 10px', borderRadius: '6px'
          }}
        >
          Read <ExternalLink size={11} />
        </a>
      </div>
      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{reading.desc}</p>
    </div>
  );
};

// hex to rgb helper
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : '255,255,255';
}

// ─── Main Resources Component ─────────────────────────────────────────────────
export const Resources: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState('dp');
  const [expandedSection, setExpandedSection] = useState<'readings' | 'playlists' | null>(null);

  const topic = TOPICS.find(t => t.id === activeTopic) || TOPICS[0];
  const diffStyle = DIFFICULTY_STYLES[topic.difficulty];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontSize: '1.8rem', fontWeight: 800,
          background: 'linear-gradient(90deg, #fff 0%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '6px'
        }}>
          CP Learning Resources
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Topic-wise curated docs from CP-Algorithms & USACO Guide + YouTube playlists from top educators
        </p>
      </div>

      {/* Topic Tabs */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '12px', marginBottom: '28px'
      }}>
        {TOPICS.map(t => {
          const isActive = activeTopic === t.id;
          const rgb = hexToRgb(t.accentColor);
          return (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: isActive ? t.accentColor : 'rgba(255,255,255,0.03)',
                color: isActive ? '#000' : '#94a3b8',
                border: isActive ? 'none' : `1px solid rgba(${rgb},0.2)`,
                borderRadius: '8px', padding: '8px 16px',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? `0 4px 16px rgba(${rgb},0.35)` : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {t.icon} {t.name}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* LEFT: Topic Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Summary Card */}
          <div className="glass-card" style={{ borderTop: `3px solid ${topic.accentColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: topic.accentColor }}>{topic.name}</h3>
              <span style={{
                fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', fontWeight: 700,
                background: diffStyle.bg, color: diffStyle.color
              }}>
                {topic.difficulty}
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>{topic.summary}</p>
          </div>

          {/* What You'll Learn */}
          <div className="glass-card">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} style={{ color: topic.accentColor }} />
              What You'll Learn
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {topic.whatYouLearn.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '0.82rem', color: '#94a3b8'
                }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: topic.accentColor, flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: topic.accentColor }}>{topic.readings.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Articles</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{topic.playlists.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Playlists</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Resources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Documented Resources Section */}
          <div className="glass-card">
            <button
              onClick={() => setExpandedSection(expandedSection === 'readings' ? null : 'readings')}
              style={{
                width: '100%', background: 'none', border: 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', padding: 0, marginBottom: expandedSection !== 'readings' ? 0 : '16px'
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                <BookOpen size={17} style={{ color: 'var(--primary)' }} />
                Documented Resources
                <span style={{
                  fontSize: '0.72rem', background: 'rgba(79,172,254,0.1)', color: 'var(--primary)',
                  padding: '2px 8px', borderRadius: '12px', fontWeight: 700
                }}>
                  {topic.readings.length} articles
                </span>
              </h3>
              {expandedSection === 'readings'
                ? <ChevronUp size={16} style={{ color: '#64748b' }} />
                : <ChevronDown size={16} style={{ color: '#64748b' }} />
              }
            </button>

            {expandedSection === 'readings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topic.readings.map((r, i) => <ReadingCard key={i} reading={r} />)}
              </div>
            )}

            {expandedSection !== 'readings' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                {topic.readings.map((r, i) => {
                  const s = SOURCE_STYLES[r.source] || SOURCE_STYLES['Other'];
                  return (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px',
                      background: s.bg, color: s.color, textDecoration: 'none', fontWeight: 600,
                      border: `1px solid ${s.color}30`
                    }}>
                      {r.name} ↗
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Video Playlists Section */}
          <div className="glass-card">
            <button
              onClick={() => setExpandedSection(expandedSection === 'playlists' ? null : 'playlists')}
              style={{
                width: '100%', background: 'none', border: 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', padding: 0, marginBottom: expandedSection !== 'playlists' ? 0 : '16px'
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                <PlayCircle size={17} style={{ color: '#ef4444' }} />
                YouTube Playlists
                <span style={{
                  fontSize: '0.72rem', background: 'rgba(239,68,68,0.1)', color: '#f87171',
                  padding: '2px 8px', borderRadius: '12px', fontWeight: 700
                }}>
                  {topic.playlists.length} playlists
                </span>
              </h3>
              {expandedSection === 'playlists'
                ? <ChevronUp size={16} style={{ color: '#64748b' }} />
                : <ChevronDown size={16} style={{ color: '#64748b' }} />
              }
            </button>

            {expandedSection === 'playlists' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topic.playlists.map((p, i) => (
                  <PlaylistCard key={i} playlist={p} accent={topic.accentColor} index={i} />
                ))}
              </div>
            )}

            {expandedSection !== 'playlists' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {topic.playlists.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>
                      📺 {p.name}
                    </span>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: '0.75rem', color: topic.accentColor, textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap'
                    }}>
                      Watch ↗
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All topics quick-nav */}
          <div className="glass-card">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Explore More Topics
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TOPICS.filter(t => t.id !== activeTopic).map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTopic(t.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: `rgba(${hexToRgb(t.accentColor)}, 0.08)`,
                    color: t.accentColor, border: `1px solid rgba(${hexToRgb(t.accentColor)}, 0.2)`,
                    borderRadius: '8px', padding: '6px 12px',
                    fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem'
                  }}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
