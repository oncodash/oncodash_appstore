
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Abstract background shapes */}

      <div className="absolute ">

        <div className="ml-5 -mt-40 w-80 h-80 bg-primary/70 rounded-full -translate-y-1/3">
        <div align='middle' style={{fontWeight:'bold', fontSize:'40px', color:'white', width: '100%', height: '100%', paddingTop: '40%'}}>
        <img className="logo" align="center" src="oncodash-logo.svg" width="70%" alt="Oncodash Logo" />
        App Store
        </div>
          </div>

        {/*<div className="absolute top-1/4 right-0 w-64 h-64 rounded-full translate-x-1/3" />*/}
        {/*<div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full translate-y-1/2" />*/}

      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: loaded ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >

              </motion.div>
              
              <motion.h1 
                className="heading-xl text-balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Discover & Share <br className="hidden md:inline" />
                <span className="text-primary">Oncodash applications</span>
              </motion.h1>
            </div>
            
            <motion.p 
              className="lead max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              The application store for discovering Oncodash software packages, tools and metadata schemas. Find what you need or share your applications with other Oncodash users.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/marketplace">
                  Explore Applications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/upload">
                  Share Your Software
                  <Download className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.9 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
              <div className="relative shadow-xl rounded-2xl overflow-hidden bg-white">
                <img 
                  src="/ngseq.jpg"
                  alt="App Store"
                  className="w-full h-auto rounded-2xl" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
