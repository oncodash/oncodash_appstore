import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';


const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmNewPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const MyAccount = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    }
  });

  const productsQuery = useQuery({
    queryKey: ['userProducts'],
    queryFn: async () => {
      const response = await axios.get('/api/user/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormData) => 
      axios.post('/api/user/change-password', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
    onSuccess: () => {
      alert('Password changed successfully');
    },
    onError: () => {
      alert('Failed to change password');
    }
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  if (userQuery.isPending || productsQuery.isPending) return <div>Loading...</div>;
  if (userQuery.isError || productsQuery.isError) return <div>Error loading data</div>;

  const user = userQuery.data;
  const products = productsQuery.data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Joined:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-2">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              {...register('currentPassword')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="currentPassword"
              type="password"
            />
            {errors.currentPassword && <p className="text-red-500 text-xs italic">{errors.currentPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              {...register('newPassword')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="newPassword"
              type="password"
            />
            {errors.newPassword && <p className="text-red-500 text-xs italic">{errors.newPassword.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmNewPassword">
              Confirm New Password
            </label>
            <input
              {...register('confirmNewPassword')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmNewPassword"
              type="password"
            />
            {errors.confirmNewPassword && <p className="text-red-500 text-xs italic">{errors.confirmNewPassword.message}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-2">My Products</h2>
        {products.length === 0 ? (
          <p>You haven't listed any products yet.</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li key={product.id} className="mb-2 flex justify-between items-center">
                <span>
                  <strong>{product.title}</strong> - ${product.price}
                </span>
                <Link
                  to={`/edit-product/${product.id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyAccount;