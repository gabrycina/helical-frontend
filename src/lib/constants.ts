import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';

export const WORKFLOW_STATUS_VARIANTS = {
  completed: {
    className: "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25",
    icon: CheckCircle2,
    label: "Completed"
  },
  failed: {
    className: "bg-red-500/15 text-red-500 hover:bg-red-500/25",
    icon: XCircle,
    label: "Failed"
  },
  running: {
    className: "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25",
    icon: Loader2,
    label: "Running"
  },
  created: {
    className: "bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25",
    icon: Clock,
    label: "Created"
  }
} as const;

export type WorkflowStatus = keyof typeof WORKFLOW_STATUS_VARIANTS; 