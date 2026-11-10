import React from 'react';
import { useWizardStore } from '../../store/useWizardStore';
import { StepContainer } from '../StepContainer';

export const Step1CoreInfo: React.FC = () => {
  const { name, level, alignment, xp, setCoreInfo } = useWizardStore();

  return (
    <StepContainer
      title="Core Character Information"
      description="Define your character's name, starting level, alignment, and experience points."
      badgeText="Step 1 of 7"
    >
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Character Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setCoreInfo({ name: e.target.value })}
            placeholder="e.g., Valeros"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Level
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={level}
              onChange={(e) => setCoreInfo({ level: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              XP
            </label>
            <input
              type="number"
              min={0}
              value={xp}
              onChange={(e) => setCoreInfo({ xp: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Alignment
          </label>
          <select
            value={alignment}
            onChange={(e) => setCoreInfo({ alignment: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500 text-sm"
          >
            <option value="Lawful Good">Lawful Good</option>
            <option value="Neutral Good">Neutral Good</option>
            <option value="Chaotic Good">Chaotic Good</option>
            <option value="Lawful Neutral">Lawful Neutral</option>
            <option value="Neutral">Neutral</option>
            <option value="Chaotic Neutral">Chaotic Neutral</option>
            <option value="Lawful Evil">Lawful Evil</option>
            <option value="Neutral Evil">Neutral Evil</option>
            <option value="Chaotic Evil">Chaotic Evil</option>
          </select>
        </div>
      </div>
    </StepContainer>
  );
};