import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Play,
  BookOpen,
  FileText,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/auth/Navbar";
import { getTopicById, ALL_TOPICS } from "../data/aptitudeTopics";
import { getConceptByTopicId } from "../data/aptitudeConcepts";
import { getFilteredQuestions } from "../services/aptitudeService";

function AptitudeLearn() {
  const { topicId } = useParams();

  // Find topic metadata
  const topic = useMemo(() => {
    return getTopicById(topicId) || ALL_TOPICS[0];
  }, [topicId]);

  // Concept data
  const concept = useMemo(() => {
    return getConceptByTopicId(topic.id, topic);
  }, [topic]);

  // Preview questions for this topic
  const previewQuestions = useMemo(() => {
    return getFilteredQuestions({ topic: topic.id, limit: 2 });
  }, [topic.id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/aptitude/topics"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition"
          >
            <ChevronLeft size={16} />
            Back to Topics
          </Link>

          <Link
            to={`/aptitude/practice/${topic.id}`}
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
          >
            <Play size={13} />
            Start Practice
          </Link>
        </div>

        {/* Topic Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {topic.category} Aptitude
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-medium text-gray-500">
              Difficulty: {topic.difficulty}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            {topic.name}
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
            {concept.introduction}
          </p>
        </div>

        {/* Concept Explanations */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Core Concept Breakdown
              </h2>
              <p className="text-xs text-gray-500">
                Foundational rules and structural concepts
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {concept.concepts.map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                  {c.heading}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Formulas Sheet */}
        {concept.formulas && concept.formulas.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800">
                <FileText size={16} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Important Formulas & Rules
                </h2>
                <p className="text-xs text-gray-500">
                  Essential mathematical relationships and identity theorems
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {concept.formulas.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between"
                >
                  <span className="text-xs font-semibold text-gray-500">
                    {f.name}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-gray-900 mt-2 bg-white px-3 py-2 rounded-lg border border-gray-200 block">
                    {f.formula}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solved Examples */}
        {concept.solvedExamples && concept.solvedExamples.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800">
                <Lightbulb size={16} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Solved Examples
                </h2>
                <p className="text-xs text-gray-500">
                  Step-by-step worked solutions for typical exam questions
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {concept.solvedExamples.map((ex, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="p-4 bg-gray-50/70 border-b border-gray-200">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Example {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed">
                      {ex.problem}
                    </p>
                  </div>
                  <div className="p-4 bg-white text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-700 block">
                      Solution:
                    </span>
                    <p className="text-gray-600">{ex.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Mistakes */}
        {concept.commonMistakes && concept.commonMistakes.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <AlertTriangle size={16} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Common Pitfalls & Exam Mistakes
                </h2>
                <p className="text-xs text-gray-500">
                  Avoid these frequent student traps during competitive tests
                </p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {concept.commonMistakes.map((mistake, idx) => (
                <li
                  key={idx}
                  className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="font-bold shrink-0 mt-0.5">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Practice Call to Action */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Ready to test your understanding?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Apply what you have learned with verified MCQs and instant feedback.
            </p>
          </div>

          <Link
            to={`/aptitude/practice/${topic.id}`}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
          >
            <Play size={14} />
            Start Topic Practice
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AptitudeLearn;
