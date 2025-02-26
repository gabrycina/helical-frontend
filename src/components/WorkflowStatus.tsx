import { useState, useEffect } from 'react';
import { getWorkflowStatus, getDownloadUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface WorkflowStatusProps {
  workflowId: string;
}

export default function WorkflowStatus({ workflowId }: WorkflowStatusProps) {
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await getWorkflowStatus(workflowId);
      setWorkflow(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching workflow:', err);
      if (err.response?.status === 404) {
        setError(`Workflow not found. ID: ${workflowId}`);
      } else {
        setError(`Failed to load workflow status: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Poll for updates if the workflow is running
    const interval = setInterval(() => {
      if (workflow?.status === 'running') {
        fetchStatus();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [workflowId, workflow?.status]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !workflow) return <div className="p-4 text-center">Loading workflow status...</div>;
  if (error) return (
    <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-md text-destructive">
      <h3 className="font-medium mb-2">Error</h3>
      <p>{error}</p>
      <Button variant="outline" size="sm" onClick={fetchStatus} className="mt-4">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
  if (!workflow) return <div className="p-4 text-center">No workflow data found</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Workflow Status</h2>
        <Button variant="outline" size="sm" onClick={fetchStatus}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="border rounded-md p-4">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Workflow ID</p>
            <p className="font-medium">{workflow.workflow_id}</p>
          </div>
          <div className="flex items-start">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(workflow.status)}`}>
              {workflow.status}
            </span>
          </div>
        </div>
        
        {workflow.error_message && (
          <div className="my-4 p-3 bg-destructive/10 text-destructive rounded-md">
            {workflow.error_message}
          </div>
        )}
        
        {workflow.results && workflow.results.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Results</h3>
            <div className="space-y-3">
              {workflow.results.map((result: any) => (
                <div key={result.result_id} className="border rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium capitalize">{result.type}</p>
                    <p className="text-sm text-muted-foreground">{new Date(result.created_at).toLocaleString()}</p>
                    {result.file_size && (
                      <p className="text-xs">{(result.file_size / 1024).toFixed(2)} KB</p>
                    )}
                  </div>
                  
                  <a 
                    href={getDownloadUrl(workflow.workflow_id, result.result_id)} 
                    download
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 