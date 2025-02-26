import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createSingleCellWorkflow } from '@/lib/api';

interface WorkflowConfigurationProps {
  fileName: string;
  modelId: string;
  onWorkflowCreated: (workflowId: string) => void;
}

export default function WorkflowConfiguration({ 
  fileName, 
  modelId, 
  onWorkflowCreated 
}: WorkflowConfigurationProps) {
  const [embeddingMode, setEmbeddingMode] = useState('cls');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateWorkflow = async () => {
    try {
      setCreating(true);
      setError(null);
      
      console.log('Creating workflow with:', { 
        input_file: fileName,
        model_id: modelId,
        embedding_mode: embeddingMode
      });
            const result = await createSingleCellWorkflow({
        input_file: fileName,
        model_id: modelId,
        embedding_mode: embeddingMode
      });
      
      onWorkflowCreated(result.workflow_id);
    } catch (err: any) {
      setError(`Failed to create workflow: ${err.response?.data?.detail || err.message}`);
      console.error('Workflow creation error:', err.response?.data || err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Configure Workflow</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Embedding Mode
        </label>
        <select 
          value={embeddingMode}
          onChange={(e) => setEmbeddingMode(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="cls">CLS Token</option>
          <option value="cell">Cell Embedding</option>
          <option value="gene">Gene Embedding</option>
        </select>
      </div>

      <div className="border rounded-md p-4 bg-muted/50">
        <h3 className="font-medium mb-2">Workflow Summary</h3>
        <ul className="space-y-1 text-sm">
          <li><span className="font-medium">Input File:</span> {fileName}</li>
          <li><span className="font-medium">Model:</span> {modelId}</li>
          <li><span className="font-medium">Embedding Mode:</span> {embeddingMode}</li>
        </ul>
      </div>

      {error && <div className="text-destructive p-3 bg-destructive/10 rounded-md">{error}</div>}
      
      <Button 
        onClick={handleCreateWorkflow} 
        disabled={creating}
        className="w-full"
      >
        {creating ? 'Creating Workflow...' : 'Start Workflow'}
      </Button>
    </div>
  );
} 