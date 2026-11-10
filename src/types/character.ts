// types/character.ts

export type AbilityScoreName = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type AbilityScores = Record<AbilityScoreName, number>;

export type SizeCategory = 'Tiny' | 'Small' | 'Medium' | 'Large';

export interface Trait {
  name: string;
  description: string;
}

export interface Species2024 {
  id: string;
  name: string;
  source: string;
  speed: number;
  sizeOptions: SizeCategory[];
  traits: Trait[];
}

export interface AbilityScoreBoostChoice {
  mode: '2_1' | '1_1_1';
  primaryScore?: AbilityScoreName; // Gets +2 in 2_1 mode
  secondaryScore?: AbilityScoreName; // Gets +1 in 2_1 mode
  tripleScores?: [AbilityScoreName, AbilityScoreName, AbilityScoreName]; // +1 each in 1_1_1 mode
}

export interface Background2024 {
  id: string;
  name: string;
  source: string;
  recommendedAbilityScores: AbilityScoreName[];
  originFeatId: string;
  originFeatName: string;
  skillProficiencies: string[];
  toolProficiencies: string[];
  startingEquipmentChoice: {
    presetItems: Array<{ itemName: string; quantity: number }>;
    goldAlternative: number;
  };
}

export interface Subclass2024 {
  id: string;
  name: string;
  source: string;
  className: string;
  description: string;
  features: Array<{ level: number; name: string; description: string }>;
}

export interface Class2024 {
  id: string;
  name: string;
  source: string;
  hitDie: number; // e.g., 8, 10, 12
  primaryAbilities: AbilityScoreName[];
  savingThrowProficiencies: AbilityScoreName[];
  skillProficiencyChoices: {
    chooseCount: number;
    options: string[];
  };
  weaponMasteryCount: number;
  subclassUnlockLevel: number; // Level 3 across all classes in 2024 ruleset
  subclasses: Subclass2024[];
}

export type ScoreGenerationMethod = 'standard_array' | 'point_buy' | 'manual_rolling';

export interface CharacterState {
  // Step 1: Core Info
  name: string;
  level: number;
  alignment: string;
  xp: number;

  // Step 2: Species
  speciesId: string | null;
  selectedSize: SizeCategory | null;

  // Step 3: Background
  backgroundId: string | null;
  abilityScoreBoosts: AbilityScoreBoostChoice;

  // Step 4: Class & Features
  classId: string | null;
  subclassId: string | null;
  selectedSkills: string[];
  selectedWeaponMasteries: string[];

  // Step 5: Ability Scores
  generationMethod: ScoreGenerationMethod;
  baseAbilityScores: AbilityScores;
  rolledScores: number[];

  // Step 6: Equipment & Spells
  usesStartingGold: boolean;
  selectedEquipment: string[];
  selectedSpells: string[];

  // Meta
  currentStep: number;
  isCompleted: boolean;
}