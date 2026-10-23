/**
 * Aptitude Concepts, Formulas, Solved Examples, and Common Pitfalls
 * Used in LEARN MODE.
 */

export const TOPIC_CONCEPTS = {
  // Quantitative Concepts
  "percentages": {
    topicId: "percentages",
    title: "Percentages",
    category: "quantitative",
    introduction: "Percentage means 'per one hundred' and represents parts out of 100. It is the cornerstone of commercial mathematics and data interpretation.",
    concepts: [
      {
        heading: "Basic Definition & Conversions",
        body: "To convert a fraction (a/b) into a percentage, multiply by 100%. Conversely, to convert x% into a fraction, divide by 100 (x/100)."
      },
      {
        heading: "Percentage Change",
        body: "Percentage Increase/Decrease = |New Value - Initial Value| / Initial Value × 100%. Always divide by the original (base) value."
      },
      {
        heading: "Successive Percentage Changes",
        body: "If a value changes by a% and then by b%, the net percentage change is [a + b + (a × b) / 100]%. Use positive signs for increases and negative signs for decreases."
      }
    ],
    formulas: [
      { name: "Percentage Value", formula: "Value = (P / 100) × Total" },
      { name: "Percentage Change", formula: "% Change = [(Final - Initial) / Initial] × 100" },
      { name: "Successive Changes", formula: "Net % = a + b + (ab / 100)" },
      { name: "Price-Consumption Invariance", formula: "Reduction = [r / (100 + r)] × 100%" }
    ],
    solvedExamples: [
      {
        problem: "The price of petrol increased by 20%. By what percentage should a driver reduce consumption to keep expenditure constant?",
        solution: "Let initial price = 100 and initial consumption = 100 units. Initial expenditure = 10,000.\nNew price = 120.\nRequired consumption = 10,000 / 120 = 83.33 units.\nReduction = 100 - 83.33 = 16.67%.\nUsing formula: [20 / (100 + 20)] × 100 = (20 / 120) × 100 = 16.67%."
      },
      {
        problem: "A salary is first increased by 10% and later decreased by 10%. What is the net percentage change?",
        solution: "Net Change = a + b + (ab / 100) = (+10) + (-10) + [(+10)(-10) / 100] = 0 - 1 = -1% (A 1% net decrease)."
      }
    ],
    commonMistakes: [
      "Dividing by the final value instead of the original/initial value when calculating percentage increase.",
      "Assuming that successive increases of 20% and 10% equal a 30% increase. The actual increase is 20 + 10 + 2 = 32%."
    ]
  },

  "profit-and-loss": {
    topicId: "profit-and-loss",
    title: "Profit and Loss",
    category: "quantitative",
    introduction: "Profit and Loss measures the financial outcome of commercial trade transactions between Cost Price (CP), Selling Price (SP), and Marked Price (MP).",
    concepts: [
      {
        heading: "Cost Price vs Selling Price",
        body: "Profit occurs when SP > CP (Profit = SP - CP). Loss occurs when CP > SP (Loss = CP - SP). Both profit% and loss% are strictly calculated over Cost Price (CP)."
      },
      {
        heading: "Marked Price & Discounts",
        body: "Merchants mark items above CP to offer discounts. Discount is always calculated on the Marked Price (MP). SP = MP - Discount."
      }
    ],
    formulas: [
      { name: "Profit %", formula: "Profit % = (Profit / CP) × 100" },
      { name: "Loss %", formula: "Loss % = (Loss / CP) × 100" },
      { name: "Selling Price with Profit", formula: "SP = CP × [(100 + Profit %) / 100]" },
      { name: "Discount %", formula: "Discount % = [(MP - SP) / MP] × 100" }
    ],
    solvedExamples: [
      {
        problem: "A book was bought for Rs. 250 and sold for Rs. 300. Calculate profit percentage.",
        solution: "Profit = SP - CP = 300 - 250 = Rs. 50.\nProfit % = (50 / 250) × 100 = 20%."
      }
    ],
    commonMistakes: [
      "Calculating profit percentage over the selling price instead of the cost price.",
      "Calculating discount on cost price instead of marked price."
    ]
  },

  "time-and-work": {
    topicId: "time-and-work",
    title: "Time and Work",
    category: "quantitative",
    introduction: "Time and Work problems revolve around the inverse relationship between the time taken and the work rate/efficiency of agents.",
    concepts: [
      {
        heading: "The Unitary Work Rate",
        body: "If a person completes a total job in n days, the fraction of work done per day is 1/n. Conversely, if 1-day work is 1/n, total days required = n."
      },
      {
        heading: "Combined Work Method",
        body: "When persons work together, their individual 1-day rates are added: Total Rate = Rate A + Rate B."
      }
    ],
    formulas: [
      { name: "1-Day Work", formula: "Work per day = 1 / Total Days" },
      { name: "Combined Time (Two Persons)", formula: "Time = (A × B) / (A + B)" },
      { name: "Efficiency Ratio", formula: "Work = Efficiency × Time" }
    ],
    solvedExamples: [
      {
        problem: "P completes a work in 10 days and Q in 15 days. How long will they take working together?",
        solution: "Combined 1-day work = 1/10 + 1/15 = 5/30 = 1/6.\nTotal days required = 6 days.\nUsing shortcut: (10 × 15) / (10 + 15) = 150 / 25 = 6 days."
      }
    ],
    commonMistakes: [
      "Adding days directly (10 + 15 = 25 days) instead of adding the reciprocal rates.",
      "Confusing efficiency with time. If A is twice as efficient as B, A takes half the time of B."
    ]
  },

  "time-speed-distance": {
    topicId: "time-speed-distance",
    title: "Time, Speed and Distance",
    category: "quantitative",
    introduction: "Covers the fundamental kinematics of uniform velocity, relative speeds between moving bodies, train crossings, and river currents.",
    concepts: [
      {
        heading: "Basic Relation & Unit Conversions",
        body: "Distance = Speed × Time. To convert km/h to m/s, multiply by 5/18. To convert m/s to km/h, multiply by 18/5."
      },
      {
        heading: "Relative Speed",
        body: "When two bodies move towards each other, Relative Speed = S1 + S2. When moving in the same direction, Relative Speed = |S1 - S2|."
      }
    ],
    formulas: [
      { name: "Speed Formula", formula: "Speed = Distance / Time" },
      { name: "Unit Conversion (km/h to m/s)", formula: "1 km/h = 5/18 m/s" },
      { name: "Average Speed (Equal Distances)", formula: "Avg Speed = 2uv / (u + v)" }
    ],
    solvedExamples: [
      {
        problem: "Convert 54 km/h to meters per second.",
        solution: "54 × (5/18) = 3 × 5 = 15 m/s."
      }
    ],
    commonMistakes: [
      "Forgetting to convert units (e.g., using km/h with seconds without conversion).",
      "Using simple arithmetic average (u + v)/2 for round trips instead of harmonic mean 2uv/(u+v)."
    ]
  },

  // Logical Concepts
  "number-series": {
    topicId: "number-series",
    title: "Number Series",
    category: "logical",
    introduction: "Number series questions test pattern discovery in arithmetic, geometric, alternating, and polynomial sequences.",
    concepts: [
      {
        heading: "Common Sequence Types",
        body: "1. Common Difference (AP): Constant gap between terms.\n2. Common Ratio (GP): Multiplied by constant factor.\n3. Difference of Differences: Quadratic sequences like n^2 + n.\n4. Prime numbers, squares, and cubes sequences."
      }
    ],
    formulas: [
      { name: "Arithmetic Gap", formula: "Tn = a + (n - 1)d" },
      { name: "Square Numbers", formula: "1, 4, 9, 16, 25, 36, 49, 64..." },
      { name: "Cube Numbers", formula: "1, 8, 27, 64, 125, 216..." }
    ],
    solvedExamples: [
      {
        problem: "Find the next term in 3, 7, 15, 31, ?",
        solution: "Examine difference: 4, 8, 16. Each difference doubles. Next difference is 32. 31 + 32 = 63. (Alternatively: 2n + 1: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63)."
      }
    ],
    commonMistakes: [
      "Stopping at the first level of differences without checking second-order differences.",
      "Overlooking alternating two-stream intertwined series."
    ]
  },

  "syllogisms": {
    topicId: "syllogisms",
    title: "Syllogisms",
    category: "logical",
    introduction: "Syllogisms test categorical deductive reasoning. Draw Venn diagrams strictly matching premises without relying on real-world knowledge.",
    concepts: [
      {
        heading: "Universal vs Particular Propositions",
        body: "A-type: 'All A are B' (Subset).\nE-type: 'No A are B' (Disjoint sets).\nI-type: 'Some A are B' (Overlapping intersection).\nO-type: 'Some A are not B'."
      }
    ],
    formulas: [
      { name: "Venn Rule", formula: "A conclusion must be valid in ALL possible diagrams to be definitively true." }
    ],
    solvedExamples: [
      {
        problem: "Premises: All roses are flowers. All flowers are plants. Conclusion: Are all roses plants?",
        solution: "Yes. Since Rose set is inside Flower set and Flower set is inside Plant set, the Rose set is completely enveloped inside the Plant set."
      }
    ],
    commonMistakes: [
      "Assuming 'Some A are B' implies 'Some A are not B' (in formal logic, 'Some' means 'at least one', possibly all).",
      "Treating real-world truths as logical constraints (e.g., if premise says 'All dogs are birds', accept it as factual premise)."
    ]
  },

  // Verbal Concepts
  "error-spotting": {
    topicId: "error-spotting",
    title: "Error Spotting",
    category: "verbal",
    introduction: "Tests mastery of English grammatical precision, subject-verb agreement, tense consistency, and correct prepositional usage.",
    concepts: [
      {
        heading: "Subject-Verb Agreement",
        body: "Singular subjects take singular verbs; plural subjects take plural verbs. Watch out for parenthetical phrases ('accompanied by', 'as well as', 'together with') which do not change the subject number."
      },
      {
        heading: "Correlative Conjunctions",
        body: "Ensure pairs match properly: Either...or; Neither...nor; Not only...but also; Hardly/Scarcely...when; No sooner...than."
      }
    ],
    formulas: [
      { name: "Proximity Rule", formula: "Neither [Singular] nor [Plural] -> Plural Verb" },
      { name: "Each / Everyone", formula: "'Each of the [Plural Noun]' takes a Singular Verb" }
    ],
    solvedExamples: [
      {
        problem: "Spot the error: 'Each of the participants were awarded a certificate.'",
        solution: "'Each' is an indefinite pronoun that is singular. The correct verb is 'was', not 'were': 'Each of the participants was awarded a certificate.'"
      }
    ],
    commonMistakes: [
      "Matching the verb to the nearest plural noun inside a prepositional phrase rather than the actual sentence subject.",
      "Pairing 'Hardly' with 'than' instead of 'when'."
    ]
  },

  "reading-comprehension": {
    topicId: "reading-comprehension",
    title: "Reading Comprehension",
    category: "verbal",
    introduction: "Evaluates your ability to understand complex arguments, infer implicit conclusions, identify the author's tone, and extract key facts.",
    concepts: [
      {
        heading: "Active Reading Technique",
        body: "1. Read the first and last paragraph closely for central thesis.\n2. Note transition keywords (However, Consequently, Furthermore).\n3. Match question keywords directly with passage text."
      }
    ],
    formulas: [
      { name: "Central Idea Rule", formula: "Look for recurring themes across introductory and concluding paragraphs." }
    ],
    solvedExamples: [
      {
        problem: "How to differentiate between directly stated facts and inferences?",
        solution: "A fact is explicitly mentioned verbatim in the passage. An inference is a logically necessary deduction supported by evidence but not stated in exact words."
      }
    ],
    commonMistakes: [
      "Selecting an option based on outside knowledge that is contradicted or unsupported by the author's passage.",
      "Choosing options with extreme generalizations like 'always', 'never', or 'completely' unless explicitly stated."
    ]
  }
};

