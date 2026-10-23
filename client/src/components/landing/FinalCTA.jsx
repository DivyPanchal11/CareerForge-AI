import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

function FinalCTA() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50 border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-800 mb-6 shadow-2xs">
          <Sparkles size={13} className="text-gray-900" />
          <span>Begin Today</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Your Next Opportunity Starts With Preparation.
        </h2>

        {/* Supporting text */}
        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed">
          Build your skills, practise with purpose, and prepare for your next
          career opportunity.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-gray-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 active:scale-98"
          >
            <span>Get Started</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded-xl shadow-2xs hover:bg-gray-50 transition-colors"
          >
            <span>Already registered? Log In</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
