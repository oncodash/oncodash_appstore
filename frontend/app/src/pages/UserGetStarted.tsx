import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const UserGetStarted = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto pt-24 px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Get Started with Oncodash App Store</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. Create an Account</h2>
          <div className="flex items-start space-x-6">
            <div className="flex-1">
              <p className="mb-4">To get started, create an account on the Oncodash App Store. This will allow you to browse, download, and manage applications.</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Click on the "Sign Up" button in the top right corner</li>
                <li>Fill in your details: name, email, and password</li>
                <li>Click "Create Account" to complete the registration process</li>
              </ol>
              <Link to="/auth?tab=register" className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Sign Up Now
              </Link>
            </div>
            <div className="flex-1">
              <div className="bg-gray-200 w-full aspect-video flex items-center justify-center text-gray-500">
                <img src="/sign_up.png" alt="Sign Up" className="w-full h-auto rounded-2xl"/>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Browse the Marketplace</h2>
          <div className="flex items-start space-x-6">
            <div className="flex-1">
              <p className="mb-4">Explore our marketplace to find applications that suit your needs. You can filter by category, search for specific apps, or browse through featured applications.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Use the search bar to find specific applications</li>
                <li>Filter applications by category or Oncodash version</li>
                <li>Click on an application to view more details</li>
              </ul>
              <Link to="/marketplace" className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Visit Applications
              </Link>
            </div>
            <div className="flex-1">
              <div className="bg-gray-200 w-full aspect-video flex items-center justify-center text-gray-500">
                <img src="/applications.png" alt="Applications" className="w-full h-auto rounded-2xl"/>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Download and Install Applications</h2>
          <div className="flex items-start space-x-6">
            <div className="flex-1">
              <p className="mb-4">Once you've found an application you want to use, you can easily download and install it.</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Click on the application to view its details</li>
                <li>Click the "Download" button</li>
                <li>Follow the installation instructions provided with the application</li>
              </ol>
            </div>
            <div className="flex-1">
              <div className="bg-gray-200 w-full aspect-video flex items-center justify-center text-gray-500">
                <img src="/product_details.png" alt="Product details" className="w-full h-auto rounded-2xl"/>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Share Software</h2>
          <div className="flex items-start space-x-6">
            <div className="flex-1">
              <p className="mb-4">Share your application in the "Share Software" section.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Log in</li>
                <li>Fill in the fields or upload TOML configuration file</li>
                <li>Click Next Step</li>
                <li>Upload application package file as a single file (any format, URL or/and file must be provided)</li>
                <li>Set product URL if any</li>
                <li>Select product image</li>
                <li>Click Upload Software</li>
              </ul>
              <Link to="/upload" className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Go to Share Software
              </Link>
            </div>
            <div className="flex-1">
              <div className="bg-gray-200 w-full aspect-video flex items-center justify-center text-gray-500">
                <img src="/upload1.png" alt="Upload1" className="w-full h-auto rounded-2xl"/>
                </div>
              <div className="bg-gray-200 w-full aspect-video flex items-center justify-center text-gray-500">
                <img src="/upload2.png" alt="Upload2" className="w-full h-auto rounded-2xl"/>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Manage Your Account and Applications</h2>
          <div className="flex items-start space-x-6">
            <div className="flex-1">
              <p className="mb-4">Keep track of your downloaded applications and manage your account settings in the "My Account" section.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>View your downloaded applications</li>
                <li>Update your profile information</li>
                <li>Change your password</li>
              </ul>
              <Link to="/my-account" className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Go to My Account
              </Link>
            </div>
            <div className="flex-1">
              <div className="bg-gray-200 w-full aspect-video flex items-center justify-center text-gray-500">
                  <img src="/my_account.png" alt="My account" className="w-full h-auto rounded-2xl"/>
              </div>
                <div className="bg-gray-200 w-full aspect-video flex items-center justify-center text-gray-500">
                  <img src="/edit_product.png" alt="Edit product" className="w-full h-auto rounded-2xl"/>
                </div>

            </div>
          </div>
        </section>

        {/*<section>
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p>If you have any questions or need assistance, don't hesitate to contact our support team or check out our FAQ section.</p>
          <div className="mt-4 space-x-4">
            <Link to="/faq" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              View FAQ
            </Link>
            <Link to="/contact" className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
              Contact Support
            </Link>
          </div>
        </section>*/}
      </main>
      
      <Footer />
    </div>
  );
};

export default UserGetStarted;