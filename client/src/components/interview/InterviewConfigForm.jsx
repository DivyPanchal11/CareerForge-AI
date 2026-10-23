import { useState, useId } from "react";
import {
  INTERVIEW_TYPES,
  TARGET_ROLES,
  EXPERIENCE_LEVELS,
  QUESTION_COUNT_OPTIONS,
  calculateDurationMinutes,
} from "../../constants/interviewConstants";
import {
  Clock,
  Sparkles,
  ArrowRight,
  Loader2,
  FileText,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info,
  HelpCircle,
  AlertCircle,
  Coins,
  ShieldCheck,
} from "lucide-react";
import { formatLocalResetTime } from "../../utils/creditTimeUtils";

function InterviewConfigForm({ onStartInterview, isStarting = false, aiConfig = null }) {
  const customRoleId = useId();
  const customExpId = useId();
  const skillsId = useId();
  const jobDescId = useId();
  const targetRoleSelectId = useId();

  const [config, setConfig] = useState({
    interviewType: "technical",
    targetRole: "Frontend Developer",
    customRole: "",
    experienceLevel: "entry",
    customExperience: "",
    difficulty: "intermediate",
    questionCount: 5,
    skills: "",
    jobDescription: "",
  });

  const [showJobDescription, setShowJobDescription] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  const costPerQuestion = aiConfig?.creditPricing?.costPerQuestion || 2;
  const questionCountNum = Number(config.questionCount) || 5;
  const creditCost = questionCountNum * costPerQuestion;
  const userBalance = aiConfig?.userCredits?.balance ?? null;
  const nextResetIso = aiConfig?.userCredits?.nextReset || aiConfig?.creditPricing?.nextReset;
  const localResetTime = formatLocalResetTime(nextResetIso);
  const isInsufficient = userBalance !== null && userBalance < creditCost;

  const estimatedDuration = calculateDurationMinutes(
    config.questionCount,
    config.difficulty
  );

  const handleTypeSelect = (typeId) => {
    setConfig((prev) => ({ ...prev, interviewType: typeId }));
    if (errors.interviewType) {
      setErrors((prev) => ({ ...prev, interviewType: "" }));
    }
  };

  const handleRoleChange = (e) => {
    const val = e.target.value;
    setConfig((prev) => ({
      ...prev,
      targetRole: val,
      customRole: val === "Custom Role" ? prev.customRole : "",
    }));
    if (errors.targetRole || errors.customRole) {
      setErrors((prev) => ({ ...prev, targetRole: "", customRole: "" }));
    }
  };

  const handleExperienceChange = (expId) => {
    setConfig((prev) => ({
      ...prev,
      experienceLevel: expId,
      customExperience: expId === "custom" ? prev.customExperience : "",
    }));
    if (errors.experienceLevel || errors.customExperience) {
      setErrors((prev) => ({ ...prev, experienceLevel: "", customExperience: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!config.targetRole) {
      errs.targetRole = "Please select or enter your target role.";
    }
    if (config.targetRole === "Custom Role" && !config.customRole.trim()) {
      errs.customRole = "Please specify your custom target role.";
    }
    if (!config.experienceLevel) {
      errs.experienceLevel = "Please choose your experience level.";
    }
    if (config.experienceLevel === "custom" && !config.customExperience.trim()) {
      errs.customExperience = "Please describe your custom experience level.";
    }
    if (!config.interviewType) {
      errs.interviewType = "Please select an interview type.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isStarting) return;

    const chosenRole = config.targetRole === "Custom Role" ? config.customRole.trim() : config.targetRole;
    const cleanRole = chosenRole || "Interview Practice";

    const payload = {
      targetRole: cleanRole,
      customRole: config.targetRole === "Custom Role" ? config.customRole.trim() : "",
      experienceLevel: config.experienceLevel === "custom" ? config.customExperience.trim() : config.experienceLevel,
      interviewType: config.interviewType,
      difficulty: config.difficulty,
      questionCount: questionCountNum,
      skills: config.skills.trim(),
      jobDescription: config.jobDescription.trim(),
      durationMinutes: estimatedDuration,
    };

    setPendingPayload(payload);
    setShowConfirmModal(true);
  };

  const handleConfirmGeneration = () => {
    if (!pendingPayload || isStarting) return;
    setShowConfirmModal(false);
    onStartInterview(pendingPayload);
  };

  const activeRoleName = config.targetRole === "Custom Role"
    ? config.customRole.trim() || "Custom Role"
    : config.targetRole;

  const activeExpName = config.experienceLevel === "custom"
    ? config.customExperience.trim() || "Custom Experience"
    : EXPERIENCE_LEVELS.find((e) => e.id === config.experienceLevel)?.label || "Entry-level";

  const activeTypeName = INTERVIEW_TYPES.find((t) => t.id === config.interviewType)?.label || "Technical";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Step 1 of 2 • Interview Setup
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Configure Your Practice Session
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Customize the role, seniority, and focus areas to generate relevant, real-world mock interview questions.
          </p>
        </div>

        {/* AI Model Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 w-fit">
          <Sparkles size={14} className="text-amber-500 shrink-0" />
          <span>
            {aiConfig?.model ? `AI: ${aiConfig.model}` : "Google Gemini AI Evaluator"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-7" noValidate>
        {/* 1. Target Role & Custom Role */}
        <section aria-labelledby="role-section-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              id="role-section-heading"
              htmlFor={targetRoleSelectId}
              className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5"
            >
              <Briefcase size={14} className="text-gray-500" />
              <span>Target Role</span>
              <span className="text-red-500 font-bold" title="Required">*</span>
            </label>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
              Required
            </span>
          </div>

          <p className="text-[11px] text-gray-500 leading-normal">
            Select a common technology role or choose "Custom Role" to enter any specific position.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <select
                id={targetRoleSelectId}
                name="targetRole"
                value={config.targetRole}
                onChange={handleRoleChange}
                disabled={isStarting}
                aria-invalid={Boolean(errors.targetRole)}
                className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 outline-none transition focus-visible:ring-2 focus-visible:ring-black cursor-pointer ${
                  errors.targetRole ? "border-red-400 bg-red-50/20" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {config.targetRole === "Custom Role" && (
              <div>
                <input
                  id={customRoleId}
                  type="text"
                  name="customRole"
                  value={config.customRole}
                  onChange={handleInputChange}
                  disabled={isStarting}
                  placeholder="e.g. Cloud Security Architect, FinTech Product Manager"
                  aria-invalid={Boolean(errors.customRole)}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 outline-none transition focus-visible:ring-2 focus-visible:ring-black ${
                    errors.customRole ? "border-red-400 bg-red-50/40" : "border-gray-200 bg-white"
                  }`}
                />
                {errors.customRole && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.customRole}
                  </p>
                )}
              </div>
            )}
          </div>
          {errors.targetRole && (
            <p className="text-[11px] text-red-500 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.targetRole}
            </p>
          )}
        </section>

        {/* 2. Experience Level */}
        <section aria-labelledby="exp-section-heading" className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span
              id="exp-section-heading"
              className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5"
            >
              <Layers size={14} className="text-gray-500" />
              <span>Experience Level</span>
              <span className="text-red-500 font-bold" title="Required">*</span>
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
              Required
            </span>
          </div>

          <p className="text-[11px] text-gray-500 leading-normal">
            Calibrates question depth, technical expectations, and seniority scoring rubrics.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" role="radiogroup" aria-labelledby="exp-section-heading">
            {EXPERIENCE_LEVELS.map((exp) => {
              const isSelected = config.experienceLevel === exp.id;
              return (
                <button
                  key={exp.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isStarting}
                  onClick={() => handleExperienceChange(exp.id)}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    isSelected
                      ? "border-black bg-gray-50 ring-1 ring-black shadow-2xs"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? "text-black" : "text-gray-900"}`}>
                      {exp.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={13} className="text-black" />
                    )}
                  </div>
                  <span className="block text-[10px] text-gray-500 leading-snug">
                    {exp.subtext}
                  </span>
                </button>
              );
            })}
          </div>

          {config.experienceLevel === "custom" && (
            <div className="mt-2">
              <input
                id={customExpId}
                type="text"
                name="customExperience"
                value={config.customExperience}
                onChange={handleInputChange}
                disabled={isStarting}
                placeholder="e.g. 6 years backend, transitioning to full stack leadership"
                aria-invalid={Boolean(errors.customExperience)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 outline-none transition focus-visible:ring-2 focus-visible:ring-black ${
                  errors.customExperience ? "border-red-400 bg-red-50/40" : "border-gray-200 bg-white"
                }`}
              />
              {errors.customExperience && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.customExperience}
                </p>
              )}
            </div>
          )}
          {errors.experienceLevel && (
            <p className="text-[11px] text-red-500 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.experienceLevel}
            </p>
          )}
        </section>

        {/* 3. Interview Type */}
        <section aria-labelledby="type-section-heading" className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span
              id="type-section-heading"
              className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5"
            >
              <HelpCircle size={14} className="text-gray-500" />
              <span>Interview Type</span>
              <span className="text-red-500 font-bold" title="Required">*</span>
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
              Required
            </span>
          </div>

          <p className="text-[11px] text-gray-500 leading-normal">
            Choose what type of evaluation you want to focus on.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="radiogroup" aria-labelledby="type-section-heading">
            {INTERVIEW_TYPES.map((type) => {
              const isSelected = config.interviewType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isStarting}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    isSelected
                      ? "border-black bg-gray-50 ring-1 ring-black shadow-xs"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-900">{type.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-gray-100 text-gray-700">
                        {type.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center gap-1 text-[10px] font-bold text-black">
                      <CheckCircle2 size={12} />
                      <span>Selected format</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {errors.interviewType && (
            <p className="text-[11px] text-red-500 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.interviewType}
            </p>
          )}
        </section>

        {/* 4. Skills & Focus Areas (Optional) */}
        <section aria-labelledby="skills-heading" className="space-y-2 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label htmlFor={skillsId} id="skills-heading" className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Focus Skills & Tools</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-semibold uppercase">
                Optional
              </span>
            </label>
          </div>
          <p className="text-[11px] text-gray-500">
            Specify particular libraries, cloud platforms, or domains you want questions to focus on.
          </p>
          <input
            id={skillsId}
            type="text"
            name="skills"
            value={config.skills}
            onChange={handleInputChange}
            disabled={isStarting}
            placeholder="e.g. React 19, TypeScript, PostgreSQL, AWS Lambda, System Design, Team Mentorship"
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition focus-visible:ring-2 focus-visible:ring-black"
          />
        </section>

        {/* 5. Optional Job Description Context (Collapsible) */}
        <section className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
          <button
            type="button"
            onClick={() => setShowJobDescription((prev) => !prev)}
            aria-expanded={showJobDescription}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-gray-100/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <div className="flex items-center gap-2.5">
              <FileText size={16} className="text-gray-600" />
              <div>
                <span className="text-xs font-bold text-gray-900 block">
                  Target Job Description Context
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Paste real job responsibilities to align questions with specific employer requirements.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 font-semibold">
                Optional
              </span>
              {showJobDescription ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
            </div>
          </button>

          {showJobDescription && (
            <div className="p-4 pt-2 border-t border-gray-200 bg-white space-y-2">
              <label htmlFor={jobDescId} className="block text-[11px] font-semibold text-gray-700">
                Paste Job Listing Requirements
              </label>
              <textarea
                id={jobDescId}
                name="jobDescription"
                rows={4}
                value={config.jobDescription}
                onChange={handleInputChange}
                disabled={isStarting}
                placeholder="Paste the core responsibilities or qualifications. Gemini AI will evaluate against these real requirements without inventing artificial constraints."
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition focus:bg-white focus-visible:ring-2 focus-visible:ring-black leading-relaxed"
              />
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>Maximum 4,000 characters</span>
                <span className={config.jobDescription.length > 3800 ? "text-amber-600 font-bold" : ""}>
                  {config.jobDescription.length} / 4000
                </span>
              </div>
            </div>
          )}
        </section>

        {/* 6. Question Count & Duration Pacing */}
        <section aria-labelledby="pacing-heading" className="p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <label id="pacing-heading" className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Question Count
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 font-semibold">
                Pacing
              </span>
            </div>
            <div className="flex items-center gap-2" role="group" aria-label="Question count options">
              {QUESTION_COUNT_OPTIONS.map((num) => (
                <button
                  key={num}
                  type="button"
                  disabled={isStarting}
                  onClick={() => setConfig((prev) => ({ ...prev, questionCount: num }))}
                  aria-pressed={config.questionCount === num}
                  className={`w-11 h-9 rounded-lg text-xs font-bold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    config.questionCount === num
                      ? "bg-black text-white shadow-2xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2.5 text-xs text-gray-700 bg-white px-3.5 py-2.5 rounded-xl border border-gray-200">
              <Clock size={16} className="text-gray-500 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Estimated Session Time</span>
                <span className="font-bold text-gray-900">~{estimatedDuration} minutes</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-gray-700 bg-white px-3.5 py-2.5 rounded-xl border border-gray-200">
              <Coins size={16} className="text-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Application Credits</span>
                <span className="font-bold text-gray-900">
                  {creditCost} credits {userBalance !== null ? `(${userBalance} available)` : ""}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Session Configuration Overview Banner */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
          <Info size={16} className="text-gray-700 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-900 block mb-0.5">
              Session Overview:
            </span>
            <span>
              Practicing for <strong className="text-gray-900">{activeRoleName}</strong> (
              <strong className="text-gray-900">{activeExpName}</strong>) in a{" "}
              <strong className="text-gray-900">{activeTypeName}</strong> format with{" "}
              <strong className="text-gray-900">{config.questionCount} questions</strong> (~{estimatedDuration} mins) • Cost: <strong className="text-gray-900">{creditCost} credits</strong>.
            </span>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-gray-100">
          <button
            type="submit"
            disabled={isStarting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-900 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-98 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
          >
            {isStarting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Preparing Your Interview Session...</span>
              </>
            ) : (
              <>
                <span>Start Practice Session</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generation Confirmation & Insufficient Credit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
            {isInsufficient ? (
              <>
                <div className="flex items-center gap-3 text-red-600">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <AlertCircle size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Insufficient Daily Credits
                    </h3>
                    <span className="text-[11px] text-red-600 font-medium">
                      Generation requires {creditCost} credits
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Balance:</span>
                    <span className="font-bold text-gray-900">{userBalance} credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Required for {config.questionCount} questions:</span>
                    <span className="font-bold text-red-600">{creditCost} credits</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200">
                    <span className="text-gray-500">Next Daily Reset:</span>
                    <span className="font-bold text-gray-900">{localResetTime}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Daily allowances reset deterministically at 00:00 UTC ({localResetTime} in your local timezone). You can adjust your question count or wait for the next reset.
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-900 transition cursor-pointer"
                  >
                    Adjust Options
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-gray-900">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Coins size={22} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Confirm Question Generation
                    </h3>
                    <span className="text-[11px] text-gray-500">
                      Application credit confirmation
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target Role:</span>
                    <span className="font-bold text-gray-900">{activeRoleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Interview Type:</span>
                    <span className="font-bold text-gray-900">{activeTypeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Question Count:</span>
                    <span className="font-bold text-gray-900">{config.questionCount} questions</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200">
                    <span className="text-gray-700 font-semibold">Total Credit Cost:</span>
                    <span className="font-extrabold text-black">{creditCost} credits</span>
                  </div>
                  {userBalance !== null && (
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Balance after generation:</span>
                      <span>{userBalance - creditCost} credits</span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2 text-[11px] text-gray-500 leading-relaxed">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Safe reservation: Credits are only deducted upon successful AI question generation. If any error or timeout occurs, your credits are refunded immediately.
                  </span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmGeneration}
                    className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-900 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Confirm & Start ({creditCost} Credits)</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewConfigForm;
