
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog"
import { Scan } from 'lucide-react'
import { QRCode } from 'react-qr-code'

const BarcodeScanner = () => {
    return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-slate-200 hover:text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/10 active:scale-95">
        <Scan className="w-5 h-5" />
        <span>Barcode scannen</span>
      </DialogTrigger>

      <DialogContent className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl p-8 max-w-sm max-h-[90vh] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-center text-white uppercase tracking-tight">
            Scanner Aktivieren
          </DialogTitle>
          <DialogDescription className='text-center mt-2 text-slate-400 font-mono text-xs'>
            Mix dir deinen Favoriten direkt von deinem Smartphone aus.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <QRCode 
              value="https://solmix-bar.vercel.app/"
              size={180}
              fgColor="#0f172a"
            />
          </div>

          <p className="text-xs font-mono text-slate-400 text-center tracking-wider uppercase">
            Scanne den QR-Code zum Starten
          </p>

          <div className="w-full text-center space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <p className="text-[11px] leading-relaxed text-slate-300">
              Bereits fertig zusammengestellt? <br/>
              <span className="text-purple-400 font-bold block mt-1 uppercase tracking-widest">Zeige deinen Barcode dem Scanner</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BarcodeScanner
