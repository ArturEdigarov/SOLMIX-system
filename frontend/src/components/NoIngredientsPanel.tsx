import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "./ui/dialog"
import { AlertTriangle, RefreshCw } from "lucide-react"
interface NoIngredientsProps {
  isOpen: boolean;
  onClose: () => void;

}
const NoIngredientsPanel = ({ isOpen, onClose} : NoIngredientsProps) => {


return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 text-slate-100 rounded-3xl p-8 shadow-2xl max-w-md w-full">
        
        {/* Иконка-предупреждение с градиентным свечением */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30 text-amber-400 mb-4 shadow-inner">
          <AlertTriangle className="h-8 w-8 animate-pulse" />
        </div>

        <DialogHeader className="space-y-2 text-center w-full">
          <DialogTitle className="text-2xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Es fehlen Zutaten
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm leading-relaxed">
            Im System ist nicht genügend Flüssigkeit für die Zubereitung dieses Cocktails. Bitte überprüfe den Bestand oder fülle die Vorräte auf
          </DialogDescription>
        </DialogHeader>

        {/* Кнопка закрытия / действия */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-slate-800/50 active:scale-[0.98]"
          >
            Zurück
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}


export default NoIngredientsPanel
