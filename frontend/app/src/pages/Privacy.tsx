
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <Button 
            variant="ghost" 
            className="mb-6" 
            asChild
          >
            <Link to="/auth">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h1>Privacy Policy</h1>
            
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Information We Collect</h2>
            <p>
              We collect information to provide better services to all our users. The information we collect includes:
            </p>
            <ul>
              <li>Personal information you provide when creating an account (name, email, etc.)</li>
              <li>Content you upload, download, or use on our platform</li>
              <li>Transaction information when you make purchases</li>
              <li>Usage data and analytics about how you use our services</li>
              <li>Device information including IP address, browser type, and operating system</li>
            </ul>
            
            <h2>2. How We Use Information</h2>
            <p>
              We use the information we collect from all our services for the following purposes:
            </p>
            <ul>
              <li>Providing, maintaining, and improving our services</li>
              <li>Processing transactions and fulfilling orders</li>
              <li>Sending notifications related to your account and purchases</li>
              <li>Protecting Oncodash App Store and our users from fraud, abuse, and security risks</li>
              <li>Complying with legal obligations</li>
            </ul>
            
            <h2>3. Information Sharing</h2>
            <p>
              We do not share your personal information with companies, organizations, or individuals outside of Oncodash App Store except in the following circumstances:
            </p>
            <ul>
              <li>With your consent</li>
              <li>With trusted partners who process information on our behalf</li>
              <li>For legal reasons if required by applicable law</li>
            </ul>
            
            <h2>4. Data Security</h2>
            <p>
              We work hard to protect Oncodash App Store and our users from unauthorized access, alteration, disclosure, or destruction of information we hold.
              We implement robust security measures including encryption, secure storage, and regular security audits.
            </p>
            
            <h2>5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time through your account settings.
              If you wish to completely delete your account, please contact our support team.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
