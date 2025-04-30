import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Plus, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import toml from 'toml';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { categories, Category } from '@/pages/Index';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;
console.log("upload API URL:", API_URL);


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
import globals = require("globals");

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  category: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).min(1, 'Add at least one tag').max(10, 'Maximum 10 tags allowed'),
  version: z.string().min(1, 'Version is required'),
  license: z.string().min(1, 'License is required'),
  oncodash_version: z.string().min(1, 'Please select an Oncodash version'),
  images: z.array(z.any()).min(1, 'Please add at least one image').max(5, 'Maximum 5 images allowed'),
  files: z.array(z.any()).optional().default([]),
  external_url: z.string().url().optional().or(z.literal('')),
}).refine((data) => {
  // Check if either files or external_url is provided
  return data.files.length > 0 || (data.external_url && data.external_url.trim() !== '');
}, {
  message: "Either a file upload or an external URL must be provided"
})

type FormValues = z.infer<typeof formSchema>;

const oncodashVersions = [
  { value: '0.6.0', label: 'Oncodash 0.6.0' },
  { value: '0.5.4', label: 'Oncodash 0.5.4' },
  { value: '0.5.3', label: 'Oncodash 0.5.3' },
  // Add more versions as needed
];

const UploadForm = () => {
  const [tagInput, setTagInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = useAuth();
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate('/auth?tab=login', { state: { from: '/upload' } });
    }
  }, [user, token, navigate]);

  console.log('Auth state:', { user, token }); // Add this line for debugging
  if (!user || !token) {
    return null;
  }
  // TODO: Add link field option instead of uploading file. Group software with same title (version can differ), same product can have multiple files

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
      tags: [],
      files: [],
      external_url: '',
      images: [],
      version: '',
      license: '',
      oncodash_version: '',

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
  const readTomlAndFillForm = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsedToml = toml.parse(content);
        console.log('Parsed TOML:', parsedToml.tool.poetry.name);
        console.log('Parsed TOML:', parsedToml.tool.poetry.description);
        console.log('Parsed TOML:', parsedToml);


        // Update form fields based on TOML content
        form.setValue('title', parsedToml.tool.poetry.name || '');
        form.setValue('description', parsedToml.tool.poetry.description || '');
        form.setValue('version', parsedToml.tool.poetry.version || '');
        form.setValue('license', parsedToml.tool.poetry.license || '');
        form.setValue('author', parsedToml.tool.poetry.authors || '');

        alert('TOML file parsed and form fields updated successfully!');
      } catch (error) {
        console.error('Error parsing TOML:', error);
        alert('Error parsing TOML file. Please check the file format.');
      }
    };
    reader.readAsText(file);
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
      const result = await form.trigger(['title', 'description', 'category', 'version', 'oncodash_version']);
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

  console.log('Token at submission:', token); // For debugging

  if (!token) {
    console.error('No authentication token available');
    alert('You must be logged in to upload software.');
    setIsSubmitting(false);
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('oncodash_version', values.oncodash_version);
    //formData.append('price', values.price.toString());
    formData.append('version', values.version);
    formData.append('license', values.license);
    if (values.external_url && values.external_url.trim() !== '') {
      formData.append('external_url', values.external_url);
    }
    if (values.files && values.files.length > 0) {
      values.files.forEach((file, index) => {
        formData.append(`files`, file);
      });
    }

    // Append tags
    values.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // Append images
    values.images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    console.log('Sending data:', Object.fromEntries(formData));

    const response = await axios.post(`${API_URL}/products`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });

    console.log('Product created:', response.data);
    alert('Software successfully uploaded! It will be reviewed before being published.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert('Authentication failed. Please try logging in again.');
      } else if (error.response?.status === 415) {
        console.error('Unsupported Media Type:', error.response.data);
        alert('Error: Unsupported Media Type. Please check your file formats.');
      } else {
        alert(`Error: ${error.response?.data?.message || error.message}`);
      }
    } else {
      console.error('Error creating product:', error);
      alert('An unexpected error occurred while uploading the software. Please try again.');
    }
  } finally {
    setIsSubmitting(false);
  }
};


  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (

    <div className="bg-white w-full max-w-3xl mx-auto mt-16 ">
       <Navbar  />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {currentStep === 1 && (
                      <div className="space-y-8 animate-fade-in">
                        <FormField
                          control={form.control}
                          name="tomlFile"
                          render={() => (
                            <FormItem>
                              <FormLabel>Fill in from TOML File (Optional)</FormLabel>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="file"
                                    accept=".toml"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        readTomlAndFillForm(file);
                                      }
                                    }}
                                  />

                                </div>
                              </FormControl>
                              <FormDescription>
                                Upload a TOML file to automatically fill in the form fields.
                              </FormDescription>
                            </FormItem>
                          )}
                        />
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
                          name="version"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Version</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 1.0.0" {...field} />
                              </FormControl>
                              <FormDescription>
                                Specify the version of your software.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
          
                        <FormField
                          control={form.control}
                          name="license"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>License</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., MIT, GPL, Apache 2.0" {...field} />
                              </FormControl>
                              <FormDescription>
                                Specify the license under which your software is released.
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
                name="oncodash_version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oncodash Version</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Oncodash version" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {oncodashVersions.map((oncodashVersion) => (
                          <SelectItem key={oncodashVersion.value} value={oncodashVersion.value}>
                            {oncodashVersion.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the Oncodash version compatible with your software.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                {/*<FormField
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
              />*/}
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
              {/*<FormField
                control={form.control}
                name="uploadMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Method</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setUploadMethod(value as 'file' | 'url');
                        field.onChange(value);
                      }}
                      defaultValue={uploadMethod}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select upload method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="file">Upload File</SelectItem>
                        <SelectItem value="url">Provide URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {uploadMethod === 'file' && (*/}
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
              {/*{uploadMethod === 'url' && (*/}
                <FormField
                  control={form.control}
                  name="external_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Software URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/your-software.zip"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a direct URL to your software files.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              {/*)}*/}
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