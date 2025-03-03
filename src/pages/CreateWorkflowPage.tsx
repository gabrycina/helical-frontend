import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createSingleCellWorkflow, uploadFile, getWorkflowStatus } from '@/lib/api';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import ModelSelection from '@/components/ModelSelection';
import PageTransition from '@/components/PageTransition';

// Form validation schema
const formSchema = z.object({
  workflow_type: z.enum(["single_cell_embeddings"], {
    required_error: "Please select a workflow type",
  }),
  input_file: z.string().min(1, "File is required"),
  model_id: z.enum(["scgpt", "geneformer"], {
    required_error: "Please select a model",
  }),
  embedding_mode: z.enum(["cls", "cell", "gene"], {
    required_error: "Please select an embedding mode",
  }),
});

export default function CreateWorkflowPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workflow_type: "single_cell_embeddings",
      input_file: "",
      model_id: "scgpt",
      embedding_mode: "cls",
    },
  });

  const steps = [
    { id: 1, name: 'Upload Data' },
    { id: 2, name: 'Select Model' },
    { id: 3, name: 'Configure Settings' }
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setUploadedFile(selectedFile);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Upload the file
      const fileData = await uploadFile(selectedFile);
      form.setValue("input_file", fileData.filename);
      
      toast(
        "File uploaded successfully",{
        description: `File '${selectedFile.name}' was uploaded.`,
      });
    } catch (error: any) {
      console.error("File upload failed:", error);
      setUploadError(error.message || "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!workflowId) return;
  
    console.log("hello")
    const pollInterval = setInterval(async () => {
      try {
        const status = await getWorkflowStatus(workflowId);
        
        // Convert progress from 0-1 to 0-100
        setProgress(status.progress * 100);
        setStatus(status.status);
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(pollInterval);
          if (status.status === 'completed') {
            toast.success("Workflow completed successfully");
            navigate(`/workflows/${workflowId}`);
          } else {
            toast.error(`Workflow failed: ${status.error}`);
          }
        }
      } catch (error) {
        console.error('Error polling workflow status:', error);
      }
    }, 1000); // Poll every second
    
    return () => clearInterval(pollInterval);
  }, [workflowId]);

  // Form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!uploadedFile) {
        throw new Error("No file selected");
      }

      setIsSubmitting(true);

      const result = await createSingleCellWorkflow(uploadedFile, values.model_id);
      
      setWorkflowId(result.workflow_id);
      
      toast("Workflow created", {
        description: "Your workflow has been successfully created.",
      });
      
      navigate(`/workflows/${result.workflow_id}`);
    } catch (error: any) {
      console.error("Failed to create workflow:", error);
      toast.error("Error", {
        description: error.message || "Failed to create workflow. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-6 rounded-full hover:bg-zinc-900" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Card className="mb-8 border-0 rounded-xl overflow-hidden bg-black">
          <CardHeader className="pb-2 pt-6">
            <div className="mb-12">
              <CardTitle className="text-2xl">Create Workflow</CardTitle>
              <CardDescription className="text-zinc-400">
                Configure a new analysis workflow
              </CardDescription>
            </div>
            
            {/* Steps Indicator */}
            <div className="flex items-center justify-center space-x-6 pb-6 border-b border-zinc-800">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium border transition-colors",
                    currentStep === step.id 
                      ? "bg-primary/40 border-primary/60 text-primary-foreground" 
                      : currentStep > step.id
                      ? "bg-primary/40 border-primary/40 text-primary"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  )}>
                    {step.id}
                  </div>
                  <span className="ml-3 text-sm font-medium text-zinc-400">
                    {step.name}
                  </span>
                  {step.id !== steps.length && (
                    <div className="ml-6 h-px w-12 bg-zinc-800" />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="max-w-md mx-auto space-y-8">
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="file-upload" className="text-lg mb-2">Upload Data</Label>
                        <div className="mt-2">
                          <Label 
                            htmlFor="file-upload" 
                            className="flex justify-center rounded-xl border border-dashed border-zinc-800 px-6 py-12 cursor-pointer hover:border-primary transition-colors"
                          >
                            <div className="space-y-1 text-center">
                              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                              <div className="flex text-sm text-muted-foreground">
                                <span>Upload H5AD file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  accept=".h5ad"
                                  className="sr-only"
                                  onChange={handleFileChange}
                                  disabled={isUploading}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                H5AD files up to 500Mb
                              </p>
                            </div>
                          </Label>
                        </div>
                      </div>

                      {/* File Upload Status */}
                      {file && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{file.name}</span>
                            <span>{Math.round(file.size / 1024)} KB</span>
                          </div>
                          
                          {isUploading && (
                            <div className="space-y-2">
                              <Progress value={uploadProgress} className="h-2" />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Upload Error */}
                      {uploadError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{uploadError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-end pt-4">
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={!form.getValues().input_file}
                          className="px-8 button-primary"
                        >
                          Next Step
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-12">
                      <FormField
                        control={form.control}
                        name="model_id"
                        render={({ field }) => (
                          <FormItem className="space-y-6">
                            <div>
                              <FormLabel className="text-lg">Model</FormLabel>
                              <FormDescription>
                                Choose a model for analyzing your single-cell data
                              </FormDescription>
                            </div>
                            <ModelSelection 
                              onModelSelected={(modelId) => {
                                field.onChange(modelId);
                              }} 
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={prevStep}
                          disabled={isSubmitting}
                        >
                          Previous Step
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="px-8 button-primary"
                        >
                          Next Step
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="workflow_type"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-lg">Application</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select application" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single_cell_embeddings">
                                  Single Cell Embeddings Generation
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose the type of analysis to perform
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="embedding_mode"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-lg">Embedding Mode</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select embedding mode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cls">CLS</SelectItem>
                                <SelectItem value="cell">Cell</SelectItem>
                                <SelectItem value="gene">Gene</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Determine how embeddings are generated
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='space-y-12'>
                        {isSubmitting && (
                          <div className="relative">
                            <Progress 
                              value={progress} 
                              className="h-2 transition-all duration-500 ease-in-out"
                            />
                            <span className="absolute left-0 top-4 text-xs text-muted-foreground">
                              {progress.toFixed(progress)}% - {status || "Creating workflow..."}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between pt-4">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={prevStep}
                            disabled={isSubmitting}
                          >
                            Previous Step
                          </Button>
                          <Button
                            type="submit"
                            className="button-primary"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Create Workflow"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
} 