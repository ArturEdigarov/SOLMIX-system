import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { PUMPS } from '../types';
import PumpCard from "./PumpCard";
import { SaveAmounts } from "../../wailsjs/go/main/App";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  amounts: Record<number, number>;
  setAmounts: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}
const AdminPanel = ({ isOpen, onClose, amounts, setAmounts } : AdminPanelProps) => {

// + - Admin Panel logic
const addAmount = (id: number) => {
    setAmounts(prev => {
      const newAmounts = { ...prev, [id]: (prev[id] || 0) + 50 };
      SaveAmounts(newAmounts); // save it in Go
      return newAmounts;
    });
  };

  const minusAmount = (id: number) => {
    setAmounts(prev => {
      const current = prev[id] || 0;
      const newAmounts = { ...prev, [id]: current <= 50 ? 0 : current - 50 };
      SaveAmounts(newAmounts); // save it in Go
      return newAmounts;
    });
  };


return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl p-8 flex flex-col items-center z-[9999] !max-w-none !w-full !h-full">       
        <DialogHeader className="items-center text-center w-full">
          <DialogTitle className="text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            ADMIN
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PUMPS.map((pump) => {
          return (
            <PumpCard 
              key={pump.id} 
              id={pump.id}
              name={pump.name}
              amount={amounts[pump.id]}
              onAdd={() => addAmount(pump.id)}
              onMinus={() => minusAmount(pump.id)}
            />
          );
        })}
      </div>
      </DialogContent>
    </Dialog>
  );
}
export default AdminPanel
