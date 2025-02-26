import { useState, useEffect } from 'react';
import { getModels } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Model {
  name: string;
  type: string;
  description: string;
  input_formats: string[];
  version: string;
}

interface ModelSelectionProps {
  onModelSelected: (modelId: string) => void;
}

export default function ModelSelection({ onModelSelected }: ModelSelectionProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const data = await getModels();
        
        const compatibleModels = data.models.filter((model: Model) => 
          ['scgpt', 'geneformer'].includes(model.name.toLowerCase())
        );
        
        setModels(compatibleModels);
      } catch (err) {
        setError('Failed to load models');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    onModelSelected(modelId.toLowerCase());
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[160px] rounded-xl" />
        <Skeleton className="h-[160px] rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (models.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No compatible models found for single-cell workflow
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {models.map((model) => (
        <Card
          key={model.name}
          className={cn(
            "cursor-pointer transition-colors border-2",
            selectedModelId === model.name 
              ? "border-primary bg-primary/5" 
              : "border-zinc-800 hover:border-zinc-700"
          )}
          onClick={() => handleSelect(model.name)}
        >
          <CardContent className="p-6 space-y-3">
            <div>
              <h3 className="text-lg font-medium">{model.name}</h3>
              <p className="text-sm text-muted-foreground">{model.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-zinc-900">
                {model.type}
              </Badge>
              <Badge variant="outline" className="bg-zinc-900">
                v{model.version}
              </Badge>
              {model.input_formats.map(format => (
                <Badge 
                  key={format} 
                  variant="outline"
                  className="bg-zinc-900"
                >
                  {format}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}