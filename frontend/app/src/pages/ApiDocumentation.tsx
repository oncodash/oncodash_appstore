import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ApiDocumentation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container pt-24 mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <p className="mb-4">All API requests require authentication using a JWT token. Include the token in the Authorization header:</p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>
              Authorization: Bearer YOUR_JWT_TOKEN
            </code>
          </pre>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">User Authentication</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><code className="bg-gray-100 p-1 rounded">POST /api/auth/register</code> - Register a new user</li>
              <li><code className="bg-gray-100 p-1 rounded">POST /api/auth/login</code> - Login and receive a JWT token</li>
              <li><code className="bg-gray-100 p-1 rounded">POST /api/auth/forgot-password</code> - Request a password reset</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Products</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><code className="bg-gray-100 p-1 rounded">GET /api/products</code> - Get all products</li>
              <li><code className="bg-gray-100 p-1 rounded">GET /api/products/:id</code> - Get a specific product</li>
              <li><code className="bg-gray-100 p-1 rounded">POST /api/products</code> - Create a new product</li>
              <li><code className="bg-gray-100 p-1 rounded">PUT /api/products/:id</code> - Update a product</li>
              <li><code className="bg-gray-100 p-1 rounded">DELETE /api/products/:id</code> - Delete a product</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Reviews</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><code className="bg-gray-100 p-1 rounded">GET /api/reviews/:id</code> - Get reviews for a product</li>
              <li><code className="bg-gray-100 p-1 rounded">POST /api/reviews/:id</code> - Add a review to a product</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Request/Response Examples</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Create a Product</h3>
            <p className="mb-2">Request:</p>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <code>
{`POST /api/products
Content-Type: application/json

{
  "title": "My Awesome Software",
  "description": "This software does amazing things",
  "version": "1.0.0",
  "license": "MIT",
  "category": "productivity",
  "oncodash_version": "0.6.0",
  "tags": ["awesome", "productivity"]
}`}
              </code>
            </pre>
            <p className="mt-4 mb-2">Response:</p>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <code>
{`{
  "id": 1,
  "title": "My Awesome Software",
  "description": "This software does amazing things",
  "version": "1.0.0",
  "license": "MIT",
  "category": "productivity",
  "oncodash_version": "0.6.0",
  "tags": ["awesome", "productivity"],
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2023-06-15T10:30:00Z"
}`}
              </code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
          <p className="mb-4">The API uses standard HTTP status codes to indicate the success or failure of requests. In case of an error, the response will include a JSON object with an "error" field describing the issue.</p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>
{`{
  "error": "Invalid authentication token"
}`}
            </code>
          </pre>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApiDocumentation;