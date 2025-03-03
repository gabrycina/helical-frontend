import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const WORKFLOW_STATUS_VARIANTS = {
  pending: {
    className: "bg-slate-500/15 text-slate-500 hover:bg-slate-500/25",
    icon: null,
    label: "Pending"
  },
  processing: {
    className: "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25",
    icon: Loader2,
    label: "Processing"
  },
  completed: {
    className: "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25",
    icon: CheckCircle2,
    label: "Completed"
  },
  failed: {
    className: "bg-red-500/15 text-red-500 hover:bg-red-500/25",
    icon: XCircle,
    label: "Failed"
  }
} as const;

export type WorkflowStatus = keyof typeof WORKFLOW_STATUS_VARIANTS; 