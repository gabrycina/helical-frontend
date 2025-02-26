import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dna, Plus } from 'lucide-react';

export default function Navbar() {

  return (
    <nav className="sticky top-0 w-full z-50">
      <div className="flex items-center justify-between px-6 relative w-full h-[66px] bg-black/[0.08] backdrop-blur-[8px] transition-colors">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              rgba(255,255,255,0.16) 0%, 
              rgba(255,255,255,0) 35%, 
              rgba(255,255,255,0) 65%, 
              rgba(255,255,255,0.16) 100%
            )`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            padding: "1.2px",
          }}
        />
        
        {/* Logo */}
        <Link 
          to="/home" 
          className="flex items-center gap-2 text-xl font-light relative z-10"
        >
          <Dna className="h-6 w-6 text-teal-500" />
          Helical
        </Link>

        {/* Navigation Links */}
        <div className="relative z-10">
          <Button 
            asChild 
            size="sm" 
            variant="outline" 
            className="border-zinc-700/50 hover:border-zinc-700"
          >
            <Link to="/create" className="flex items-center gap-2"> 
              <Plus className="h-4 w-4" />
              New Workflow
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
} 