/**
 * Verified Quantitative Aptitude Questions Dataset
 * Topics covered:
 * Number System, Simplification, Percentages, Profit and Loss, Ratio and Proportion,
 * Averages, Time and Work, Time Speed and Distance, Simple Interest, Compound Interest,
 * Problems on Ages, Mixtures and Alligation, Permutations and Combinations, Probability,
 * Number Series, Data Interpretation.
 */

export const QUANTITATIVE_QUESTIONS = [
  // --- Percentages ---
  {
    id: "quant-pct-001",
    category: "quantitative",
    topic: "percentages",
    topicName: "Percentages",
    difficulty: "easy",
    type: "mcq",
    question: "A student scored 450 marks out of 600 in an examination. What is the percentage of marks obtained?",
    options: [
      { id: "a", text: "70%" },
      { id: "b", text: "75%" },
      { id: "c", text: "78%" },
      { id: "d", text: "80%" },
    ],
    correctOptionId: "b",
    explanation: "Percentage = (Marks Scored / Total Marks) × 100 = (450 / 600) × 100 = 0.75 × 100 = 75%."
  },
  {
    id: "quant-pct-002",
    category: "quantitative",
    topic: "percentages",
    topicName: "Percentages",
    difficulty: "medium",
    type: "mcq",
    question: "If the price of a commodity increases by 25%, by what percentage must a household reduce its consumption so that the total expenditure remains the same?",
    options: [
      { id: "a", text: "18%" },
      { id: "b", text: "20%" },
      { id: "c", text: "22.5%" },
      { id: "d", text: "25%" },
    ],
    correctOptionId: "b",
    explanation: "Reduction in consumption = [r / (100 + r)] × 100%. Here r = 25%. So [25 / 125] × 100 = 1/5 × 100 = 20%."
  },
  {
    id: "quant-pct-003",
    category: "quantitative",
    topic: "percentages",
    topicName: "Percentages",
    difficulty: "hard",
    type: "mcq",
    question: "In a city, 40% of the population are men, 35% are women, and the remaining 37,500 are children. What is the total population of the city?",
    options: [
      { id: "a", text: "125,000" },
      { id: "b", text: "140,000" },
      { id: "c", text: "150,000" },
      { id: "d", text: "175,000" },
    ],
    correctOptionId: "c",
    explanation: "Percentage of children = 100% - (40% + 35%) = 25%. 25% of Total = 37,500. Total = 37,500 × 4 = 150,000."
  },

  // --- Profit and Loss ---
  {
    id: "quant-pnl-001",
    category: "quantitative",
    topic: "profit-and-loss",
    topicName: "Profit and Loss",
    difficulty: "easy",
    type: "mcq",
    question: "An article bought for Rs. 800 is sold for Rs. 960. What is the profit percentage?",
    options: [
      { id: "a", text: "15%" },
      { id: "b", text: "18%" },
      { id: "c", text: "20%" },
      { id: "d", text: "25%" },
    ],
    correctOptionId: "c",
    explanation: "Profit = Selling Price - Cost Price = 960 - 800 = Rs. 160. Profit % = (Profit / CP) × 100 = (160 / 800) × 100 = 20%."
  },
  {
    id: "quant-pnl-002",
    category: "quantitative",
    topic: "profit-and-loss",
    topicName: "Profit and Loss",
    difficulty: "medium",
    type: "mcq",
    question: "A merchant marks his goods 40% above the cost price and allows a discount of 15% on the marked price. What is his net gain percentage?",
    options: [
      { id: "a", text: "18%" },
      { id: "b", text: "19%" },
      { id: "c", text: "21%" },
      { id: "d", text: "25%" },
    ],
    correctOptionId: "b",
    explanation: "Let CP = 100. Marked Price (MP) = 140. Discount = 15% of 140 = 21. SP = 140 - 21 = 119. Profit = 119 - 100 = 19%."
  },
  {
    id: "quant-pnl-003",
    category: "quantitative",
    topic: "profit-and-loss",
    topicName: "Profit and Loss",
    difficulty: "hard",
    type: "mcq",
    question: "By selling 33 meters of cloth, a shopkeeper gains the selling price of 11 meters of cloth. What is his gain percentage?",
    options: [
      { id: "a", text: "33.33%" },
      { id: "b", text: "50%" },
      { id: "c", text: "45%" },
      { id: "d", text: "60%" },
    ],
    correctOptionId: "b",
    explanation: "Gain = SP of 11 m = SP of 33 m - CP of 33 m. Thus, CP of 33 m = SP of 22 m. Let SP of 1 m = Re. 1. SP of 33 m = 33, Gain = 11. CP = 33 - 11 = 22. Gain % = (11 / 22) × 100 = 50%."
  },

  // --- Time and Work ---
  {
    id: "quant-tnw-001",
    category: "quantitative",
    topic: "time-and-work",
    topicName: "Time and Work",
    difficulty: "easy",
    type: "mcq",
    question: "A can complete a piece of work in 12 days and B can do the same work in 24 days. In how many days can they complete it working together?",
    options: [
      { id: "a", text: "6 days" },
      { id: "b", text: "8 days" },
      { id: "c", text: "9 days" },
      { id: "d", text: "10 days" },
    ],
    correctOptionId: "b",
    explanation: "A's 1 day work = 1/12. B's 1 day work = 1/24. Together = 1/12 + 1/24 = 3/24 = 1/8. Total time = 8 days."
  },
  {
    id: "quant-tnw-002",
    category: "quantitative",
    topic: "time-and-work",
    topicName: "Time and Work",
    difficulty: "medium",
    type: "mcq",
    question: "A and B can do a work in 10 days and 15 days respectively. They worked together for 3 days and then B left. In how many more days will A finish the remaining work?",
    options: [
      { id: "a", text: "4 days" },
      { id: "b", text: "5 days" },
      { id: "c", text: "6 days" },
      { id: "d", text: "7 days" },
    ],
    correctOptionId: "b",
    explanation: "Combined rate = 1/10 + 1/15 = 5/30 = 1/6. Work done in 3 days = 3 × (1/6) = 1/2. Remaining work = 1 - 1/2 = 1/2. Time taken by A = (1/2) / (1/10) = 5 days."
  },

  // --- Ratio and Proportion ---
  {
    id: "quant-rnp-001",
    category: "quantitative",
    topic: "ratio-and-proportion",
    topicName: "Ratio and Proportion",
    difficulty: "easy",
    type: "mcq",
    question: "If A : B = 3 : 4 and B : C = 8 : 9, then what is A : C?",
    options: [
      { id: "a", text: "1 : 2" },
      { id: "b", text: "2 : 3" },
      { id: "c", text: "3 : 4" },
      { id: "d", text: "4 : 5" },
    ],
    correctOptionId: "b",
    explanation: "A/C = (A/B) × (B/C) = (3/4) × (8/9) = 24/36 = 2/3. So A : C = 2 : 3."
  },
  {
    id: "quant-rnp-002",
    category: "quantitative",
    topic: "ratio-and-proportion",
    topicName: "Ratio and Proportion",
    difficulty: "medium",
    type: "mcq",
    question: "Rs. 4,200 is divided among A, B, and C in the ratio 2 : 5 : 7. What is the share of B?",
    options: [
      { id: "a", text: "Rs. 1,200" },
      { id: "b", text: "Rs. 1,400" },
      { id: "c", text: "Rs. 1,500" },
      { id: "d", text: "Rs. 1,800" },
    ],
    correctOptionId: "c",
    explanation: "Total ratio parts = 2 + 5 + 7 = 14. B's share = (5 / 14) × 4200 = 5 × 300 = Rs. 1,500."
  },

  // --- Averages ---
  {
    id: "quant-avg-001",
    category: "quantitative",
    topic: "averages",
    topicName: "Averages",
    difficulty: "easy",
    type: "mcq",
    question: "The average score of a batsman in 5 innings is 48 runs. How many runs must he score in the 6th inning to increase his average to 52?",
    options: [
      { id: "a", text: "68" },
      { id: "b", text: "72" },
      { id: "c", text: "76" },
      { id: "d", text: "80" },
    ],
    correctOptionId: "b",
    explanation: "Total runs in 5 innings = 5 × 48 = 240. Required total for 6 innings = 6 × 52 = 312. Required runs in 6th inning = 312 - 240 = 72."
  },
  {
    id: "quant-avg-002",
    category: "quantitative",
    topic: "averages",
    topicName: "Averages",
    difficulty: "medium",
    type: "mcq",
    question: "The average age of a class of 30 students is 15 years. If the teacher's age is included, the average age becomes 16 years. What is the age of the teacher?",
    options: [
      { id: "a", text: "42 years" },
      { id: "b", text: "45 years" },
      { id: "c", text: "46 years" },
      { id: "d", text: "50 years" },
    ],
    correctOptionId: "c",
    explanation: "Sum of 30 students = 30 × 15 = 450. Sum of 31 people = 31 × 16 = 496. Teacher's age = 496 - 450 = 46 years."
  },

  // --- Time, Speed and Distance ---
  {
    id: "quant-tsd-001",
    category: "quantitative",
    topic: "time-speed-distance",
    topicName: "Time, Speed and Distance",
    difficulty: "easy",
    type: "mcq",
    question: "A train running at a speed of 72 km/h crosses a pole in 15 seconds. What is the length of the train?",
    options: [
      { id: "a", text: "250 m" },
      { id: "b", text: "300 m" },
      { id: "c", text: "350 m" },
      { id: "d", text: "360 m" },
    ],
    correctOptionId: "b",
    explanation: "Speed in m/s = 72 × (5/18) = 20 m/s. Length of train = Speed × Time = 20 × 15 = 300 meters."
  },
  {
    id: "quant-tsd-002",
    category: "quantitative",
    topic: "time-speed-distance",
    topicName: "Time, Speed and Distance",
    difficulty: "medium",
    type: "mcq",
    question: "A person travels from town A to town B at 40 km/h and returns at 60 km/h. What is the average speed for the whole journey?",
    options: [
      { id: "a", text: "48 km/h" },
      { id: "b", text: "50 km/h" },
      { id: "c", text: "52 km/h" },
      { id: "d", text: "54 km/h" },
    ],
    correctOptionId: "a",
    explanation: "Average speed for equal distances = (2 × u × v) / (u + v) = (2 × 40 × 60) / (40 + 60) = 4800 / 100 = 48 km/h."
  },

  // --- Simple Interest ---
  {
    id: "quant-si-001",
    category: "quantitative",
    topic: "simple-interest",
    topicName: "Simple Interest",
    difficulty: "easy",
    type: "mcq",
    question: "What is the simple interest on a principal amount of Rs. 5,000 invested at 8% per annum for 3 years?",
    options: [
      { id: "a", text: "Rs. 1,000" },
      { id: "b", text: "Rs. 1,150" },
      { id: "c", text: "Rs. 1,200" },
      { id: "d", text: "Rs. 1,250" },
    ],
    correctOptionId: "c",
    explanation: "SI = (P × R × T) / 100 = (5000 × 8 × 3) / 100 = 50 × 24 = Rs. 1,200."
  },

  // --- Compound Interest ---
  {
    id: "quant-ci-001",
    category: "quantitative",
    topic: "compound-interest",
    topicName: "Compound Interest",
    difficulty: "medium",
    type: "mcq",
    question: "What is the compound interest on Rs. 10,000 at 10% per annum for 2 years, compounded annually?",
    options: [
      { id: "a", text: "Rs. 2,000" },
      { id: "b", text: "Rs. 2,100" },
      { id: "c", text: "Rs. 2,150" },
      { id: "d", text: "Rs. 2,200" },
    ],
    correctOptionId: "b",
    explanation: "Amount = P(1 + R/100)^T = 10000 × (1.10)^2 = 10000 × 1.21 = Rs. 12,100. CI = 12,100 - 10,000 = Rs. 2,100."
  },

  // --- Problems on Ages ---
  {
    id: "quant-age-001",
    category: "quantitative",
    topic: "problems-on-ages",
    topicName: "Problems on Ages",
    difficulty: "easy",
    type: "mcq",
    question: "The ratio of present ages of father and son is 5 : 2. After 5 years, the sum of their ages will be 59 years. What is the present age of the son?",
    options: [
      { id: "a", text: "12 years" },
      { id: "b", text: "14 years" },
      { id: "c", text: "15 years" },
      { id: "d", text: "16 years" },
    ],
    correctOptionId: "b",
    explanation: "Let ages be 5x and 2x. After 5 years: (5x + 5) + (2x + 5) = 59 => 7x + 10 = 59 => 7x = 49 => x = 7. Son's age = 2 × 7 = 14 years."
  },

  // --- Mixtures and Alligation ---
  {
    id: "quant-mix-001",
    category: "quantitative",
    topic: "mixtures-and-alligation",
    topicName: "Mixtures and Alligation",
    difficulty: "medium",
    type: "mcq",
    question: "In what ratio must tea worth Rs. 60 per kg be mixed with tea worth Rs. 75 per kg so that the mixture is worth Rs. 65 per kg?",
    options: [
      { id: "a", text: "2 : 1" },
      { id: "b", text: "3 : 1" },
      { id: "c", text: "1 : 2" },
      { id: "d", text: "3 : 2" },
    ],
    correctOptionId: "a",
    explanation: "By Alligation: (Price of dearer - Mean) / (Mean - Price of cheaper) = (75 - 65) / (65 - 60) = 10 / 5 = 2 : 1."
  },

  // --- Permutations and Combinations ---
  {
    id: "quant-pnc-001",
    category: "quantitative",
    topic: "permutations-combinations",
    topicName: "Permutations and Combinations",
    difficulty: "hard",
    type: "mcq",
    question: "In how many different ways can the letters of the word 'LEADER' be arranged?",
    options: [
      { id: "a", text: "120" },
      { id: "b", text: "360" },
      { id: "c", text: "720" },
      { id: "d", text: "180" },
    ],
    correctOptionId: "b",
    explanation: "'LEADER' has 6 letters where 'E' appears twice. Total arrangements = 6! / 2! = 720 / 2 = 360 ways."
  },

  // --- Probability ---
  {
    id: "quant-prob-001",
    category: "quantitative",
    topic: "probability",
    topicName: "Probability",
    difficulty: "medium",
    type: "mcq",
    question: "Two unbiased dice are tossed together. What is the probability of getting a sum of 8?",
    options: [
      { id: "a", text: "1/6" },
      { id: "b", text: "5/36" },
      { id: "c", text: "7/36" },
      { id: "d", text: "1/9" },
    ],
    correctOptionId: "b",
    explanation: "Total outcomes = 6 × 6 = 36. Outcomes with sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes. Probability = 5/36."
  },

  // --- Number System ---
  {
    id: "quant-num-001",
    category: "quantitative",
    topic: "number-system",
    topicName: "Number System",
    difficulty: "easy",
    type: "mcq",
    question: "What is the unit digit of (3^65 × 6^59 × 7^71)?",
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "2" },
      { id: "c", text: "4" },
      { id: "d", text: "6" },
    ],
    correctOptionId: "c",
    explanation: "Cyclicity of 3 is 4: 65 mod 4 = 1 -> unit digit 3. Unit digit of 6^n is always 6. Cyclicity of 7 is 4: 71 mod 4 = 3 -> 7^3 = 343 -> unit digit 3. Product of unit digits = 3 × 6 × 3 = 54 -> unit digit is 4."
  },

  // --- Simplification ---
  {
    id: "quant-simp-001",
    category: "quantitative",
    topic: "simplification",
    topicName: "Simplification",
    difficulty: "easy",
    type: "mcq",
    question: "Evaluate: 25 - [14 + {18 - (12 - 4)}]",
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "3" },
      { id: "c", text: "5" },
      { id: "d", text: "7" },
    ],
    correctOptionId: "a",
    explanation: "Innermost brackets: 12 - 4 = 8. Curly brackets: 18 - 8 = 10. Square brackets: 14 + 10 = 24. Final result = 25 - 24 = 1."
  },

  // --- Number Series (Quant) ---
  {
    id: "quant-series-001",
    category: "quantitative",
    topic: "quant-number-series",
    topicName: "Number Series",
    difficulty: "medium",
    type: "mcq",
    question: "Find the missing number in the series: 4, 9, 19, 39, 79, ?",
    options: [
      { id: "a", text: "149" },
      { id: "b", text: "159" },
      { id: "c", text: "169" },
      { id: "d", text: "179" },
    ],
    correctOptionId: "b",
    explanation: "Pattern is (previous × 2) + 1: 4×2+1=9; 9×2+1=19; 19×2+1=39; 39×2+1=79; 79×2+1 = 158 + 1 = 159."
  },

  // --- Data Interpretation ---
  {
    id: "quant-di-001",
    category: "quantitative",
    topic: "data-interpretation",
    topicName: "Data Interpretation",
    difficulty: "hard",
    type: "mcq",
    question: "A company's revenue distribution across three quarters is: Q1 = $120,000, Q2 = $150,000, Q3 = $180,000. What is the percentage increase in revenue from Q1 to Q3?",
    options: [
      { id: "a", text: "33.33%" },
      { id: "b", text: "40%" },
      { id: "c", text: "50%" },
      { id: "d", text: "60%" },
    ],
    correctOptionId: "c",
    explanation: "Increase = Q3 - Q1 = 180,000 - 120,000 = 60,000. Percentage Increase = (60,000 / 120,000) × 100 = 50%."
  }
];
