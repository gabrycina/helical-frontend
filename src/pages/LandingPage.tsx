import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black">
      {/* Add noise texture */}
      <div className="fixed inset-0 noise" />
      
      {/* Spline Canvas */}
      <div className="absolute inset-0">
        <motion.iframe 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
          src='https://my.spline.design/dnaparticles-01fe7a4d0c8b8aac9587a21fbbe6b7d8/' 
          className="w-full h-full border-0"
          title="DNA Particles Animation"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-black via-black to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.h1 
            className="text-7xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Helical
          </motion.h1>
          <motion.p 
            className="text-xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            The Platform for Bio Foundation Models
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Button 
              className="button-primary text-lg px-12 border-0"
              onClick={() => {
                // Animate out before navigation
                const elements = document.querySelectorAll('.animate-out');
                elements.forEach(el => {
                  if (el instanceof HTMLElement) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                  }
                });
                setTimeout(() => navigate('/home'), 500);
              }}
            >
              Get Started
              <ArrowRight size={15} className='ml-2'/>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 