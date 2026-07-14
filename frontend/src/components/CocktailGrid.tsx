import { Wine } from 'lucide-react';
import { useState } from 'react'
import { COCKTAILS } from '../types';
import CocktailCard from './CocktailCard';
import CocktailDetails from './CocktailDetails';

interface CocktailGridProps {
  onStartProcess: (totalTimeMs: number, cocktailName: string, statusText: string, cocktail: any) => void;
  availableVolumes: Record<number, number>;
}
 
const CocktailGrid = ({ availableVolumes, onStartProcess }: CocktailGridProps) => {

    const [selectedCocktail, setSelectedCocktail] = useState<any | null>(null);

  // Test of amount of ingredients in pumps
  const isCocktailAvailable = (ingredients: typeof COCKTAILS[0]['ingredients']) => {
    return ingredients.every(ing => (availableVolumes[ing.pumpId] || 0) >= ing.amount);
  };


  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <Wine className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-200 tracking-tight">
          Unsere Cocktails
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {COCKTAILS.map((cocktail) => {
          const available = isCocktailAvailable(cocktail.ingredients);

          return (
            <CocktailCard 
              key={cocktail.id} 
              cocktail={cocktail} 
              available={available} 
              onSelect={() => setSelectedCocktail(cocktail)} 
            />
          );
        })}
      </div>

      <CocktailDetails 
        cocktail={selectedCocktail} 
        onClose={() => setSelectedCocktail(null)} 
        onStartProcess={onStartProcess}
      />
    </section>
  );
}

export default CocktailGrid
