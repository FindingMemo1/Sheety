import React, { useEffect, useState } from 'react';
import { FiveEToolsAdapter } from '../../adapters/5eToolsAdapter';
import { useWizardStore } from '../../store/useWizardStore';
import { StepContainer } from '../StepContainer';
import { Species2024 } from '../../types/character';

export const Step2Species: React.FC = () => {
  const [speciesList, setSpeciesList] = useState<Species2024[]>([]);
  const { speciesId, selectSpecies } = useWizardStore();

  useEffect(() => {
    fetch('/data/races.json')
      .then((res) => res.json())
      .then((data) => {
        const parsed = FiveEToolsAdapter.adaptSpeciesList(data.race || []);
        setSpeciesList(parsed);
      })
      .catch(() => setSpeciesList([]));
  }, []);

  return (
    <StepContainer
      title="Choose Your Species"
      description="Select your character's ancestry in the 2024 ruleset."
      badgeText="Step 2 of 7"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {speciesList.map((species) => {
          const isSelected = speciesId === species.id;
          return (
            <button
              key={species.id}
              onClick={() => selectSpecies(species.id, species.sizeOptions[0] || 'Medium')}
              className={`p-4 text-left rounded-xl border transition-all ${
                isSelected
                  ? 'bg-red-500/10 border-red-500 text-slate-100 shadow-lg shadow-red-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <h3 className="font-bold text-base text-slate-100">{species.name}</h3>
              <p className="text-xs text-slate-400 mt-1">Speed: {species.speed} ft.</p>
              <div className="mt-3 space-y-1">
                {species.traits.slice(0, 2).map((trait: { name: string; description: string }) => (
                  <p key={trait.name} className="text-xs text-slate-400 line-clamp-2">
                    <strong className="text-slate-200">{trait.name}:</strong> {trait.description}
                  </p>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </StepContainer>
  );
};