/**
 * Fallback helper to provide clean concept guide for any topic
 */
export const getConceptByTopicId = (topicId, topicMeta = {}) => {
  if (TOPIC_CONCEPTS[topicId]) {
    return TOPIC_CONCEPTS[topicId];
  }

  const name = topicMeta.name || topicId.replace(/-/g, " ");
  const cat = topicMeta.category || "quantitative";

  return {
    topicId,
    title: name,
    category: cat,
    introduction: `Comprehensive concept guide for ${name}. Master the fundamental rules, key equations, and standard problem patterns to score high on campus recruitment aptitude tests.`,
    concepts: [
      {
        heading: "Core Principles",
        body: `Understanding the mathematical and logical fundamentals of ${name}. Break down complex word problems into clear sequential steps.`
      },
      {
        heading: "Systematic Approach",
        body: "Read the problem statement attentively, identify known variables and constraints, apply standard theorems, and verify edge cases before finalizing."
      }
    ],
    formulas: [
      { name: "Standard Formula", formula: "Apply core properties and identity relationships for " + name }
    ],
    solvedExamples: [
      {
        problem: `Sample benchmark problem for ${name}`,
        solution: "Carefully structure the variables, apply the governing rules step by step, and simplify to obtain the result."
      }
    ],
    commonMistakes: [
      "Rushing into calculations before reading units and negative constraints.",
      "Skipping verification of boundary conditions."
    ]
  };
};
