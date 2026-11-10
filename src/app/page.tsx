'use client';

import { WizardLayout } from '../components/WizardLayout';
import { useWizardStore } from '../store/useWizardStore';
import { Step1CoreInfo } from '../components/steps/Step1CoreInfo';
import { Step2Species } from '../components/steps/Step2Species';
import { CharacterState } from '../types/character';

export default function Home() {
  const currentStep = useWizardStore((state: CharacterState) => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CoreInfo />;
      case 2:
        return <Step2Species />;
      default:
        return <Step1CoreInfo />;
    }
  };

  return <WizardLayout>{renderStep()}</WizardLayout>;
}