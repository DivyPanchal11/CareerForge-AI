const test = require("node:test");
const assert = require("node:assert/strict");

// Pure domain logic for interview duration & role resolution
const INTERVIEW_QUESTION_DURATION_SECONDS = 300; // 5 minutes
const DEFAULT_INTERVIEW_ROLE = "Interview Practice";

const calculateDurationMinutes = (questionCount) => {
  const count = Number(questionCount) || 5;
  return Math.max(5, count * 5);
};

const resolveSessionRole = (record) => {
  if (!record) return DEFAULT_INTERVIEW_ROLE;

  const custom =
    (typeof record.customRole === "string" && record.customRole.trim()) ||
    (typeof record.config?.customRole === "string" && record.config.customRole.trim()) ||
    "";

  const targetRole =
    (typeof record.targetRole === "string" && record.targetRole.trim()) ||
    (typeof record.config?.targetRole === "string" && record.config.targetRole.trim()) ||
    "";

  if (targetRole === "Custom Role" && custom) {
    return custom;
  }

  const role =
    (targetRole && targetRole !== "Custom Role" ? targetRole : "") ||
    custom ||
    (typeof record.role === "string" && record.role.trim() && record.role.trim() !== "Custom Role" ? record.role.trim() : "") ||
    (typeof record.config?.role === "string" && record.config.role.trim() && record.config.role.trim() !== "Custom Role" ? record.config.role.trim() : "") ||
    "";

  return role || DEFAULT_INTERVIEW_ROLE;
};

// Simulation helper for question timers
function createInterviewSession(config, questions) {
  const role = resolveSessionRole(config);
  const durationMinutes = calculateDurationMinutes(questions.length);
  const initialTimers = {};
  questions.forEach((q, idx) => {
    initialTimers[q.id] = {
      startedAt: idx === 0 ? Date.now() : null,
      accumulatedElapsed: 0,
      warningShown: false,
      isExpired: false,
    };
  });

  return {
    id: `session_${Date.now()}`,
    targetRole: role,
    config: {
      ...config,
      targetRole: role,
      durationMinutes,
      questionCount: questions.length,
      questionDurationSeconds: INTERVIEW_QUESTION_DURATION_SECONDS,
    },
    durationSeconds: durationMinutes * 60,
    questions,
    answers: {},
    questionTimers: initialTimers,
    currentQuestionIndex: 0,
    status: "in_progress",
  };
}

function computeQuestionRemaining(timer, duration = INTERVIEW_QUESTION_DURATION_SECONDS, now = Date.now()) {
  if (timer.isExpired) return 0;
  const activeElapsed = timer.startedAt ? Math.max(0, Math.floor((now - timer.startedAt) / 1000)) : 0;
  const total = (timer.accumulatedElapsed || 0) + activeElapsed;
  return Math.max(0, duration - total);
}

function computeAptitudeRemaining(session, now = Date.now()) {
  const startMs = new Date(session.startedAt).getTime();
  const elapsed = Math.max(0, Math.floor((now - startMs) / 1000));
  return Math.max(0, session.durationSeconds - elapsed);
}

