import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWorkflowStatus, getDownloadUrl } from '@/lib/api';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  DownloadCloud, 
  RefreshCw,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { formatBytes } from '@/lib/utils';
import { WORKFLOW_STATUS_VARIANTS, type WorkflowStatus } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function WorkflowDetails() {
  const { id } = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!id) return;
    
    try {
      setRefreshing(true);
      const data = await getWorkflowStatus(id);
      console.log(data)
      setWorkflow(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching workflow:', err);
      if (err.response?.status === 404) {
        setError(`Workflow not found. ID: ${id}`);
      } else {
        setError(`Failed to load workflow status: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Set up automatic refresh for running workflows
    let intervalId: number | undefined;
    if (workflow?.status === 'running') {
      intervalId = window.setInterval(fetchStatus, 5000); // Refresh every 5 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, workflow?.status]);

  const renderStatusBadge= (status: string) => {
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
          {Icon && <Icon className={cn(
            "mr-1.5 h-3.5 w-3.5",
            status === 'processing' && "animate-spin"
          )} />}
          <span className="capitalize">{variant.label}</span>
        </span>
      </Badge>
    );
  }; 

  if (loading && !workflow) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="mb-8">
          <CardContent className="pt-6 flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading workflow status...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={fetchStatus} disabled={refreshing}>
              {refreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No workflow data found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/home">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Workflow Details</h1>
        </div>
        
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium text-muted-foreground">Workflow ID</CardTitle>
                <CardDescription className="font-mono text-foreground text-lg">
                  {workflow.workflow_id}
                </CardDescription>
              </div>
              <div className="flex flex-row items-center gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchStatus}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Refresh</span>
                    </>
                  )}
                </Button>
                {renderStatusBadge(workflow.status)}
              </div>
            </div>
          </CardHeader>
          
          {workflow.error_message && (
            <CardContent className="pb-4 pt-0">
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-4">
                <p className="font-medium mb-1">Error:</p>
                <p className="font-mono text-sm">{workflow.error_message}</p>
              </div>
            </CardContent>
          )}
          
          {workflow.results && workflow.results.length > 0 && (
            <>
              <CardContent className="pt-0">
                <h3 className="text-xl font-semibold mb-4">Results</h3>
                <div className="space-y-4">
                  {workflow.results.map((result: any) => (
                    <Card key={result.result_id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold capitalize mb-1">{result.type}</h4>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(result.created_at), 'dd/MM/yyyy, HH:mm:ss')}
                            </p>
                            <p className="text-sm">{formatBytes(result.file_size)}</p>
                          </div>
                          <Button variant="outline" asChild>
                            <a href={getDownloadUrl(workflow.id, result.result_id)} download>
                              <DownloadCloud className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
} 