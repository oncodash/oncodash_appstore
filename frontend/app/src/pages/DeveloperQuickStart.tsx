import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link, Route } from 'react-router-dom';

const DeveloperQuickStart = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto pt-24 px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Developer Quick Start Guide</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Clone the repository: <code className="bg-gray-100 p-1 rounded">git clone https://github.com/oncodash/oncodash_appstore</code></li>
            <li>Navigate to the project directory: <code className="bg-gray-100 p-1 rounded">cd oncodash_appstore</code></li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Environment Setup</h2>
          <p className="mb-4">Before running the application, you need to set up the environment variables:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>In the root directory, create a <code className="bg-gray-100 p-1 rounded">.env</code> file</li>
            <li>Add the following content to the <code className="bg-gray-100 p-1 rounded">.env</code> file:
              <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                <code>
{`FLASK_APP=backend/app/app.py
FLASK_ENV=development
DATABASE_URL=sqlite:///softswap.db
SECRET_KEY=your_secret_key_here`}
                </code>
              </pre>
            </li>
            <li>Replace <code className="bg-gray-100 p-1 rounded">your_secret_key_here</code> with secure random strings</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Docker Installation</h2>
          <p className="mb-4">We recommend using Docker for easy setup and consistent development environments.</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Ensure Docker and Docker Compose are installed on your system</li>
            <li>Build and start the containers:
              <code className="block bg-gray-100 p-2 rounded mt-2">
                docker-compose up --build
              </code>
            </li>
            <li>The application will be available at:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Frontend: <code className="bg-gray-100 p-1 rounded">http://localhost:8000</code></li>
                <li>Backend: <code className="bg-gray-100 p-1 rounded">http://localhost:5000</code></li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Standalone Setup (Alternative)</h2>
          <p className="mb-4">If you prefer not to use Docker, you can set up the project manually:</p>
          <ol className="list-decimal list-inside space-y-2">

            <li>Navigate to the backend directory: <code className="bg-gray-100 p-1 rounded">cd backend</code></li>
            <li>Create a virtual environment: <code className="bg-gray-100 p-1 rounded">python -m venv venv</code></li>
            <li>Activate the virtual environment:
              <ul className="list-disc list-inside ml-4">
                <li>On Windows: <code className="bg-gray-100 p-1 rounded">venv\Scripts\activate</code></li>
                <li>On macOS and Linux: <code className="bg-gray-100 p-1 rounded">source venv/bin/activate</code></li>
              </ul>
            </li>
            <li>Install dependencies: <code className="bg-gray-100 p-1 rounded">pip install -r requirements.txt</code></li>
            <li>Run the backend server: <code className="bg-gray-100 p-1 rounded">python app.py</code></li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frontend Setup</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Navigate to the frontend directory: <code className="bg-gray-100 p-1 rounded">cd frontend/app</code></li>
            <li>Install dependencies: <code className="bg-gray-100 p-1 rounded">npm install</code></li>
            <li>Start the development server: <code className="bg-gray-100 p-1 rounded">npm run dev</code></li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Documentation</h2>
          <p>For detailed API documentation, please refer to our <Link to="/api-docs" className="text-blue-500 hover:underline">API Documentation</Link> page.</p>
        </section>

        {/*<section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contributing</h2>
          <p>We welcome contributions! Please see our <Link to="/contributing" className="text-blue-500 hover:underline">Contributing Guidelines</Link> for more information on how to get started.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p>If you encounter any issues or have questions, please <Link to="/contact" className="text-blue-500 hover:underline">contact our support team</Link> or open an issue on our GitHub repository.</p>
        </section>*/}
      </main>
      
      <Footer />
    </div>
  );
};

<Route path="/developer-quickstart" element={<DeveloperQuickStart />} />

export default DeveloperQuickStart;