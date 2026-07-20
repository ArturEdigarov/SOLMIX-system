import { Play, Minus, Plus } from 'lucide-react';
import { ManualPumpControl } from '../../wailsjs/go/main/App';
import { useState } from 'react';
interface PumpCardProps {
    id: number;
    name: string;
    amount: number;
    onAdd: () => void;
    onMinus: () => void;
}


const PumpCard = ({ id, name, amount, onAdd, onMinus } : PumpCardProps) => {

const [pumpActiveStates, setPumpActiveStates] = useState(Array(9).fill(false));
const handleManualToggle = (id: number) => {
    const newStates = [...pumpActiveStates];
    newStates[id] = !newStates[id];
    setPumpActiveStates(newStates);
    ManualPumpControl(id);
    
};
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl backdrop-blur-sm transition-all hover:border-purple-500/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-200 tracking-wider uppercase">{name}</h3>
        <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">
          {amount} ML
        </span>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onMinus}
          className="flex-1 py-3 bg-slate-800 hover:bg-red-950 border border-slate-700 hover:border-red-900 text-slate-400 hover:text-red-400 rounded-xl transition-all flex justify-center"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <button 
          onClick={onAdd}
          className="flex-1 py-3 bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-900 text-slate-400 hover:text-emerald-400 rounded-xl transition-all flex justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleManualToggle(id)}
          className={`px-6 py-3 rounded-xl transition-all flex items-center justify-center font-bold text-white shadow-lg active:scale-95
            ${pumpActiveStates[id] 
                ? "bg-red-500 shadow-red-500/20 hover:bg-red-400" // Если включена — красная
                : "bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/20 hover:from-purple-500 hover:to-pink-500" // Если выключена — градиент
            }`}
          >
          <Play className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  )
}

export default PumpCard
