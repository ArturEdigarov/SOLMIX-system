import { Play, Minus, Plus } from 'lucide-react';
import { ManualPumpControl } from '../../wailsjs/go/main/App';
interface PumpCardProps {
    id: number;
    name: string;
    amount: number;
    onAdd: () => void;
    onMinus: () => void;
}

const PumpCard = ({ id, name, amount, onAdd, onMinus } : PumpCardProps) => {

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl backdrop-blur-sm transition-all hover:border-purple-500/30">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-200 tracking-wider uppercase">{name}</h3>
        <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">
          {amount} ML
        </span>
      </div>

      <div className="flex gap-2">
        {/* Кнопки +/- */}
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

        {/* Кнопка старта (Manual) */}
        <button
          onMouseDown={() => ManualPumpControl(id, true)}
          onMouseUp={() => ManualPumpControl(id, false)}
          onMouseLeave={() => ManualPumpControl(id, false)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-95 text-white rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center"
        >
          <Play className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  )
}

export default PumpCard
