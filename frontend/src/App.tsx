import "./index.css"
import BarcodeScanner from './components/BarcodeScanner';
import CocktailGrid from './components/CocktailGrid';
import { Activity } from "lucide-react";
import { useState } from "react";
import { useRef, useEffect } from "react";
import Process from "./components/Process";
import AdminPanel from "./components/AdminPanel";
import { LoadAmounts, ProcessPour, PourByBarcode } from "../wailsjs/go/main/App";
export default function App() {

  const [amounts, setAmounts] = useState<Record<number, number>>({});
  useEffect(() => {
    LoadAmounts().then(data => {
        const numericData = Object.entries(data).reduce((acc, [key, val]) => {
            acc[parseInt(key)] = val;
            return acc;
        }, {} as Record<number, number>);
        setAmounts(numericData);
    });
  }, []);


  const [status, setStatus] = useState<string>('Готов к работе. Поднесите баркод к сканеру...');
  const barcodeBuffer = useRef<string>('');

  // Progress and Admin Panel states
  const [isProcessOpen, setIsProcessOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [processTotalTime, setProcessTotalTime] = useState<number>(0);
  const [processCocktailName, setProcessCocktailName] = useState<string>('');


  const handleStartProcess = async (totalTimeMs: number, cocktailName: string, statusText: string, cocktail: any) => {
    if (cocktail) {
        await ProcessPour(cocktail.id);
        
        setAmounts(prev => {
            const next = { ...prev };
            cocktail.ingredients.forEach((ing: any) => {
                next[ing.pumpId] = (next[ing.pumpId] || 0) - ing.amount;
            });
            return next;
        });
    }


    setProcessTotalTime(totalTimeMs);
    setProcessCocktailName(cocktailName);
    setStatus(statusText);
    setIsProcessOpen(true); // Open a Dialog with progress bar
  };
  const refreshAmounts = async () => {
    const data = await LoadAmounts();
    const numericData = Object.entries(data).reduce((acc, [key, val]) => {
        acc[parseInt(key)] = val;
        return acc;
    }, {} as Record<number, number>);
    setAmounts(numericData);
  };
  useEffect(() => {
    refreshAmounts();
  }, [])

  const handleAdminPanel = () => {
    setIsAdminPanelOpen(true);
  };
  useEffect(() => {
    // Keyboard event listener for barcode scanning
    const handleKeyDown = async (event: KeyboardEvent) => {
    if (isProcessOpen) return;


    if ([' ', 'Enter'].includes(event.key)) {
        event.preventDefault();
    }
    if (event.key === 'Enter') {
      const finalBarcode = barcodeBuffer.current.trim();
      barcodeBuffer.current = '';

    if (finalBarcode.length === 0) return;

    setStatus(`Считан код: [${finalBarcode}]. Отправка в автомат...`);
    try {
    
      const result = await PourByBarcode(finalBarcode);

    // Admin panel trigger
    if (result.status === 'admin') {
      handleAdminPanel()
    }
    if (result.totalTimeMs === 0) {
      setStatus(result.status);
      console.error('Ошибка бэкенда: ', result.status);
    return;
    }
    await refreshAmounts();
    // Send the result to the process handler
    handleStartProcess(result.totalTimeMs, result.cocktailName, result.status, null);

    } catch (error) {
      setStatus('Критическая ошибка бэкенда при чтении сканера');
      console.error(error);
    }
    return;
    }

    if (event.key.length === 1) {
      barcodeBuffer.current += event.key;
    }
}; 


    // Listener
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProcessOpen]);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-500/30">
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <header className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-900 pb-8 mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 mr-4">
                    <Activity size={50} className="animate-pulse" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    SOLMIX BARSYSTEM
                  </h1>
                  <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-mono">
                    Rezept wählen oder QR-Code scannen
                  </p>
                </div>
            </div>
          </div>
          
          <BarcodeScanner />
        </header>

        <CocktailGrid availableVolumes={amounts} onStartProcess={handleStartProcess} />

        <Process 
          isOpen={isProcessOpen}
          totalTimeMs={processTotalTime}
          cocktailName={processCocktailName}
          onClose={() => setIsProcessOpen(false)} 
        />
        <AdminPanel 
          isOpen={isAdminPanelOpen}
          amounts={amounts} 
          setAmounts={setAmounts}
          onClose={() => setIsAdminPanelOpen(false)} 
        />
      </div>
    </div>
  );
}