import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = [
  { value: 'genomics', label: 'Genomics' },
  { value: 'visualization', label: 'Visualization' },
  { value: 'analytics', label: 'Analytics'},
  { value: 'annotation', label: 'Annotation' },
  { value: 'etl', label: 'Extract/Transform/Load data' },
  { value: 'utilities', label: 'Utilities' },
];

const formSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  category: z.string(),
  tags: z.array(z.string()),
  version: z.string().min(1, "Version is required"),
  oncodash_version: z.string().min(1, "Oncodash version is required"),
  license: z.string().min(1, "License is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditFormProps {
  productId: string;
  onSuccess: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ productId, onSuccess }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      tags: [],
      version: '',
      oncodash_version: '',
      license: '',
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const product = response.data;
        form.reset({
          title: product.title,
          description: product.description,
          category: product.category,
          tags: product.tags,
          version: product.version,
          oncodash_version: product.oncodash_version,
          license: product.license,
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        alert("Failed to load product data");
      }
    };

    fetchProduct();
  }, [productId, token, form]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/products/${productId}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Update response:', response.data);
      alert('Product updated successfully.');
      onSuccess();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Product deleted successfully.');
        onSuccess();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormControl>
                <Input {...field} />
              </FormControl>
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
  );
};

export default EditForm;