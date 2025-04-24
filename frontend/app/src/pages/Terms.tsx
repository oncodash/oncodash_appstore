
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
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
            <h1>Terms of Service</h1>
            
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to Oncodash App Store. By using our services, you agree to these terms. Please read them carefully.
            </p>
            
            <h2>2. Using Our Services</h2>
            <p>
              You must follow any policies made available to you within the Services. Don't misuse our Services.
              You may use our Services only as permitted by law. We may suspend or stop providing our Services to you
              if you do not comply with our terms or policies or if we are investigating suspected misconduct.
            </p>
            
            <h2>3. Your Oncodash App Store Account</h2>
            <p>
              You need a Oncodash App Store Account to use most of our services. When you create an account, you provide us with personal information.
              You are responsible for the activity that happens on or through your Oncodash App Store Account. 
              Safeguard your password. If you learn of any unauthorized use of your password or account, please contact support immediately.
            </p>
            
            <h2>4. Privacy and Copyright Protection</h2>
            <p>
              Our privacy policies explain how we treat your personal data and protect your privacy when you use our Services. 
              By using our Services, you agree that Oncodash App Store can use such data in accordance with our privacy policies.
            </p>
            
            <h2>5. Software in our Services</h2>
            <p>
              Oncodash App Store gives you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use the software provided to you as part of the Services.
              This license is for the sole purpose of enabling you to use and enjoy the benefit of the Services as provided by Oncodash App Store, in the manner permitted by these terms.
            </p>
            
            <h2>6. Modifying and Terminating our Services</h2>
            <p>
              We are constantly changing and improving our Services. We may add or remove functionalities or features, 
              and we may suspend or stop a Service altogether.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
