import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dna, Plus } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-black border-b border-zinc-800">
      <div className="max-w-[1600px] mx-auto w-full px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Dna className="h-5 w-5 text-green-700" />
            <span>Helical</span>
          </Link>
        </div>
        <Button asChild size="sm" variant="outline" className="border-zinc-700">
          <Link to="/create">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Link>
        </Button>
      </div>
    </header>
  );
} 