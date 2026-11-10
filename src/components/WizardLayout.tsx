import React, { useState } from 'react';
import { useWizardStore } from '../store/useWizardStore';
import { AbilityScoreName } from '../types/character';

const STEP_TITLES = [
  'Core Info',
  'Species',
  'Background',
  'Class & Subclass',
  'Ability Scores',
  'Equipment & Spells',
  'Review & Export',
];

export const WizardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentStep, setStep, nextStep, prevStep, name, level } = useWizardStore();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-red-600/30">
            5.5
          </div>
          <div>
            <h1 className="font-semibold text-sm md:text-base leading-tight">Charactermancer 2024</h1>
            <p className="text-xs text-slate-400">{name || 'Unnamed Character'} — Level {level}</p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="md:hidden text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md border border-slate-700 font-medium text-slate-200"
        >
          {isMobileDrawerOpen ? 'Hide Summary' : 'View Sheet'}
        </button>
      </header>

      {/* Progressive Stepper Header */}
      <nav aria-label="Wizard Steps" className="bg-slate-900 border-b border-slate-800 overflow-x-auto py-3 px-4 scrollbar-none">
        <ol className="flex items-center min-w-max space-x-2 md:space-x-4 max-w-7xl mx-auto">
          {STEP_TITLES.map((title, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;

            return (
              <li key={title} className="flex items-center">
                <button
                  onClick={() => setStep(stepNum)}
                  className={`flex items-center space-x-2 text-xs md:text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-red-400'
                      : isCompleted
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-red-500/20 border border-red-500 text-red-400'
                        : isCompleted
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-900 border border-slate-800 text-slate-600'
                    }`}
                  >
                    {stepNum}
                  </span>
                  <span>{title}</span>
                </button>
                {idx < STEP_TITLES.length - 1 && (
                  <span className="ml-2 md:ml-4 text-slate-700">/</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 relative">
        {/* Step Interactive Area */}
        <main className="md:col-span-8 flex flex-col min-h-[500px] bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 md:p-6 shadow-xl">
          <div className="flex-1">{children}</div>

          {/* Step Navigation Controls */}
          <footer className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
            >
              Back
            </button>
            <span className="text-xs text-slate-500 font-medium">Step {currentStep} of 7</span>
            <button
              onClick={nextStep}
              disabled={currentStep === 7}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white disabled:opacity-40 shadow-lg shadow-red-600/20 transition-all"
            >
              {currentStep === 7 ? 'Finish' : 'Continue'}
            </button>
          </footer>
        </main>

        {/* Desktop Sticky Live Summary Sidebar */}
        <aside className="hidden md:block md:col-span-4">
          <div className="sticky top-20">
            <CharacterSummaryCard />
          </div>
        </aside>

        {/* Mobile Slide-Over Sheet Drawer */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden flex justify-end">
            <div className="w-4/5 max-w-xs bg-slate-900 h-full p-4 border-l border-slate-800 overflow-y-auto">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                <h2 className="font-bold text-sm text-slate-200">Character Summary</h2>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  Close ✕
                </button>
              </div>
              <CharacterSummaryCard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal Preview Component
const CharacterSummaryCard: React.FC = () => {
  const store = useWizardStore();
  const finalScores = store.getFinalScores();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="font-bold text-base text-slate-100">{store.name || 'Hero'}</h3>
        <p className="text-xs text-red-400 font-medium mt-0.5">
          Level {store.level} | {store.speciesId || 'Species TBD'} | {store.classId || 'Class TBD'}
        </p>
      </div>

      {/* Ability Score Grid */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ability Scores</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          {(Object.keys(finalScores) as AbilityScoreName[]).map((stat) => {
            const score = finalScores[stat];
            const mod = store.getAbilityModifier(stat);
            return (
              <div key={stat} className="bg-slate-950 border border-slate-800 rounded-lg p-2">
                <div className="text-[10px] text-slate-400 uppercase font-bold">{stat}</div>
                <div className="text-sm font-extrabold text-slate-100">{score}</div>
                <div className="text-xs font-semibold text-red-400">
                  {mod >= 0 ? `+${mod}` : mod}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Derived Stats */}
      <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Proficiency:</span>
          <span className="font-bold text-slate-200">+{store.getProficiencyBonus()}</span>
        </div>
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Passive Perc:</span>
          <span className="font-bold text-slate-200">{store.getPassivePerception()}</span>
        </div>
      </div>
    </div>
  );
};