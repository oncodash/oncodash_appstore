import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { categories, Category } from '@/pages/Index';

const API_URL = import.meta.env.VITE_API_URL;

import {
  Form,
  FormControl, FormDescription,
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

const oncodashVersions = [
  { value: '0.6.0', label: 'Oncodash 0.6.0' },
  { value: '0.5.4', label: 'Oncodash 0.5.4' },
  { value: '0.5.3', label: 'Oncodash 0.5.3' },
  // Add more versions as needed
];

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  category: z.string().min(1, 'Please select a category'),
  version: z.string().min(1, 'Version is required'),
  license: z.string().min(1, 'License is required'),
  oncodash_version: z.string().min(1, 'Please select an Oncodash version'),
  external_url: z.string().url().optional(),
});

interface FormValues {
  title: string;
  description: string;
  category: string;
  version: string;
  license: string;
  oncodash_version: string;
  external_url: string;
}

const EditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      version: '',
      license: '',
      oncodash_version: '',
      external_url: '',
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const response = await axios.get(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const product = response.data;
        form.reset({
          title: product.title,
          description: product.description,
          category: product.category,
          version: product.version,
          license: product.license,
          oncodash_version: product.oncodash_version,
          external_url: product.external_url,
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        alert("Failed to load product data");
      }
    };

    fetchProduct();
  }, [id, token, form]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Update response:', response.data);
      alert('Product updated successfully.');
      navigate('/marketplace');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      try {
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Product deleted successfully.');
        navigate('/marketplace');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!id) {
    return <div>No product ID provided</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
        <Navbar />

      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Software Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                  <Textarea {...field} />
                </FormControl>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Software Version</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                      value={field.value}
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

          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="external_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/your-software" />
                </FormControl>
                <FormDescription>
                  Provide an external URL for your software if it's hosted elsewhere.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Product'}
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditForm;