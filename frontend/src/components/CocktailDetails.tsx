import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { CornerDownRight, Martini } from 'lucide-react';
import { Button } from "./ui/button"
import { PUMPS } from '../types';
import { useState } from 'react';

import { PourCocktail } from '../../wailsjs/go/main/App';

interface CocktailDetailsProps {
  cocktail: any | null;
  onClose: () => void;
  onStartProcess: (totalTimeMs: number, cocktailName: string, statusText: string, cocktail: any) => void;
}


const CocktailDetails = ({ cocktail, onClose, onStartProcess }: CocktailDetailsProps) => {
  const [status, setStatus] = useState<string>('');
  const handleOrder = async (recipeId: number) => {
    setStatus('Отправка команды в Go...');
    
    try {
      const result = await PourCocktail(recipeId);
      console.log("Проверяем провод:", onStartProcess);
      if (result.totalTimeMs === 0) {
        onClose();
        setStatus(result.status);
        return;
      }

      setStatus(result.status);
      
      onClose();

      // to App.tsx 
      onStartProcess(result.totalTimeMs, result.cocktailName, result.status, cocktail);

    } catch (error) {
      setStatus('Ошибка при заказе');
      console.error(error);
    }
  };

    if (!cocktail) return null;
return (
    <Dialog open={!!cocktail} onOpenChange={(open) => !open && onClose()}>

      <DialogContent className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center text-white uppercase tracking-tight">
            {cocktail.name}
          </DialogTitle>
          <DialogDescription className="text-center mt-2 text-slate-400 font-mono text-xs">
            {cocktail.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Martini className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Zutatenliste
            </h4>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl font-mono text-xs text-slate-300 space-y-2">
            {cocktail.ingredients.map((item: any) => {
              const pump = PUMPS.find((p) => p.id === item.pumpId);
              return (
                <div key={item.pumpId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CornerDownRight className="w-3.5 h-3.5 text-slate-600 mr-2" />
                    <span>{pump ? pump.name : 'Unknown'}</span>
                  </div>
                  <span className="font-bold text-slate-100">{item.amount} ml</span>
                </div>
              );
            })}
          </div>
        </div>

        <Button 
          onClick={() => handleOrder(cocktail.id)}
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-6 rounded-2xl shadow-lg shadow-purple-500/20 text-base uppercase tracking-wider"
        >
          COCKTAIL MIXEN
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default CocktailDetails
