import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2,
  Plus,
  FileInput
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { cn } from "@/lib/utils";
import { WORKFLOW_STATUS_VARIANTS, type WorkflowStatus } from '@/lib/constants';
import PageTransition from '@/components/PageTransition';

export default function HomePage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true);
        const response = await api.get('/workflows');
        const sortedWorkflows = response.data.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setWorkflows(sortedWorkflows);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch workflows:', err);
        setError('Failed to load workflows. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  const renderStatusBadge = (status: string) => {
    const variant = WORKFLOW_STATUS_VARIANTS[status as WorkflowStatus] || {
      className: "bg-slate-500/15 text-slate-500 hover:bg-slate-500/25",
      icon: null,
      label: status
    };

    const Icon = variant.icon;

    return (
      <Badge 
        variant="outline"
        className={cn(
          "rounded-full px-3 py-0.5 font-medium border-transparent",
          variant.className
        )}
      >
        <span className="flex items-center">
          {Icon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
          <span className="capitalize">{variant.label}</span>
        </span>
      </Badge>
    );
  };

  return (
    <PageTransition>
      <div className="w-full space-y-8 max-w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Workflows</h1>
            <p className="text-slate-400">
              Create and manage your analysis workflows
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center p-4 text-destructive">{error}</div>
        ) : workflows.length === 0 ? (
          <div className="text-center p-12 border rounded-xl bg-muted/5">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted/10 p-4">
                <FileInput className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">No workflows found</p>
              <Button 
                asChild 
                size="lg" 
                className="button-primary"
              >
                <Link to="/create" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create your first workflow
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <Table className='scale-70'>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Results</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.workflow_id}>
                  <TableCell className="font-mono">
                    {workflow.workflow_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(workflow.status)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(workflow.created_at), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {workflow.results?.length || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/workflows/${workflow.workflow_id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </PageTransition>
  );
} 