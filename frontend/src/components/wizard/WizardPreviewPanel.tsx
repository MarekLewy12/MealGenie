import { WizardSummaryCard } from "./WizardSummaryCard";
import type { WizardSummaryCardProps } from "./WizardSummaryCard";

export function WizardPreviewPanel(props: WizardSummaryCardProps) {
  return <WizardSummaryCard {...props} variant="preview" />;
}
