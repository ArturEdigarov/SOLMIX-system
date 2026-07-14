export interface Pump {
  id: number;
  name: string;
  isAlcohol: boolean;
  color: string;
}

export interface IngredientRequirement {
  pumpId: number;
  amount: number; 
}

export interface Cocktail {
  id: number;
  name: string;
  description: string;
  image: string; 
  ingredients: IngredientRequirement[];
  isAlcoholic?: boolean; 
}

export const PUMPS: Pump[] = [
  { id: 0, name: 'Wodka', isAlcohol: true, color: '#e2e8f0' },
  { id: 1, name: 'Orangensaft', isAlcohol: false, color: '#f97316' },
  { id: 2, name: 'Gin', isAlcohol: true, color: '#38bdf8' },
  { id: 3, name: 'Granatapfelsirup', isAlcohol: false, color: '#dc2626' },
  { id: 4, name: 'Weisser Rum', isAlcohol: true, color: '#94a3b8' },
  { id: 5, name: 'Erdbeersirup', isAlcohol: false, color: '#f43f5e' },
  { id: 6, name: 'Limettensirup', isAlcohol: false, color: '#84cc16' },
  { id: 7, name: 'Tonic Water', isAlcohol: false, color: '#a7f3d0' },
  { id: 8, name: 'Ananas-Kokos', isAlcohol: false, color: '#fef08a' },
];


export const COCKTAILS: Cocktail[] = [
  {
    id: 1,
    name: 'Wodka-O',
    description: 'Eine klassische Kombination aus Wodka und Orangensaft.',
    image: './Screwdriver.png',
    ingredients: [
      { pumpId: 0, amount: 50 },
      { pumpId: 1, amount: 150 }
    ],
    isAlcoholic: true,
  },
  {
    id: 2,
    name: 'Gin Tonic mit Limette',
    description: 'Ein erfrischender Klassiker mit der angenehmen Bitternote von Tonic Water und der zitrischen Säure von Limettensirup.',
    image: './gin-tonic-lim.png',
    ingredients: [
      { pumpId: 2, amount: 50 },
      { pumpId: 7, amount: 130 },
      { pumpId: 6, amount: 20 },
    ],
    isAlcoholic: true,
  },
  {
    id: 3,
    name: 'Tropischer Rum-Punsch',
    description: 'Ein farbenfroher, süßer und absolut sommerlicher Cocktail. Rum harmoniert perfekt mit Ananas, während Erdbeere für ein fruchtig-beeriges Finish sorgt.',
    image: './tropic-rum.png',
    ingredients: [
      { pumpId: 4, amount: 50 },
      { pumpId: 8, amount: 120 },
      { pumpId: 5, amount: 40 }
    ],
    isAlcoholic: true,
  },
    {
    id: 4,
    name: 'Ruby Sunset',
    description: 'Ein wunderschöner, starker Cocktail auf Wodka-Basis. Der Granatapfelsirup setzt sich am Boden ab und sorgt für einen faszinierenden Sonnenuntergangs-Effekt, während Orangensaft den Geschmack harmonisch abrundet.',
    image: './ruby-sunset.png',
    ingredients: [
      { pumpId: 0, amount: 50 },
      { pumpId: 1, amount: 120 },
      { pumpId: 3, amount: 30 }
    ],
    isAlcoholic: true,
  },
    {
    id: 5,
    name: 'Erdbeer-Gin-Fizz',
    description: 'Ein süßer, beeriger Longdrink. Gin bringt feine Wacholder-Noten ein, Erdbeere sorgt für die Süße, und das Tonic Water erfrischt angenehm mit einem prickelnden Gefühl auf der Zunge.',
    image: './strawberry-gin-fizz.png',
    ingredients: [
      { pumpId: 2, amount: 40 },
      { pumpId: 5, amount: 30 },
      { pumpId: 7, amount: 130 }
    ],
    isAlcoholic: true,
  },
  {
    id: 6,
    name: 'Alkoholfreie Pina Colada',
    description: 'Eine cremige, sanfte Mischung aus Ananas und Kokosnuss, harmonisch abgerundet durch die leichte Säure von Orangensaft. Ein Drink, der dich gedanklich direkt an den Strand versetzt.',
    image: './pinacolada.png',
    ingredients: [
      { pumpId: 8, amount: 140 },
      { pumpId: 1, amount: 60 }
    ],
    isAlcoholic: false,
  },
  {
    id: 7,
    name: 'Erdbeer-Limonade',
    description: 'Ein süßes, prickelndes Getränk mit dem intensiven Geschmack reifer Erdbeeren und einem belebenden Limetten-Nachgeschmack.',
    image: './strawberry.png',
    ingredients: [
      { pumpId: 7, amount: 140 },
      { pumpId: 6, amount: 30 },
      { pumpId: 5, amount: 30 }
    ],
    isAlcoholic: false,
  },
    {
    id: 8,
    name: 'Sunrise Mocktail',
    description: 'Ein optisch wunderschöner Cocktail. Der dichte Granatapfelsirup sinkt langsam durch den Orangensaft nach unten und erzeugt so einen faszinierenden Farbverlauf.',
    image: './Mocktail.png',
    ingredients: [
      { pumpId: 1, amount: 170 },
      { pumpId: 3, amount: 30 }
    ],
    isAlcoholic: false,
  },
    {
    id: 9,
    name: 'Exotischer Frucht-Mix',
    description: 'Ein sämiger, gehaltvoller Fruchtmix, bei dem tropische Ananas und Kokosnuss auf herbe Granatapfelnoten treffen. Ein sehr facettenreicher Dessert-Geschmack.',
    image: './fruit-mix.png',
    ingredients: [
      { pumpId: 8, amount: 120 },
      { pumpId: 1, amount: 60 },
      { pumpId: 3, amount: 20 }
    ],
    isAlcoholic: false,
  },
];