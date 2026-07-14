import { CheckCircle2, AlertTriangle, Martini } from 'lucide-react'

interface CocktailCardProps {
  cocktail: any;
  available: boolean;
  onSelect: () => void;
}


const CocktailCard = ({ cocktail, available, onSelect }: CocktailCardProps) => {
    return (
    <div
      className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 bg-slate-900/40 backdrop-blur-sm ${
        available
          ? 'border-slate-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1'
          : 'border-slate-900/50 opacity-60'
      }`}
    >
      {/* Картинка */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={cocktail.image}
          alt={cocktail.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        {/* Статус-плашка */}
        <div className="absolute top-3 right-3">
          {available ? (
            <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              <CheckCircle2 className="w-3 h-3" />
              Bereit
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              <AlertTriangle className="w-3 h-3" />
              Leer
            </span>
          )}
        </div>

        <div className="absolute top-3 left-3">
          {cocktail.isAlcoholic ? (
            <span className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              <Martini className="w-3 h-3" />
              Alcoholic
            </span>
          ) : (
            null
          )}
        </div>
      </div>

      {/* Контент */}
      <div className="p-5 flex flex-col justify-between h-[160px]">
        <div>
          <h3 className="text-sm font-black text-slate-100 group-hover:text-purple-400 transition-colors duration-300 uppercase tracking-wide">
            {cocktail.name}
          </h3>
          <p className="text-slate-500 text-[11px] mt-2 line-clamp-2 font-mono leading-relaxed">
            {cocktail.description}
          </p>
        </div>

        {/* Кнопка */}
        {available ? (
          <div 
            onClick={onSelect}
            className="w-full py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 bg-slate-950 border border-slate-800 text-slate-300 hover:bg-purple-600 hover:border-purple-500 hover:text-white text-center cursor-pointer shadow-lg"
          >
            Auswählen
          </div>
        ) : (
          <div className="w-full py-2 rounded-xl font-bold text-xs uppercase tracking-widest bg-slate-950/50 border border-slate-900 text-slate-700 cursor-not-allowed text-center">
            Zutaten fehlen
          </div>
        )}
      </div>
    </div>
  )
}

export default CocktailCard