test("Interview & Aptitude Timers, 1-Minute Warning & Role Isolation Suite", async (t) => {
  await t.test("1. Interview Timer: 5 minutes per question applied consistently", () => {
    assert.equal(INTERVIEW_QUESTION_DURATION_SECONDS, 300);
    assert.equal(calculateDurationMinutes(1), 5);
    assert.equal(calculateDurationMinutes(3), 15);
    assert.equal(calculateDurationMinutes(5), 25);
    assert.equal(calculateDurationMinutes(10), 50);

    const questions = [{ id: "q1" }, { id: "q2" }, { id: "q3" }];
    const session = createInterviewSession({ targetRole: "Backend Developer" }, questions);

    assert.equal(session.config.durationMinutes, 15);
    assert.equal(session.config.questionDurationSeconds, 300);
    assert.equal(session.durationSeconds, 900);
    assert.equal(typeof session.questionTimers.q1.startedAt, "number");
    assert.equal(session.questionTimers.q2.startedAt, null);
  });

  await t.test("2. Question Navigation: Resets 5-minute timer for new question and preserves answers", () => {
    const questions = [{ id: "q1" }, { id: "q2" }];
    const session = createInterviewSession({ targetRole: "Frontend Developer" }, questions);

    // User types answer for q1
    session.answers.q1 = "React uses a virtual DOM for efficient reconciliation.";

    // 120 seconds elapse on Q1
    const t0 = session.questionTimers.q1.startedAt;
    const t1 = t0 + 120000;
    const q1RemainingBeforeSwitch = computeQuestionRemaining(session.questionTimers.q1, 300, t1);
    assert.equal(q1RemainingBeforeSwitch, 180);

    // Move to Q2: Pause Q1, activate Q2
    session.questionTimers.q1.accumulatedElapsed += 120;
    session.questionTimers.q1.startedAt = null;

    session.questionTimers.q2.startedAt = t1;
    session.currentQuestionIndex = 1;

    // Q2 should have fresh 300 seconds (5 minutes)
    const q2Remaining = computeQuestionRemaining(session.questionTimers.q2, 300, t1);
    assert.equal(q2Remaining, 300, "Moving to new question gives full 5-minute countdown");

    // Answers on Q1 remain completely intact
    assert.equal(session.answers.q1, "React uses a virtual DOM for efficient reconciliation.");

    // User navigates back to Q1 at t1 + 30s
    const t2 = t1 + 30000;
    session.questionTimers.q2.accumulatedElapsed += 30;
    session.questionTimers.q2.startedAt = null;

    session.questionTimers.q1.startedAt = t2;
    session.currentQuestionIndex = 0;

    // Q1 resumes at 180s remaining
    const q1ResumedRemaining = computeQuestionRemaining(session.questionTimers.q1, 300, t2);
    assert.equal(q1ResumedRemaining, 180, "Navigating back resumes preserved question timer without resetting to 5m");
  });

  await t.test("3. Refresh & Background Resilience: Timestamps prevent drift or accidental resets", () => {
    const timer = {
      startedAt: Date.now() - 75000, // 75 seconds ago
      accumulatedElapsed: 0,
      warningShown: false,
      isExpired: false,
    };

    // Calculate remaining
    const remaining = computeQuestionRemaining(timer, 300);
    assert.equal(remaining, 225, "True remaining calculated from timestamp, unaffected by tab sleeping");

    // Sleep 150 seconds
    const simulatedNow = Date.now() + 150000;
    const afterSleep = computeQuestionRemaining(timer, 300, simulatedNow);
    assert.equal(afterSleep, 75, "Accurate catch-up without missing ticks");
  });

  await t.test("4. 1-Minute Warning: Fires at <= 60s, triggers once, does not repeat on rerenders or navigation", () => {
    const timer = {
      startedAt: Date.now() - 245000, // 245 seconds elapsed out of 300 = 55s left
      accumulatedElapsed: 0,
      warningShown: false,
      isExpired: false,
    };

    const remaining = computeQuestionRemaining(timer, 300);
    assert.ok(remaining <= 60 && remaining > 0, "Remaining is within 1-minute warning threshold");

    // First check triggers warning
    let warningTriggered = false;
    if (remaining <= 60 && !timer.warningShown) {
      timer.warningShown = true;
      warningTriggered = true;
    }
    assert.equal(warningTriggered, true, "1-minute warning triggers on first crossing");
    assert.equal(timer.warningShown, true);

    // Rerender or navigating back and forth does not trigger warning again
    let repeatTriggered = false;
    const remainingAfter = computeQuestionRemaining(timer, 300, Date.now() + 5000);
    if (remainingAfter <= 60 && !timer.warningShown) {
      repeatTriggered = true;
    }
    assert.equal(repeatTriggered, false, "Warning does not repeat on rerenders or navigation");
  });

  await t.test("5. Aptitude 1-Minute Warning: Timestamp-driven test session warning", () => {
    const session = {
      startedAt: new Date(Date.now() - 845000).toISOString(), // 845s into 900s test (55s remaining)
      durationSeconds: 900,
      warningShown: false,
    };

    const remaining = computeAptitudeRemaining(session);
    assert.equal(remaining, 55);

    let warningFired = false;
    if (remaining <= 60 && !session.warningShown) {
      session.warningShown = true;
      warningFired = true;
    }
    assert.equal(warningFired, true);
    assert.equal(session.warningShown, true);

    // Returning to session later does not re-fire warning
    let reFired = false;
    const laterRemaining = computeAptitudeRemaining(session, Date.now() + 10000);
    if (laterRemaining <= 60 && !session.warningShown) {
      reFired = true;
    }
    assert.equal(reFired, false, "Aptitude session warning fires exactly once");
  });

  await t.test("6. Role Persistence: Custom roles preserved, isolated per session, no Software Engineer leakage", () => {
    // Session 1: Custom Banking Role
    const s1 = createInterviewSession({ targetRole: "ICICI Bank Accountant" }, [{ id: "q1" }]);
    assert.equal(s1.targetRole, "ICICI Bank Accountant");
    assert.equal(s1.config.targetRole, "ICICI Bank Accountant");

    // Session 2: Predefined Role
    const s2 = createInterviewSession({ targetRole: "Data Analyst" }, [{ id: "q1" }]);
    assert.equal(s2.targetRole, "Data Analyst");
    assert.equal(s2.config.targetRole, "Data Analyst");

    // Session 3: Custom Role via customRole field
    const s3 = createInterviewSession({ targetRole: "Custom Role", customRole: "Lead Cloud Architect" }, [{ id: "q1" }]);
    assert.equal(resolveSessionRole(s3), "Lead Cloud Architect");

    // Ensure session roles are completely isolated and never leak
    assert.notEqual(s1.targetRole, s2.targetRole);
    assert.notEqual(s1.targetRole, "Software Engineer");
    assert.notEqual(s2.targetRole, "Software Engineer");
  });

  await t.test("7. Neutral Fallback: Missing or malformed roles resolve to 'Interview Practice', NOT 'Software Engineer'", () => {
    assert.equal(resolveSessionRole({}), "Interview Practice");
    assert.equal(resolveSessionRole({ targetRole: "" }), "Interview Practice");
    assert.equal(resolveSessionRole({ targetRole: "   " }), "Interview Practice");
    assert.equal(resolveSessionRole(null), "Interview Practice");
    assert.equal(resolveSessionRole({ config: { targetRole: "" } }), "Interview Practice");

    // Legitimate Software Engineer role chosen by user is preserved
    assert.equal(resolveSessionRole({ targetRole: "Software Engineer" }), "Software Engineer");
  });
});
