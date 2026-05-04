import type { Category } from './categories';

const CATEGORY_RULES: { category: Category; keywords: string[]; weight: number }[] = [
  {
    category: 'food',
    weight: 1,
    keywords: [
      'restaurant', 'reštaurácia', 'restaurace', 'ristorante', 'gastro',
      'pizz', 'burger', 'sushi', 'kebab', 'bistro', 'café', 'cafe', 'coffee',
      'starbucks', 'mcdonald', 'kfc', 'subway', 'domino',
      'grocery', 'potraviny', 'albert', 'lidl', 'kaufland', 'tesco', 'billa',
      'aldi', 'penny', 'coop', 'spar', 'edeka', 'rewe', 'carrefour',
      'supermarket', 'market', 'obchod', 'bakery', 'pekáreň', 'pekárna',
      'food', 'jedlo', 'jídlo', 'essen', 'mäso', 'maso', 'zelenina',
    ],
  },
  {
    category: 'transport',
    weight: 1,
    keywords: [
      'taxi', 'uber', 'bolt', 'lyft', 'grab',
      'fuel', 'petrol', 'diesel', 'benzín', 'nafta', 'gas station',
      'shell', 'bp', 'omv', 'mol', 'orlen', 'eni', 'total',
      'parking', 'parkovanie', 'parkování', 'parken',
      'toll', 'mýto', 'mýtné', 'maut',
      'car wash', 'autoumyváreň',
    ],
  },
  {
    category: 'travel',
    weight: 1,
    keywords: [
      'hotel', 'hostel', 'motel', 'airbnb', 'booking',
      'flight', 'airline', 'let', 'letenka', 'flug',
      'train', 'vlak', 'zug', 'bahn', 'sncf', 'öbb',
      'bus', 'autobus', 'flixbus', 'regiojet', 'eurolines',
      'ryanair', 'wizz', 'easyjet', 'lufthansa',
      'travel', 'cestovanie', 'cestování', 'reise',
    ],
  },
  {
    category: 'office',
    weight: 1,
    keywords: [
      'office', 'kancelária', 'kancelář', 'büro',
      'paper', 'papier', 'toner', 'ink', 'atrament',
      'staples', 'stationery', 'kancelárske',
      'print', 'tlač', 'tisk', 'druck', 'copy', 'kópia',
      'software', 'license', 'licencia', 'licence',
    ],
  },
  {
    category: 'health',
    weight: 1,
    keywords: [
      'pharmacy', 'lekáreň', 'lékárna', 'apotheke', 'pharmacie',
      'doctor', 'lekár', 'lékař', 'arzt', 'médecin',
      'hospital', 'nemocnica', 'nemocnice', 'krankenhaus',
      'clinic', 'klinika', 'ambulancia',
      'dentist', 'zubár', 'zubař', 'zahnarzt',
      'optik', 'optika', 'glasses', 'okuliare',
      'dr.', 'mudr.', 'med.',
    ],
  },
  {
    category: 'entertainment',
    weight: 1,
    keywords: [
      'cinema', 'kino', 'theater', 'divadlo', 'theatre',
      'concert', 'koncert', 'musik', 'music',
      'netflix', 'spotify', 'hbo', 'disney',
      'game', 'hra', 'spiel', 'sport', 'gym', 'fitness',
      'museum', 'múzeum', 'muzeum', 'gallery', 'galéria',
      'zoo', 'park', 'aquapark', 'bowling',
    ],
  },
  {
    category: 'utilities',
    weight: 1,
    keywords: [
      'electric', 'elektrina', 'elektřina', 'strom',
      'water', 'voda', 'wasser', 'vodárne',
      'gas', 'plyn', 'plynárne',
      'internet', 'wifi', 'broadband',
      'phone', 'telefón', 'telefon', 'mobile', 'mobil',
      'telekom', 'o2', 'orange', 'vodafone', 't-mobile',
      'insurance', 'poistenie', 'pojištění', 'versicherung',
      'rent', 'nájom', 'nájem', 'miete',
    ],
  },
];

export function smartCategorize(merchant: string, ocrText: string = ''): { category: Category; confidence: number } {
  const searchText = `${merchant} ${ocrText}`.toLowerCase();
  let bestCategory: Category = 'other';
  let bestScore = 0;

  for (const rule of CATEGORY_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (searchText.includes(keyword)) {
        score += rule.weight;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.category;
    }
  }

  const confidence = bestScore > 0 ? Math.min(1, bestScore * 0.3) : 0;
  return { category: bestCategory, confidence };
}
