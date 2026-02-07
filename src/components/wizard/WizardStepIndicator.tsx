import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
}

interface Props {
  steps: Step[];
  currentStepIndex: number;
}

export function WizardStepIndicator({ steps, currentStepIndex }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4 mb-2">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                i < currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : i === currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-xs mt-1 hidden sm:block",
                i <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-8 sm:w-12 h-0.5 mx-1 sm:mx-2",
                i < currentStepIndex ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
