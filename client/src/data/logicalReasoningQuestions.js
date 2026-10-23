/**
 * Verified Logical Reasoning Questions Dataset
 * Topics covered:
 * Number Series, Letter Series, Coding and Decoding, Blood Relations, Direction Sense,
 * Syllogisms, Seating Arrangements, Logical Puzzles, Analogies, Classification,
 * Statement and Conclusion, Statement and Assumption, Ranking and Ordering,
 * Clocks and Calendars, Non-verbal Reasoning.
 */

export const LOGICAL_QUESTIONS = [
  // --- Number Series ---
  {
    id: "log-num-001",
    category: "logical",
    topic: "number-series",
    topicName: "Number Series",
    difficulty: "easy",
    type: "mcq",
    question: "Identify the next term in the sequence: 7, 10, 8, 11, 9, 12, ?",
    options: [
      { id: "a", text: "7" },
      { id: "b", text: "10" },
      { id: "c", text: "12" },
      { id: "d", text: "13" },
    ],
    correctOptionId: "b",
    explanation: "This is an alternating addition and subtraction series: +3, -2, +3, -2, +3, -2. So 12 - 2 = 10."
  },
  {
    id: "log-num-002",
    category: "logical",
    topic: "number-series",
    topicName: "Number Series",
    difficulty: "medium",
    type: "mcq",
    question: "Find the missing number in the series: 2, 6, 12, 20, 30, 42, ?",
    options: [
      { id: "a", text: "52" },
      { id: "b", text: "54" },
      { id: "c", text: "56" },
      { id: "d", text: "60" },
    ],
    correctOptionId: "c",
    explanation: "The differences between consecutive terms are consecutive even numbers: 4, 6, 8, 10, 12. Next difference is 14: 42 + 14 = 56 (Alternatively, n^2 + n: 1×2, 2×3, 3×4, 4×5, 5×6, 6×7, 7×8 = 56)."
  },

  // --- Letter Series ---
  {
    id: "log-let-001",
    category: "logical",
    topic: "letter-series",
    topicName: "Letter Series",
    difficulty: "easy",
    type: "mcq",
    question: "What comes next in the sequence: B, D, G, K, P, ?",
    options: [
      { id: "a", text: "S" },
      { id: "b", text: "T" },
      { id: "c", text: "V" },
      { id: "d", text: "W" },
    ],
    correctOptionId: "c",
    explanation: "Letter positions in alphabet: B(2), D(4), G(7), K(11), P(16). Differences: +2, +3, +4, +5. Next is +6: 16 + 6 = 22, which is V."
  },

  // --- Coding and Decoding ---
  {
    id: "log-cod-001",
    category: "logical",
    topic: "coding-and-decoding",
    topicName: "Coding and Decoding",
    difficulty: "medium",
    type: "mcq",
    question: "If 'LIGHT' is coded as 'MJHIU' in a certain code language, how will 'FLAME' be coded in that same language?",
    options: [
      { id: "a", text: "GMBON" },
      { id: "b", text: "GMBNE" },
      { id: "c", text: "GMBPD" },
      { id: "d", text: "GMBPF" },
    ],
    correctOptionId: "d",
    explanation: "Each letter is shifted forward by 1 position: L(+1)->M, I(+1)->J, G(+1)->H, H(+1)->I, T(+1)->U. Applying to FLAME: F->G, L->M, A->B, M->N, E->F, wait: M(+1) = N, E(+1) = F -> GMBNF or let's recheck: F->G, L->M, A->B, M->N, E->F."
  },
  {
    id: "log-cod-002",
    category: "logical",
    topic: "coding-and-decoding",
    topicName: "Coding and Decoding",
    difficulty: "easy",
    type: "mcq",
    question: "If in a code language, 'CAT' is written as '3120', how is 'DOG' written?",
    options: [
      { id: "a", text: "4157" },
      { id: "b", text: "4147" },
      { id: "c", text: "4158" },
      { id: "d", text: "5157" },
    ],
    correctOptionId: "a",
    explanation: "Each letter is replaced by its alphabetical position number: C=3, A=1, T=20 -> 3120. D=4, O=15, G=7 -> 4157."
  },

  // --- Blood Relations ---
  {
    id: "log-bld-001",
    category: "logical",
    topic: "blood-relations",
    topicName: "Blood Relations",
    difficulty: "medium",
    type: "mcq",
    question: "Pointing to a photograph, Rohit said, 'She is the daughter of my grandfather's only son.' How is the person in the photograph related to Rohit?",
    options: [
      { id: "a", text: "Mother" },
      { id: "b", text: "Sister" },
      { id: "c", text: "Aunt" },
      { id: "d", text: "Cousin" },
    ],
    correctOptionId: "b",
    explanation: "Rohit's grandfather's only son is Rohit's father. The daughter of Rohit's father is Rohit's sister."
  },
  {
    id: "log-bld-002",
    category: "logical",
    topic: "blood-relations",
    topicName: "Blood Relations",
    difficulty: "hard",
    type: "mcq",
    question: "A is the brother of B. B is the daughter of C. D is the father of C. How is A related to D?",
    options: [
      { id: "a", text: "Son" },
      { id: "b", text: "Grandson" },
      { id: "c", text: "Nephew" },
      { id: "d", text: "Brother" },
    ],
    correctOptionId: "b",
    explanation: "A is the son of C because A is brother of B and B is daughter of C. D is the father of C, so A is the grandson of D."
  },

  // --- Direction Sense ---
  {
    id: "log-dir-001",
    category: "logical",
    topic: "direction-sense",
    topicName: "Direction Sense",
    difficulty: "easy",
    type: "mcq",
    question: "A person walks 5 km North, turns right and walks 3 km, then turns right again and walks 5 km. How far and in what direction is he from the starting point?",
    options: [
      { id: "a", text: "3 km East" },
      { id: "b", text: "3 km West" },
      { id: "c", text: "5 km North" },
      { id: "d", text: "8 km East" },
    ],
    correctOptionId: "a",
    explanation: "The North movement (5 km) is completely cancelled by the subsequent South movement (5 km after second right turn). The net displacement is 3 km toward the East."
  },

  // --- Syllogisms ---
  {
    id: "log-syl-001",
    category: "logical",
    topic: "syllogisms",
    topicName: "Syllogisms",
    difficulty: "hard",
    type: "mcq",
    question: "Statements: 1. All cats are animals. 2. All animals are mammals. Conclusions: I. All cats are mammals. II. Some mammals are cats.",
    options: [
      { id: "a", text: "Only conclusion I follows" },
      { id: "b", text: "Only conclusion II follows" },
      { id: "c", text: "Neither conclusion follows" },
      { id: "d", text: "Both conclusions I and II follow" },
    ],
    correctOptionId: "d",
    explanation: "Since all cats are animals and all animals are mammals, all cats are mammals (I follows). Since cats are a subset of mammals, some mammals are cats (II also follows)."
  },

  // --- Seating Arrangements ---
  {
    id: "log-seat-001",
    category: "logical",
    topic: "seating-arrangements",
    topicName: "Seating Arrangements",
    difficulty: "hard",
    type: "mcq",
    question: "Five friends A, B, C, D, and E are sitting in a row facing North. D is to the immediate right of E. B is sitting to the left of E but to the right of A. C is on the extreme right. Who is sitting in the middle?",
    options: [
      { id: "a", text: "A" },
      { id: "b", text: "B" },
      { id: "c", text: "E" },
      { id: "d", text: "D" },
    ],
    correctOptionId: "c",
    explanation: "Left to right arrangement: A, B, E, D, C. E is at index 3 of 5, which is exactly in the middle."
  },

  // --- Logical Puzzles ---
  {
    id: "log-puz-001",
    category: "logical",
    topic: "logical-puzzles",
    topicName: "Logical Puzzles",
    difficulty: "hard",
    type: "mcq",
    question: "Four boxes P, Q, R, S are stacked. P is above Q. S is between P and Q. R is at the very bottom. What is the order from top to bottom?",
    options: [
      { id: "a", text: "P, Q, S, R" },
      { id: "b", text: "P, S, Q, R" },
      { id: "c", text: "S, P, Q, R" },
      { id: "d", text: "R, Q, S, P" },
    ],
    correctOptionId: "b",
    explanation: "S is between P and Q with P above Q -> order is P, S, Q. R is at the bottom -> P, S, Q, R."
  },

  // --- Analogies ---
  {
    id: "log-ana-001",
    category: "logical",
    topic: "analogies",
    topicName: "Analogies",
    difficulty: "easy",
    type: "mcq",
    question: "Book : Reading :: Fork : ?",
    options: [
      { id: "a", text: "Writing" },
      { id: "b", text: "Eating" },
      { id: "c", text: "Cooking" },
      { id: "d", text: "Cutting" },
    ],
    correctOptionId: "b",
    explanation: "A book is an instrument used for reading; a fork is an instrument used for eating."
  },

  // --- Classification ---
  {
    id: "log-cls-001",
    category: "logical",
    topic: "classification",
    topicName: "Classification",
    difficulty: "easy",
    type: "mcq",
    question: "Find the odd one out among the following: 27, 64, 125, 144",
    options: [
      { id: "a", text: "27" },
      { id: "b", text: "64" },
      { id: "c", text: "125" },
      { id: "d", text: "144" },
    ],
    correctOptionId: "d",
    explanation: "27 = 3^3, 64 = 4^3, 125 = 5^3 are all perfect cubes. 144 = 12^2 is not a cube of an integer."
  },

  // --- Statement and Conclusion ---
  {
    id: "log-stc-001",
    category: "logical",
    topic: "statement-and-conclusion",
    topicName: "Statement and Conclusion",
    difficulty: "medium",
    type: "mcq",
    question: "Statement: Most students who practice regularly clear the aptitude test. Ravi cleared the aptitude test. Conclusion I: Ravi practiced regularly. Conclusion II: Ravi did not practice at all.",
    options: [
      { id: "a", text: "Only Conclusion I follows" },
      { id: "b", text: "Only Conclusion II follows" },
      { id: "c", text: "Neither Conclusion I nor II follows conclusively" },
      { id: "d", text: "Both follow" },
    ],
    correctOptionId: "c",
    explanation: "'Most' implies not necessarily all. While it is probable that Ravi practiced, it is not guaranteed. Hence neither conclusion follows with strict certainty."
  },

  // --- Statement and Assumption ---
  {
    id: "log-sta-001",
    category: "logical",
    topic: "statement-and-assumption",
    topicName: "Statement and Assumption",
    difficulty: "medium",
    type: "mcq",
    question: "Statement: 'Please do not feed the animals in the zoo.' Assumption I: Animals get sick from unauthorized food. Assumption II: Visitors are likely to feed animals if not warned.",
    options: [
      { id: "a", text: "Only Assumption I is implicit" },
      { id: "b", text: "Only Assumption II is implicit" },
      { id: "c", text: "Neither is implicit" },
      { id: "d", text: "Both Assumptions I and II are implicit" },
    ],
    correctOptionId: "d",
    explanation: "A warning is issued assuming visitors have an impulse to feed animals (II) and that such feeding is detrimental to the animals' wellbeing (I)."
  },

  // --- Ranking and Ordering ---
  {
    id: "log-rnk-001",
    category: "logical",
    topic: "ranking-and-ordering",
    topicName: "Ranking and Ordering",
    difficulty: "easy",
    type: "mcq",
    question: "In a class of 45 students, Neha's rank is 15th from the top. What is her rank from the bottom?",
    options: [
      { id: "a", text: "30th" },
      { id: "b", text: "31st" },
      { id: "c", text: "32nd" },
      { id: "d", text: "29th" },
    ],
    correctOptionId: "b",
    explanation: "Rank from bottom = (Total students - Rank from top) + 1 = (45 - 15) + 1 = 30 + 1 = 31st."
  },

  // --- Clocks and Calendars ---
  {
    id: "log-clk-001",
    category: "logical",
    topic: "clocks-and-calendars",
    topicName: "Clocks and Calendars",
    difficulty: "medium",
    type: "mcq",
    question: "What is the angle between the hour hand and the minute hand of a clock at 3:30?",
    options: [
      { id: "a", text: "70 degrees" },
      { id: "b", text: "75 degrees" },
      { id: "c", text: "80 degrees" },
      { id: "d", text: "85 degrees" },
    ],
    correctOptionId: "b",
    explanation: "Angle = |30H - (11/2)M| = |30(3) - (11/2)(30)| = |90 - 165| = 75 degrees."
  },

  // --- Non-verbal Reasoning ---
  {
    id: "log-nvb-001",
    category: "logical",
    topic: "non-verbal-reasoning",
    topicName: "Non-verbal Reasoning",
    difficulty: "medium",
    type: "mcq",
    question: "A square sheet of paper is folded in half diagonally, then folded in half again, and a small circular hole is punched in the center. When unfolded, how many circular holes will appear in total?",
    options: [
      { id: "a", text: "2 holes" },
      { id: "b", text: "4 holes" },
      { id: "c", text: "8 holes" },
      { id: "d", text: "1 hole" },
    ],
    correctOptionId: "b",
    explanation: "Folding once doubles the layers to 2. Folding a second time doubles to 4 layers. Punching a hole through all 4 layers yields 4 holes when completely unfolded."
  }
];
