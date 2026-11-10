// components/StepContainer.tsx
import React from 'react';

interface StepContainerProps {
  title: string;
  description: string;
  badgeText?: string;
  children: React.ReactNode;
}

export const StepContainer: React.FC<StepContainerProps> = ({
  title,
  description,
  badgeText,
  children,
}) => {
  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-800/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">{title}</h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">{description}</p>
        </div>
        {badgeText && (
          <span className="self-start md:self-auto inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            {badgeText}
          </span>
        )}
      </div>

      {/* Interactive Form/Selection Grid Content */}
      <div className="pt-2">{children}</div>
    </div>
  );
};