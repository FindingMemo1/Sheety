// store/useWizardStore.ts
import { create } from 'zustand';
import {
  CharacterState,
  AbilityScoreName,
  AbilityScores,
  ScoreGenerationMethod,
  AbilityScoreBoostChoice,
} from '../types/character';

const DEFAULT_SCORES: AbilityScores = {
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
};

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

interface WizardStoreActions {
  // Step Navigation
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Character State Mutations
  setCoreInfo: (info: Partial<Pick<CharacterState, 'name' | 'level' | 'alignment' | 'xp'>>) => void;
  selectSpecies: (speciesId: string, size: CharacterState['selectedSize']) => void;
  selectBackground: (backgroundId: string) => void;
  updateAbilityBoosts: (boosts: AbilityScoreBoostChoice) => void;
  selectClass: (classId: string) => void;
  selectSubclass: (subclassId: string) => void;
  setSkillProficiencies: (skills: string[]) => void;
  setGenerationMethod: (method: ScoreGenerationMethod) => void;
  setBaseAbilityScores: (scores: AbilityScores) => void;
  
  // Computations
  getFinalScores: () => AbilityScores;
  getAbilityModifier: (scoreName: AbilityScoreName) => number;
  getProficiencyBonus: () => number;
  getPassivePerception: () => number;
  
  // Reset & Import
  loadCharacterState: (state: Partial<CharacterState>) => void;
  resetWizard: () => void;
}

export const useWizardStore = create<CharacterState & WizardStoreActions>((set, get) => ({
  // Default State
  name: '',
  level: 1,
  alignment: 'Neutral',
  xp: 0,
  speciesId: null,
  selectedSize: null,
  backgroundId: null,
  abilityScoreBoosts: { mode: '2_1' },
  classId: null,
  subclassId: null,
  selectedSkills: [],
  selectedWeaponMasteries: [],
  generationMethod: 'standard_array',
  baseAbilityScores: { ...DEFAULT_SCORES },
  rolledScores: [],
  usesStartingGold: false,
  selectedEquipment: [],
  selectedSpells: [],
  currentStep: 1,
  isCompleted: false,

  // Navigation
  setStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 7) }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  // State Updates
  setCoreInfo: (info) => set((state) => ({ ...state, ...info })),
  selectSpecies: (speciesId, selectedSize) => set({ speciesId, selectedSize }),
  selectBackground: (backgroundId) => set({ backgroundId }),
  updateAbilityBoosts: (abilityScoreBoosts) => set({ abilityScoreBoosts }),
  selectClass: (classId) => set({ classId, subclassId: null, selectedSkills: [] }),
  selectSubclass: (subclassId) => set({ subclassId }),
  setSkillProficiencies: (selectedSkills) => set({ selectedSkills }),
  setGenerationMethod: (generationMethod) => set({ generationMethod }),
  setBaseAbilityScores: (baseAbilityScores) => set({ baseAbilityScores }),

  // Derived Values
  getFinalScores: () => {
    const { baseAbilityScores, abilityScoreBoosts } = get();
    const finalScores = { ...baseAbilityScores };

    if (abilityScoreBoosts.mode === '2_1') {
      if (abilityScoreBoosts.primaryScore) finalScores[abilityScoreBoosts.primaryScore] += 2;
      if (abilityScoreBoosts.secondaryScore) finalScores[abilityScoreBoosts.secondaryScore] += 1;
    } else if (abilityScoreBoosts.mode === '1_1_1' && abilityScoreBoosts.tripleScores) {
      abilityScoreBoosts.tripleScores.forEach((score) => {
        if (score) finalScores[score] += 1;
      });
    }

    return finalScores;
  },

  getAbilityModifier: (scoreName: AbilityScoreName) => {
    const scores = get().getFinalScores();
    return Math.floor((scores[scoreName] - 10) / 2);
  },

  getProficiencyBonus: () => {
    const { level } = get();
    return 1 + Math.ceil(level / 4);
  },

  getPassivePerception: () => {
    const wisMod = get().getAbilityModifier('wis');
    const pb = get().getProficiencyBonus();
    const isProficient = get().selectedSkills.includes('Perception');
    return 10 + wisMod + (isProficient ? pb : 0);
  },

  loadCharacterState: (newState) => set((state) => ({ ...state, ...newState })),
  resetWizard: () => set({
    name: '', level: 1, alignment: 'Neutral', speciesId: null, backgroundId: null,
    classId: null, subclassId: null, currentStep: 1, baseAbilityScores: { ...DEFAULT_SCORES }
  }),
}));