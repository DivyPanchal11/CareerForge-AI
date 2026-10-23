/**
 * Verified Verbal Ability Questions Dataset
 * Topics covered:
 * Grammar, Vocabulary, Synonyms and Antonyms, Sentence Correction, Error Spotting,
 * Fill in the Blanks, Sentence Completion, Para Jumbles, Reading Comprehension (with passage),
 * Idioms and Phrases, One-word Substitution.
 */

export const VERBAL_QUESTIONS = [
  // --- Grammar ---
  {
    id: "vrb-grm-001",
    category: "verbal",
    topic: "grammar",
    topicName: "Grammar",
    difficulty: "medium",
    type: "mcq",
    question: "Choose the grammatically correct sentence:",
    options: [
      { id: "a", text: "Neither the manager nor the employees was present in the meeting." },
      { id: "b", text: "Neither the manager nor the employees were present in the meeting." },
      { id: "c", text: "Neither the manager or the employees were present in the meeting." },
      { id: "d", text: "Neither of the manager nor the employees were present in the meeting." },
    ],
    correctOptionId: "b",
    explanation: "Under the rule of proximity with 'neither...nor', the verb agrees with the subject closest to it. 'Employees' is plural, so the plural verb 'were' is required."
  },

  // --- Vocabulary ---
  {
    id: "vrb-voc-001",
    category: "verbal",
    topic: "vocabulary",
    topicName: "Vocabulary",
    difficulty: "medium",
    type: "mcq",
    question: "Select the word that best completes the sentence: 'The CEO's ______ remarks during the town hall reassured anxious investors.'",
    options: [
      { id: "a", text: "evasive" },
      { id: "b", text: "lucid" },
      { id: "c", text: "pedantic" },
      { id: "d", text: "ambiguous" },
    ],
    correctOptionId: "b",
    explanation: "'Lucid' means expressed clearly and easy to understand. Clear explanations soothe anxiety, whereas evasive or ambiguous remarks exacerbate it."
  },

  // --- Synonyms and Antonyms ---
  {
    id: "vrb-syn-001",
    category: "verbal",
    topic: "synonyms-and-antonyms",
    topicName: "Synonyms and Antonyms",
    difficulty: "easy",
    type: "mcq",
    question: "Find the antonym of the word 'METICULOUS':",
    options: [
      { id: "a", text: "Careless" },
      { id: "b", text: "Fastidious" },
      { id: "c", text: "Scrupulous" },
      { id: "d", text: "Methodical" },
    ],
    correctOptionId: "a",
    explanation: "'Meticulous' means showing great attention to detail and thoroughness. Its opposite is 'Careless'."
  },
  {
    id: "vrb-syn-002",
    category: "verbal",
    topic: "synonyms-and-antonyms",
    topicName: "Synonyms and Antonyms",
    difficulty: "medium",
    type: "mcq",
    question: "Find the closest synonym for 'CANDID':",
    options: [
      { id: "a", text: "Secretive" },
      { id: "b", text: "Frank" },
      { id: "c", text: "Deceitful" },
      { id: "d", text: "Cautious" },
    ],
    correctOptionId: "b",
    explanation: "'Candid' means truthful, straightforward, and frank."
  },

  // --- Sentence Correction ---
  {
    id: "vrb-cor-001",
    category: "verbal",
    topic: "sentence-correction",
    topicName: "Sentence Correction",
    difficulty: "medium",
    type: "mcq",
    question: "Improve the bracketed part: 'Hardly had he entered the room [when the lights went out].'",
    options: [
      { id: "a", text: "than the lights went out" },
      { id: "b", text: "when the lights went out (No improvement needed)" },
      { id: "c", text: "then the lights went out" },
      { id: "d", text: "since the lights went out" },
    ],
    correctOptionId: "b",
    explanation: "The correlative conjunction 'Hardly... when' is grammatically correct. 'Hardly' is always paired with 'when', whereas 'No sooner' takes 'than'."
  },

  // --- Error Spotting ---
  {
    id: "vrb-err-001",
    category: "verbal",
    topic: "error-spotting",
    topicName: "Error Spotting",
    difficulty: "medium",
    type: "mcq",
    question: "Identify the part of the sentence containing an error: (A) One of the players / (B) have forgotten / (C) their kit bag / (D) in the locker room.",
    options: [
      { id: "a", text: "(A)" },
      { id: "b", text: "(B)" },
      { id: "c", text: "(C)" },
      { id: "d", text: "(D)" },
    ],
    correctOptionId: "b",
    explanation: "The subject is 'One', which is singular. Therefore, it requires the singular auxiliary verb 'has' instead of 'have' (One of the players has forgotten...)."
  },

  // --- Fill in the Blanks ---
  {
    id: "vrb-fib-001",
    category: "verbal",
    topic: "fill-in-the-blanks",
    topicName: "Fill in the Blanks",
    difficulty: "easy",
    type: "mcq",
    question: "She persisted ______ pursuing her career despite facing immense obstacles.",
    options: [
      { id: "a", text: "on" },
      { id: "b", text: "in" },
      { id: "c", text: "with" },
      { id: "d", text: "for" },
    ],
    correctOptionId: "b",
    explanation: "The verb 'persist' takes the fixed preposition 'in' (persist in doing something)."
  },

  // --- Sentence Completion ---
  {
    id: "vrb-cmp-001",
    category: "verbal",
    topic: "sentence-completion",
    topicName: "Sentence Completion",
    difficulty: "medium",
    type: "mcq",
    question: "Although the design of the engine was ______, its practical performance proved unexpectedly ______.",
    options: [
      { id: "a", text: "flawed, mediocre" },
      { id: "b", text: "innovative, remarkable" },
      { id: "c", text: "promising, disappointing" },
      { id: "d", text: "conventional, regular" },
    ],
    correctOptionId: "c",
    explanation: "The conjunction 'Although' signals a contrast between expectations and actual outcomes. 'Promising' vs 'disappointing' creates the intended contrasting tension."
  },

  // --- Para Jumbles ---
  {
    id: "vrb-prm-001",
    category: "verbal",
    topic: "para-jumbles",
    topicName: "Para Jumbles",
    difficulty: "hard",
    type: "mcq",
    question: "Rearrange the sentences into a logical sequence:\nP: Renewable energy solutions have gained unprecedented global momentum.\nQ: Consequently, governments worldwide are heavily subsidizing clean technologies.\nR: Climate change has heightened the urgency for sustainable power.\nS: This has accelerated the transition away from fossil fuels.",
    options: [
      { id: "a", text: "R -> P -> Q -> S" },
      { id: "b", text: "P -> R -> S -> Q" },
      { id: "c", text: "Q -> R -> P -> S" },
      { id: "d", text: "R -> Q -> P -> S" },
    ],
    correctOptionId: "a",
    explanation: "R introduces the core root cause (Climate change). P details the response (momentum in renewables). Q gives the policy consequence (subsidies). S provides the ultimate concluding outcome (accelerated transition)."
  },

  // --- Reading Comprehension (with Passage) ---
  {
    id: "vrb-rc-001",
    category: "verbal",
    topic: "reading-comprehension",
    topicName: "Reading Comprehension",
    difficulty: "hard",
    type: "mcq",
    passage: "Artificial Intelligence (AI) has progressed from speculative theoretical research to pervasive real-world applications. Machine learning algorithms process astronomical amounts of data to detect nuanced patterns beyond human bandwidth. However, this algorithmic empowerment introduces ethical quandaries regarding data privacy, algorithmic bias, and the transparency of 'black-box' neural models. Scholars emphasize that technological advancement must be guided by human-centric governance to guarantee equitable outcomes across diverse demographics.",
    question: "According to the passage, what is the primary concern arising from algorithmic empowerment?",
    options: [
      { id: "a", text: "The inability of machines to process large data volumes" },
      { id: "b", text: "Ethical challenges like privacy violations, bias, and lack of model transparency" },
      { id: "c", text: "A complete decline in theoretical research" },
      { id: "d", text: "Excessive governmental regulation stifling AI innovations" },
    ],
    correctOptionId: "b",
    explanation: "The passage explicitly notes that empowerment introduces 'ethical quandaries regarding data privacy, algorithmic bias, and the transparency of black-box models'."
  },
  {
    id: "vrb-rc-002",
    category: "verbal",
    topic: "reading-comprehension",
    topicName: "Reading Comprehension",
    difficulty: "hard",
    type: "mcq",
    passage: "Artificial Intelligence (AI) has progressed from speculative theoretical research to pervasive real-world applications. Machine learning algorithms process astronomical amounts of data to detect nuanced patterns beyond human bandwidth. However, this algorithmic empowerment introduces ethical quandaries regarding data privacy, algorithmic bias, and the transparency of 'black-box' neural models. Scholars emphasize that technological advancement must be guided by human-centric governance to guarantee equitable outcomes across diverse demographics.",
    question: "What do scholars recommend to ensure fair outcomes for all demographics?",
    options: [
      { id: "a", text: "Halting all neural network development permanently" },
      { id: "b", text: "Human-centric governance to guide technological advancement" },
      { id: "c", text: "Allowing algorithms to self-govern without human interference" },
      { id: "d", text: "Eliminating public data access entirely" },
    ],
    correctOptionId: "b",
    explanation: "The final sentence states: 'Scholars emphasize that technological advancement must be guided by human-centric governance to guarantee equitable outcomes across diverse demographics.'"
  },

  // --- Idioms and Phrases ---
  {
    id: "vrb-idm-001",
    category: "verbal",
    topic: "idioms-and-phrases",
    topicName: "Idioms and Phrases",
    difficulty: "easy",
    type: "mcq",
    question: "What does the idiom 'Bite the bullet' mean?",
    options: [
      { id: "a", text: "To avoid facing reality" },
      { id: "b", text: "To endure an inevitable, painful situation with courage" },
      { id: "c", text: "To act in a rash and dangerous manner" },
      { id: "d", text: "To achieve two things at the same time" },
    ],
    correctOptionId: "b",
    explanation: "'Bite the bullet' means to face a difficult or unpleasant situation with courage and fortitude."
  },

  // --- One-word Substitution ---
  {
    id: "vrb-ows-001",
    category: "verbal",
    topic: "one-word-substitution",
    topicName: "One-word Substitution",
    difficulty: "easy",
    type: "mcq",
    question: "A person who is fluent in two languages is termed as:",
    options: [
      { id: "a", text: "Monolingual" },
      { id: "b", text: "Bilingual" },
      { id: "c", text: "Polyglot" },
      { id: "d", text: "Linguist" },
    ],
    correctOptionId: "b",
    explanation: "'Bilingual' refers to someone who speaks two languages fluently. A person speaking many languages is a polyglot."
  }
];
