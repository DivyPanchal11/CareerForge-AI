import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import ValueProposition from "../components/landing/ValueProposition";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import PlatformPreview from "../components/landing/PlatformPreview";
import FinalCTA from "../components/landing/FinalCTA";
import LandingFooter from "../components/landing/LandingFooter";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-black selection:text-white">
      {/* SECTION A: Navigation Bar */}
      <LandingNavbar />

      <main className="flex-1">
        {/* SECTION B: Hero Section */}
        <HeroSection />

        {/* SECTION C: Trust & Value Proposition */}
        <ValueProposition />

        {/* SECTION D: Features Section */}
        <FeaturesSection />

        {/* SECTION E: How It Works */}
        <HowItWorksSection />

        {/* SECTION F: Platform Preview */}
        <PlatformPreview />

        {/* SECTION G: Call to Action */}
        <FinalCTA />
      </main>

      {/* SECTION H: Footer */}
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
