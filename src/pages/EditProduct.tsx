import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditForm from '@/components/EditForm';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/marketplace'); // Or wherever you want to redirect after successful edit/delete
  };

  if (!id) {
    return <div>No product ID provided</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <EditForm productId={id} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditProduct;