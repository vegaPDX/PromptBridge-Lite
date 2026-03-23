import { useState, useCallback } from "react";
import { GUIDED_SCENARIOS, FREEFORM_SCENARIOS } from "./data/scenarios";
import { loadProgress, saveProgress, loadAssessment, saveAssessment, loadUserContext, saveUserContext } from "./services/storage";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import ScenarioSelector from "./pages/ScenarioSelector";
import GuidedMode from "./pages/GuidedMode";
import FreeformMode from "./pages/FreeformMode";
import ProgressPage from "./pages/ProgressPage";
import HelpPage from "./pages/HelpPage";
import AssessmentMode from "./pages/AssessmentMode";

export default function App() {
  const [page, setPage] = useState("landing");
  const [selectedScenario, setSelectedScenario] = useState(null);

  // Load progress once on mount (lazy initializer avoids re-reading localStorage on every render)
  const [completedScenarios, setCompletedScenarios] = useState(() => loadProgress().completedScenarios);
  const [practicedPrinciples, setPracticedPrinciples] = useState(() => loadProgress().practicedPrinciples);

  // User context for personalization
  const [userContext, setUserContext] = useState(() => loadUserContext());
  const handleSetUserContext = (ctx) => { setUserContext(ctx); saveUserContext(ctx); };

  // Assessment data
  const [assessmentData, setAssessmentData] = useState(() => loadAssessment());

  const handleAssessmentComplete = (type, result) => {
    const updated = { ...assessmentData, [type]: result };
    setAssessmentData(updated);
    saveAssessment(updated);
  };

  const markCompleted = useCallback((scenario, extraPrinciples) => {
    const newCompleted = [...new Set([...completedScenarios, scenario.id])];
    const allPrinciples = [...(scenario.principles || []), ...(extraPrinciples || [])];
    const newPracticed = [...new Set([...practicedPrinciples, ...allPrinciples])];
    setCompletedScenarios(newCompleted);
    setPracticedPrinciples(newPracticed);
    saveProgress({ completedScenarios: newCompleted, practicedPrinciples: newPracticed });
  }, [completedScenarios, practicedPrinciples]);

  const handleSelectScenario = (scenario, modeOverride) => {
    setSelectedScenario(scenario);
    setPage(modeOverride || (scenario.mode === "freeform" ? "freeform" : "guided"));
  };

  const handleScenarioComplete = (scenario, extraPrinciples) => {
    markCompleted(scenario, extraPrinciples);
    const pool = scenario.mode === "freeform" ? FREEFORM_SCENARIOS : GUIDED_SCENARIOS;
    const currentIdx = pool.findIndex(s => s.id === scenario.id);
    const next = pool.find((s, i) => i > currentIdx && !completedScenarios.includes(s.id));
    if (next) {
      setSelectedScenario(next);
      setPage(next.mode === "freeform" ? "freeform" : "guided");
    } else {
      setPage("scenarios");
    }
  };

  const navigate = (p) => {
    setPage(p);
    setSelectedScenario(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
      {/* Header — all pages except landing */}
      {page !== "landing" && (
        <Header page={page} practicedPrinciples={practicedPrinciples} onNavigate={navigate} />
      )}

      {/* Pages */}
      <main>
        {page === "landing" && (
          <LandingPage onNavigate={navigate} />
        )}
        {page === "scenarios" && (
          <ScenarioSelector
            onSelectScenario={handleSelectScenario}
            completedScenarios={completedScenarios}
            practicedPrinciples={practicedPrinciples}
            userContext={userContext}
            onSetUserContext={handleSetUserContext}
          />
        )}
        {page === "guided" && selectedScenario && (
          <GuidedMode
            key={selectedScenario.id}
            scenario={selectedScenario}
            onComplete={handleScenarioComplete}
            onBack={() => navigate("scenarios")}
            practicedPrinciples={practicedPrinciples}
            completedScenarios={completedScenarios}
          />
        )}
        {page === "freeform" && selectedScenario && (
          <FreeformMode
            key={selectedScenario.id}
            scenario={selectedScenario}
            onComplete={handleScenarioComplete}
            onBack={() => navigate("scenarios")}
            practicedPrinciples={practicedPrinciples}
            completedScenarios={completedScenarios}
            userContext={userContext}
          />
        )}
        {page === "progress" && (
          <ProgressPage
            completedScenarios={completedScenarios}
            practicedPrinciples={practicedPrinciples}
            onNavigate={navigate}
            assessmentData={assessmentData}
          />
        )}
        {page === "assessment" && (
          <AssessmentMode
            assessmentData={assessmentData}
            onComplete={handleAssessmentComplete}
            onBack={() => navigate(assessmentData?.pre ? "progress" : "scenarios")}
          />
        )}
        {page === "help" && (
          <HelpPage onNavigate={navigate} />
        )}
      </main>

      {/* Footer — landing page only */}
      {page === "landing" && (
        <footer className="text-center py-8 px-4 border-t border-stone-200">
          <p className="text-stone-400 text-xs">
            PromptBridge — Open source. Inspired by NeuroBridge (Haroon et al., ASSETS 2025).
          </p>
          <p className="text-stone-300 text-xs mt-1">
            Skills learned here work with any AI assistant.
          </p>
        </footer>
      )}
    </div>
  );
}
