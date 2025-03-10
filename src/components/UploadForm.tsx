import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Plus, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  category: z.string().min(1, 'Please select a category'),
  price: z.number().min(0, 'Price cannot be negative'),
  tags: z.array(z.string()).min(1, 'Add at least one tag').max(10, 'Maximum 10 tags allowed'),
  files: z.array(z.any()).min(1, 'Please upload at least one file'),
  images: z.array(z.any()).min(1, 'Please add at least one image').max(5, 'Maximum 5 images allowed'),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  { value: 'development-tools', label: 'Development Tools' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'design', label: 'Design' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'business', label: 'Business' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'security', label: 'Security' },
];

const UploadForm = () => {
  const [tagInput, setTagInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
      tags: [],
      files: [],
      images: [],
    },
  });
  
  const tags = form.watch('tags');
  const files = form.watch('files');
  const images = form.watch('images');
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      form.setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    form.setValue('tags', newTags);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'files' | 'images') => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;
    
    const currentFiles = form.getValues(field);
    const newFiles = [...currentFiles];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      
      if (file.size > MAX_FILE_SIZE) {
        form.setError(field, { 
          message: `File ${file.name} exceeds the maximum size of 50MB` 
        });
        continue;
      }
      
      if (field === 'images' && !file.type.startsWith('image/')) {
        form.setError(field, { 
          message: `File ${file.name} is not an image` 
        });
        continue;
      }
      
      if (field === 'images' && newFiles.length >= 5) {
        form.setError(field, { message: 'Maximum 5 images allowed' });
        break;
      }
      
      newFiles.push(file);
    }
    
    form.setValue(field, newFiles);
    form.clearErrors(field);
  };
  
  const removeFile = (index: number, field: 'files' | 'images') => {
    const currentFiles = form.getValues(field);
    const newFiles = [...currentFiles];
    newFiles.splice(index, 1);
    form.setValue(field, newFiles);
  };
  
  const nextStep = async () => {
    if (currentStep === 1) {
      const result = await form.trigger(['title', 'description', 'category', 'price', 'tags']);
      if (result) {
        setCurrentStep(2);
      }
    }
  };
  
  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    console.log('Form values:', values);
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Software successfully uploaded! It will be reviewed before being published.');
    }, 2000);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {currentStep === 1 && (
            <div className="space-y-8 animate-fade-in">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Software Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the name of your software" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a clear and descriptive title for your software.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what your software does, its key features, and benefits" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A detailed description helps potential buyers understand your software.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the category that best represents your software.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Set your price in USD. Enter 0 for free software.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tags to help buyers find your software"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="secondary"
                        className="ml-2"
                        onClick={addTag}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {tag}
                          <button
                            type="button"
                            className="ml-2 text-muted-foreground hover:text-foreground"
                            onClick={() => removeTag(index)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>
                      Add up to 10 relevant tags to improve visibility.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="button" onClick={nextStep} className="rounded-full">
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-8 animate-fade-in">
              <FormField
                control={form.control}
                name="files"
                render={() => (
                  <FormItem>
                    <FormLabel>Software Files</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <Upload className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <p className="text-lg font-medium">Drag your software files here</p>
                            <p className="text-sm text-muted-foreground">Or click to browse files</p>
                          </div>
                          <Input
                            type="file"
                            multiple
                            className="hidden"
                            id="software-upload"
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e, 'files')}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="rounded-full"
                            onClick={triggerFileInput}
                          >
                            Browse Files
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <div className="mt-4 space-y-2">
                      {files.length > 0 && files.map((file: File, index) => (
                        <div key={index} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 p-2 rounded">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-sm">
                              <p className="font-medium truncate">{file.name}</p>
                              <p className="text-muted-foreground">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index, 'files')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormDescription>
                      Upload the software files (max 50MB per file).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Software Images</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Array.from({ length: Math.min(5, images.length + 1) }).map((_, index) => {
                          if (index < images.length) {
                            const file = images[index] as File;
                            const imageUrl = URL.createObjectURL(file);
                            
                            return (
                              <div key={index} className="relative aspect-video bg-secondary/50 rounded-lg overflow-hidden">
                                <img 
                                  src={imageUrl} 
                                  alt={`Preview ${index}`}
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                                  onClick={() => removeFile(index, 'images')}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          } else if (images.length < 5) {
                            return (
                              <div key={index} className="relative aspect-video bg-secondary/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  id={`image-upload-${index}`}
                                  onChange={(e) => handleFileUpload(e, 'images')}
                                />
                                <Label htmlFor={`image-upload-${index}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                                  <Plus className="h-6 w-6 text-muted-foreground" />
                                </Label>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload up to 5 images to showcase your software (screenshots, logos, etc.).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  className="rounded-full"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="rounded-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Software'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default UploadForm;
