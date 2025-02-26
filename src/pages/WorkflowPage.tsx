import { useParams, Link } from 'react-router-dom';
import WorkflowStatus from '@/components/WorkflowStatus';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function WorkflowPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Invalid workflow ID</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/home">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Workflow Details</h1>
      
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <WorkflowStatus workflowId={id} />
      </div>
    </div>
  );
} 