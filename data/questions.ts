export type Question = { q: string; o: string[]; c: string };
export type DifficultyQuestions = { easy: Question[]; medium: Question[]; hard: Question[] };
export type QuestionBank = Record<number, DifficultyQuestions>;

export const universalQuestions: QuestionBank = {
  0: {
    easy: [
      { q: "12 + 8 = ?", o: ["18", "20", "22"], c: "20" },
      { q: "15 - 7 = ?", o: ["6", "8", "10"], c: "8" },
      { q: "6 × 7 = ?", o: ["40", "42", "45"], c: "42" },
      { q: "25 ÷ 5 = ?", o: ["4", "5", "6"], c: "5" },
      { q: "9 + 11 = ?", o: ["18", "20", "22"], c: "20" },
      { q: "8 × 8 = ?", o: ["60", "64", "68"], c: "64" },
      { q: "48 ÷ 6 = ?", o: ["7", "8", "9"], c: "8" },
      { q: "5 × 9 = ?", o: ["40", "45", "50"], c: "45" },
      { q: "36 ÷ 4 = ?", o: ["8", "9", "10"], c: "9" },
      { q: "7 × 8 = ?", o: ["54", "56", "58"], c: "56" },
      { q: "63 ÷ 9 = ?", o: ["6", "7", "8"], c: "7" },
      { q: "9 × 9 = ?", o: ["72", "81", "90"], c: "81" },
      { q: "56 ÷ 7 = ?", o: ["7", "8", "9"], c: "8" },
      { q: "13 + 17 = ?", o: ["28", "30", "32"], c: "30" },
      { q: "6 × 9 = ?", o: ["48", "54", "60"], c: "54" },
      { q: "14 - 5 = ?", o: ["8", "9", "10"], c: "9" },
      { q: "4 × 6 = ?", o: ["24", "26", "28"], c: "24" },
      { q: "32 ÷ 8 = ?", o: ["3", "4", "5"], c: "4" },
      { q: "10 + 10 = ?", o: ["18", "20", "22"], c: "20" },
      { q: "3 × 7 = ?", o: ["19", "21", "23"], c: "21" },
      { q: "45 ÷ 9 = ?", o: ["4", "5", "6"], c: "5" },
      { q: "11 + 14 = ?", o: ["23", "25", "27"], c: "25" },
      { q: "2 × 15 = ?", o: ["28", "30", "32"], c: "30" },
      { q: "72 ÷ 8 = ?", o: ["8", "9", "10"], c: "9" },
      { q: "5 × 5 = ?", o: ["20", "25", "30"], c: "25" },
    ],
    medium: [
      { q: "sin(30°) = ?", o: ["½", "√3/2", "1"], c: "½" },
      { q: "cos(60°) = ?", o: ["½", "√3/2", "1"], c: "½" },
      { q: "5! = ?", o: ["100", "120", "150"], c: "120" },
      { q: "tan(45°) = ?", o: ["0", "1", "√3"], c: "1" },
      { q: "2⁴ = ?", o: ["8", "16", "32"], c: "16" },
      { q: "sin(90°) = ?", o: ["0", "½", "1"], c: "1" },
      { q: "cos(0°) = ?", o: ["0", "½", "1"], c: "1" },
      { q: "4! = ?", o: ["20", "24", "28"], c: "24" },
      { q: "3³ = ?", o: ["9", "27", "81"], c: "27" },
      { q: "sin(45°) = ?", o: ["½", "√2/2", "√3/2"], c: "√2/2" },
      { q: "6! = ?", o: ["600", "720", "840"], c: "720" },
      { q: "1/2 + 1/4 = ?", o: ["1/6", "2/4", "3/4"], c: "3/4" },
      { q: "tan(0°) = ?", o: ["0", "1", "√3"], c: "0" },
      { q: "cos(90°) = ?", o: ["0", "½", "1"], c: "0" },
      { q: "2⁵ = ?", o: ["16", "32", "64"], c: "32" },
      { q: "√4 = ?", o: ["2", "3", "4"], c: "2" },
      { q: "sin(60°) = ?", o: ["½", "√2/2", "√3/2"], c: "√3/2" },
      { q: "tan(60°) = ?", o: ["1", "√3", "½"], c: "√3" },
      { q: "3⁴ = ?", o: ["81", "72", "64"], c: "81" },
      { q: "1/3 + 1/3 = ?", o: ["1/3", "1/6", "2/3"], c: "2/3" },
      { q: "2³ = ?", o: ["4", "6", "8"], c: "8" },
      { q: "log₃(9) = ?", o: ["1", "2", "3"], c: "2" },
    ],
    hard: [
      { q: "∫x dx = ?", o: ["x", "x²/2 + C", "2x + C"], c: "x²/2 + C" },
      { q: "d/dx(sin x) = ?", o: ["cos x", "-sin x", "-cos x"], c: "cos x" },
      { q: "lim(x→0) sin(x)/x = ?", o: ["0", "1", "∞"], c: "1" },
      { q: "e^(iπ) + 1 = ?", o: ["0", "1", "2"], c: "0" },
      { q: "d/dx(eˣ) = ?", o: ["eˣ", "xeˣ", "xe^(x-1)"], c: "eˣ" },
      { q: "∫sin x dx = ?", o: ["cos x + C", "-cos x + C", "sin x + C"], c: "-cos x + C" },
      { q: "d/dx(ln x) = ?", o: ["1/x", "x", "ln x"], c: "1/x" },
      { q: "∫eˣ dx = ?", o: ["eˣ + C", "xeˣ + C", "e^(x+1) + C"], c: "eˣ + C" },
      { q: "d/dx(x²) = ?", o: ["x", "2x", "x²"], c: "2x" },
      { q: "log₂(8) = ?", o: ["2", "3", "4"], c: "3" },
    ],
  },
  1: {
    easy: [
      { q: "'Hello' means ?", o: ["Goodbye", "Greeting", "Bye"], c: "Greeting" },
      { q: "'Apple' = ?", o: ["Fruit", "Color", "Number"], c: "Fruit" },
      { q: "Alphabet has ? letters", o: ["24", "25", "26"], c: "26" },
      { q: "'Happy' = ?", o: ["Sad", "Joyful", "Angry"], c: "Joyful" },
      { q: "'Big' means ?", o: ["Small", "Large", "Tiny"], c: "Large" },
      { q: "'Fast' opposite?", o: ["Quick", "Slow", "Speed"], c: "Slow" },
      { q: "'Old' opposite?", o: ["New", "Young", "Small"], c: "Young" },
      { q: "'Beautiful' = ?", o: ["Ugly", "Pretty", "Plain"], c: "Pretty" },
      { q: "'Start' opposite?", o: ["Begin", "End", "Middle"], c: "End" },
      { q: "'Friend' = ?", o: ["Enemy", "Companion", "Stranger"], c: "Companion" },
      { q: "'Hot' opposite?", o: ["Warm", "Cold", "Cool"], c: "Cold" },
      { q: "'Strong' = ?", o: ["Weak", "Powerful", "Soft"], c: "Powerful" },
      { q: "'Dark' opposite?", o: ["Bright", "Light", "Clear"], c: "Bright" },
      { q: "'Quiet' = ?", o: ["Silent", "Loud", "Soft"], c: "Silent" },
      { q: "'Short' opposite?", o: ["Long", "Tall", "Big"], c: "Long" },
      { q: "'Clean' = ?", o: ["Dirty", "Neat", "Pure"], c: "Neat" },
      { q: "'Rich' opposite?", o: ["Poor", "Wealthy", "Money"], c: "Poor" },
      { q: "'Happy' opposite?", o: ["Sad", "Joyful", "Fun"], c: "Sad" },
      { q: "'Red' is a ?", o: ["Noun", "Color", "Verb"], c: "Color" },
      { q: "'Cat' is ?", o: ["Verb", "Animal", "Color"], c: "Animal" },
    ],
    medium: [
      { q: "Present Continuous uses?", o: ["Do", "Am/Is/Are", "Have"], c: "Am/Is/Are" },
      { q: "Past Tense marker?", o: ["-ing", "-ed", "-ly"], c: "-ed" },
      { q: "Plural 'child' = ?", o: ["childs", "children", "childes"], c: "children" },
      { q: "'Will' expresses?", o: ["Past", "Present", "Future"], c: "Future" },
      { q: "'Must' means?", o: ["Possibility", "Obligation", "Ability"], c: "Obligation" },
      { q: "Plural 'man' = ?", o: ["mans", "men", "mans'"], c: "men" },
      { q: "Comparative uses?", o: ["-er", "-est", "-ing"], c: "-er" },
      { q: "Superlative uses?", o: ["-er", "-est", "-ly"], c: "-est" },
      { q: "Gerund function?", o: ["Verb", "Noun", "Adjective"], c: "Noun" },
      { q: "Infinitive marker?", o: ["ing", "ed", "to"], c: "to" },
    ],
    hard: [
      { q: "Pragmatics studies?", o: ["Words", "Context", "Grammar"], c: "Context" },
      { q: "Syntax studies?", o: ["Words", "Sentences", "Sound"], c: "Sentences" },
      { q: "Phonetics is about?", o: ["Meaning", "Grammar", "Speech sounds"], c: "Speech sounds" },
      { q: "Morphology studies?", o: ["Words structure", "Sentences", "Meaning"], c: "Words structure" },
      { q: "Passive: 'The book was read by her'. Agent is?", o: ["book", "she", "her"], c: "her" },
      { q: "Subjunctive in 'I wish I were...' is?", o: ["Present", "Past", "Mood"], c: "Mood" },
      { q: "Antonym of 'benevolent'?", o: ["kind", "malevolent", "generous"], c: "malevolent" },
      { q: "Onomatopoeia is?", o: ["Metaphor", "Sound word", "Rhyme"], c: "Sound word" },
    ],
  },
  2: {
    easy: [
      { q: "Turkish Republic: ?", o: ["1920", "1923", "1925"], c: "1923" },
      { q: "Istanbul conquest: ?", o: ["1299", "1453", "1071"], c: "1453" },
      { q: "French Revolution: ?", o: ["1776", "1789", "1800"], c: "1789" },
      { q: "Rome founded: ?", o: ["753 BC", "500 BC", "800 BC"], c: "753 BC" },
      { q: "Ottoman founded: ?", o: ["1299", "1453", "1071"], c: "1299" },
      { q: "Gallipoli: ?", o: ["1914", "1915", "1916"], c: "1915" },
      { q: "Sakarya Battle: ?", o: ["1919", "1920", "1921"], c: "1921" },
      { q: "Napoleon power: ?", o: ["1799", "1815", "1830"], c: "1799" },
      { q: "Waterloo: ?", o: ["1812", "1815", "1818"], c: "1815" },
      { q: "American Revolution: ?", o: ["1775", "1776", "1777"], c: "1776" },
      { q: "Alexander died age: ?", o: ["30", "32", "35"], c: "32" },
      { q: "Julius Caesar: ?", o: ["44 BC", "50 BC", "40 BC"], c: "44 BC" },
    ],
    medium: [
      { q: "Treaty of Lausanne: ?", o: ["1920", "1923", "1924"], c: "1923" },
      { q: "WWI: ?", o: ["1914-1918", "1939-1945", "1900-1905"], c: "1914-1918" },
      { q: "WWII ended: ?", o: ["1943", "1945", "1947"], c: "1945" },
      { q: "Balkan Wars: ?", o: ["1910-1911", "1912-1913", "1914-1915"], c: "1912-1913" },
      { q: "Tanzimat: ?", o: ["1839", "1856", "1876"], c: "1839" },
      { q: "Alphabet Reform: ?", o: ["1928", "1929", "1930"], c: "1928" },
      { q: "Caliphate abolished: ?", o: ["1922", "1923", "1924"], c: "1924" },
      { q: "Women's suffrage (TR): ?", o: ["1934", "1935", "1936"], c: "1934" },
      { q: "Sykes-Picot: ?", o: ["1916", "1918", "1920"], c: "1916" },
      { q: "İzmir liberated: ?", o: ["1922", "1923", "1924"], c: "1922" },
    ],
    hard: [
      { q: "Armistice of Mudros: ?", o: ["1918", "1919", "1920"], c: "1918" },
      { q: "TBMM first session: ?", o: ["1919", "1920", "1921"], c: "1920" },
      { q: "Treaty of Sevres: ?", o: ["1918", "1920", "1922"], c: "1920" },
      { q: "Misak-ı Milli: ?", o: ["1919", "1920", "1921"], c: "1920" },
      { q: "Piri Reis map: ?", o: ["1513", "1528", "1545"], c: "1513" },
      { q: "Battle of Lepanto: ?", o: ["1570", "1571", "1572"], c: "1571" },
      { q: "Fatih's age at conquest: ?", o: ["19", "21", "25"], c: "21" },
      { q: "Suleiman took power: ?", o: ["1520", "1525", "1530"], c: "1520" },
    ],
  },
  3: {
    easy: [
      { q: "Turkey capital: ?", o: ["Istanbul", "Ankara", "Bursa"], c: "Ankara" },
      { q: "Turkey on ? continents", o: ["1", "2", "3"], c: "2" },
      { q: "Highest mountain: ?", o: ["Erciyes", "Ararat", "Ağrı"], c: "Ağrı" },
      { q: "Longest river: ?", o: ["Dicle", "Fırat", "Yeşil"], c: "Fırat" },
      { q: "Largest lake: ?", o: ["Beyşehir", "Van Gölü", "Eğirdir"], c: "Van Gölü" },
      { q: "Taurus Mts location: ?", o: ["West", "South", "East"], c: "South" },
      { q: "Black Sea faces: ?", o: ["North", "South", "East"], c: "North" },
      { q: "Istanbul separates: ?", o: ["Islands", "Asia-Europe", "Sea-Land"], c: "Asia-Europe" },
      { q: "Pamukkale location: ?", o: ["Denizli", "Isparta", "Burdur"], c: "Denizli" },
      { q: "Cappadocia: ?", o: ["Nevşehir", "Kayseri", "Sivas"], c: "Nevşehir" },
      { q: "Troy location: ?", o: ["Çanakkale", "İstanbul", "Bursa"], c: "Çanakkale" },
      { q: "Ephesus: ?", o: ["İzmir", "Muğla", "Aydın"], c: "İzmir" },
    ],
    medium: [
      { q: "TR provinces: ?", o: ["78", "80", "81"], c: "81" },
      { q: "Fırat starts: ?", o: ["Ağrı", "Elazığ", "Diyarbakır"], c: "Elazığ" },
      { q: "Northernmost city: ?", o: ["Trabzon", "Giresun", "Sinop"], c: "Sinop" },
      { q: "Southernmost city: ?", o: ["Mersin", "Adana", "Hatay"], c: "Hatay" },
      { q: "Sakarya flows to: ?", o: ["Black Sea", "Marmara", "Aegean"], c: "Black Sea" },
      { q: "TR population ~?", o: ["80M", "85M", "90M"], c: "85M" },
      { q: "Nemrut Dağı: ?", o: ["Adıyaman", "Urfa", "Gaziantep"], c: "Adıyaman" },
      { q: "Sumela Monastery: ?", o: ["Rize", "Trabzon", "Giresun"], c: "Trabzon" },
    ],
    hard: [
      { q: "Lake Van depth: ?", o: ["300m", "450m", "600m"], c: "450m" },
      { q: "TR total area (k km²): ?", o: ["700", "780", "850"], c: "780" },
      { q: "TR latitude: ?", o: ["35°-42°", "36°-42°", "37°-41°"], c: "36°-42°" },
      { q: "Peak elevation: ?", o: ["5166m", "5137m", "5150m"], c: "5137m" },
      { q: "Tuz Gölü size: ?", o: ["1200 km²", "1400 km²", "1600 km²"], c: "1400 km²" },
      { q: "Rainiest region: ?", o: ["Black Sea", "Aegean", "Mediterranean"], c: "Black Sea" },
      { q: "Driest region: ?", o: ["Central", "East", "Southeast"], c: "Central" },
      { q: "Mediterranean climate: ?", o: ["Dry summer", "Cold summer", "Wet summer"], c: "Dry summer" },
    ],
  },
  4: {
    easy: [
      { q: "Speed of light (km/s): ?", o: ["100000", "300000", "500000"], c: "300000" },
      { q: "Water boils at °C: ?", o: ["90", "100", "110"], c: "100" },
      { q: "Force unit: ?", o: ["Pascal", "Newton", "Joule"], c: "Newton" },
      { q: "Energy unit: ?", o: ["Newton", "Joule", "Volt"], c: "Joule" },
      { q: "Water freezes °C: ?", o: ["0", "-10", "10"], c: "0" },
      { q: "g ≈ ? m/s²", o: ["9.8", "10", "11"], c: "9.8" },
      { q: "Sound speed ≈ ?", o: ["200 m/s", "340 m/s", "500 m/s"], c: "340 m/s" },
      { q: "Current unit: ?", o: ["Newton", "Ampere", "Joule"], c: "Ampere" },
      { q: "Pressure unit: ?", o: ["Newton", "Pascal", "Joule"], c: "Pascal" },
      { q: "Frequency unit: ?", o: ["Newton", "Hertz", "Watt"], c: "Hertz" },
      { q: "Power unit: ?", o: ["Newton", "Joule", "Watt"], c: "Watt" },
      { q: "Newton's laws: ?", o: ["2", "3", "4"], c: "3" },
      { q: "States of matter: ?", o: ["2", "3", "4"], c: "3" },
      { q: "Momentum = ?", o: ["m×v", "m×a", "m×g"], c: "m×v" },
      { q: "Density = ?", o: ["m/V", "V/m", "m+V"], c: "m/V" },
      { q: "Kinetic energy = ?", o: ["mv", "½mv²", "mv²"], c: "½mv²" },
      { q: "Work = F × ?", o: ["Time", "Distance", "Speed"], c: "Distance" },
      { q: "Weight = ?", o: ["F=ma", "F=mg", "F=m+g"], c: "F=mg" },
    ],
    medium: [
      { q: "Ohm's Law: ?", o: ["V=IR", "V=I+R", "V=I-R"], c: "V=IR" },
      { q: "Speed = ?", o: ["x×t", "x/t", "x+t"], c: "x/t" },
      { q: "Acceleration unit: ?", o: ["m/s", "m/s²", "m×s"], c: "m/s²" },
      { q: "Wave eq: v = ?", o: ["f×λ", "f+λ", "f/λ"], c: "f×λ" },
      { q: "Energy conservation: ?", o: ["Changes", "None", "Stays constant"], c: "Stays constant" },
      { q: "Hooke's Law: F = ?", o: ["kx", "k/x", "k+x"], c: "kx" },
      { q: "Centripetal acc = ?", o: ["v/r", "v²/r", "v×r"], c: "v²/r" },
      { q: "Angular momentum L = ?", o: ["I×ω", "I+ω", "I/ω"], c: "I×ω" },
      { q: "Torque τ = ?", o: ["F×r", "F+r", "F/r"], c: "F×r" },
      { q: "SHM period T = ?", o: ["1/f", "1/ω", "2π/ω"], c: "2π/ω" },
    ],
    hard: [
      { q: "Planck constant (J·s): ?", o: ["6.63×10⁻³⁴", "6.63×10⁻³⁵", "6.63×10⁻³³"], c: "6.63×10⁻³⁴" },
      { q: "Heisenberg uncertainty: ?", o: ["Δx·Δp≥ℏ/2", "Δx·Δp≤ℏ/2", "Δx+Δp=ℏ"], c: "Δx·Δp≥ℏ/2" },
      { q: "Special relativity mass: ?", o: ["m=m₀γ", "m=m₀/γ", "m=m₀+γ"], c: "m=m₀γ" },
      { q: "de Broglie wavelength: ?", o: ["λ=h/p", "λ=p/h", "λ=hp"], c: "λ=h/p" },
      { q: "Maxwell eq count: ?", o: ["2", "4", "6"], c: "4" },
      { q: "Lorentz factor γ = ?", o: ["1/√(1-v²/c²)", "√(1-v²/c²)", "1-v²/c²"], c: "1/√(1-v²/c²)" },
      { q: "Schwarzschild radius: ?", o: ["r=2GM/c²", "r=GM/c²", "r=GM/c"], c: "r=2GM/c²" },
      { q: "Fine structure constant ≈ ?", o: ["1/137", "1/100", "1/150"], c: "1/137" },
    ],
  },
  5: {
    easy: [
      { q: "Water: ?", o: ["H₂O", "CO₂", "O₂"], c: "H₂O" },
      { q: "Lightest element: ?", o: ["Helium", "Hydrogen", "Lithium"], c: "Hydrogen" },
      { q: "Salt: ?", o: ["NaCl", "KCl", "CaCl"], c: "NaCl" },
      { q: "Iron: ?", o: ["Ir", "Fe", "Fr"], c: "Fe" },
      { q: "Gold: ?", o: ["Au", "Ag", "Al"], c: "Au" },
      { q: "Silver: ?", o: ["Ag", "Si", "Sn"], c: "Ag" },
      { q: "Copper: ?", o: ["Co", "Cu", "Cd"], c: "Cu" },
      { q: "Carbon: ?", o: ["C", "Ca", "Cr"], c: "C" },
      { q: "Nitrogen: ?", o: ["Ne", "N", "Ni"], c: "N" },
      { q: "Sodium: ?", o: ["S", "Si", "Na"], c: "Na" },
      { q: "Potassium: ?", o: ["K", "Ka", "Kn"], c: "K" },
      { q: "Calcium: ?", o: ["Ca", "C", "Ce"], c: "Ca" },
      { q: "Oxygen: ?", o: ["O", "Ox", "Oz"], c: "O" },
      { q: "CO₂ name: ?", o: ["Carbon Monoxide", "Carbon Dioxide", "Carbonic Acid"], c: "Carbon Dioxide" },
      { q: "Periodic table elements: ?", o: ["108", "118", "128"], c: "118" },
    ],
    medium: [
      { q: "Periodic table groups: ?", o: ["16", "18", "20"], c: "18" },
      { q: "Alkali metals group: ?", o: ["1", "2", "17"], c: "1" },
      { q: "Noble gases group: ?", o: ["16", "17", "18"], c: "18" },
      { q: "pH of pure water: ?", o: ["6", "7", "8"], c: "7" },
      { q: "Acid pH: ?", o: ["<7", "=7", ">7"], c: "<7" },
      { q: "Base pH: ?", o: ["<7", "=7", ">7"], c: ">7" },
      { q: "Molarity unit: ?", o: ["mol/L", "g/L", "kg/L"], c: "mol/L" },
      { q: "Avogadro's number: ?", o: ["6.02×10²³", "6.02×10²²", "6.02×10²⁴"], c: "6.02×10²³" },
      { q: "Electron charge: ?", o: ["-1.6×10⁻¹⁹C", "+1.6×10⁻¹⁹C", "0"], c: "-1.6×10⁻¹⁹C" },
      { q: "Molar mass of H₂O: ?", o: ["16", "18", "20"], c: "18" },
    ],
    hard: [
      { q: "Le Chatelier's principle: ?", o: ["Equilibrium shifts", "Reaction stops", "Rate doubles"], c: "Equilibrium shifts" },
      { q: "Hund's rule: ?", o: ["Max spins parallel", "Max spins opposite", "Fill lowest first"], c: "Max spins parallel" },
      { q: "Aufbau principle: ?", o: ["Fill highest first", "Fill lowest first", "Fill randomly"], c: "Fill lowest first" },
      { q: "Gibbs free energy: G = ?", o: ["H-TS", "H+TS", "TS-H"], c: "H-TS" },
      { q: "Entropy symbol: ?", o: ["S", "G", "H"], c: "S" },
      { q: "Enthalpy symbol: ?", o: ["S", "G", "H"], c: "H" },
      { q: "Henderson-Hasselbalch: pH = ?", o: ["pKa+log[A⁻]/[HA]", "pKa-log[A⁻]/[HA]", "pKa×log[A⁻]/[HA]"], c: "pKa+log[A⁻]/[HA]" },
      { q: "Rate constant units (1st order): ?", o: ["s⁻¹", "M⁻¹s⁻¹", "M·s"], c: "s⁻¹" },
    ],
  },
};

export const roomDefinitions = [
  { id: "room1", name: "Cosmic Core" },
  { id: "room2", name: "Nebula Lab" },
  { id: "room3", name: "Quantum Vault" },
  { id: "room4", name: "Galaxy Bridge" },
];

export const itemEmojis = ["⚗️", "🔑", "💎", "🗺️", "⚙️", "🌟", "📡", "🔭", "🧪", "🧲", "💫", "🛸"];

/**
 * A question's answer is identified by its option id, never its translated
 * label.  This keeps an in-progress question valid even if the app language
 * is changed while the modal is open.
 */
export type Difficulty = "easy" | "medium" | "hard";
export type BranchId = 0 | 1 | 2 | 3 | 4 | 5;
export type LocalizedQuestion = {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
};
export type LocalizedQuestionBank = Record<BranchId, Record<Difficulty, LocalizedQuestion[]>>;
export type QuestionLocale = "tr" | "en" | "fr" | "it" | "ar";

type Fact = readonly [question: string, options: readonly [string, string, string], correctIndex: 0 | 1 | 2];
type LocaleFacts = Record<BranchId, readonly [Fact, Fact, Fact, Fact]>;

/* These are authored display strings, not a translated English fallback. Each
 * branch has four sound questions; all three difficulty banks receive their
 * own stable copies so every selectable game configuration is usable. */
const facts: Record<QuestionLocale, LocaleFacts> = {
  en: {
    0: [["12 + 8 equals?", ["18","20","22"],1],["6 × 7 equals?",["40","42","45"],1],["The square root of 81 is?",["7","8","9"],2],["2 to the power of 4 is?",["8","16","32"],1]],
    1: [["What does “happy” mean?",["Sad","Joyful","Angry"],1],["What is the opposite of “fast”?",["Slow","Quick","Rapid"],0],["What is the plural of child?",["Childs","Children","Childes"],1],["Which word is a colour?",["Red","Run","Book"],0]],
    2: [["In which year was the Turkish Republic founded?",["1920","1923","1925"],1],["When was Istanbul conquered?",["1299","1453","1517"],1],["When did the French Revolution begin?",["1776","1789","1804"],1],["When did World War II end?",["1943","1945","1947"],1]],
    3: [["What is the capital of Türkiye?",["Istanbul","Ankara","Bursa"],1],["Türkiye lies on how many continents?",["One","Two","Three"],1],["What is Türkiye’s largest lake?",["Lake Van","Lake Tuz","Lake Beyşehir"],0],["Which city is home to Pamukkale?",["Denizli","Antalya","Konya"],0]],
    4: [["What is the SI unit of force?",["Joule","Newton","Pascal"],1],["At what temperature does water boil at sea level?",["90°C","100°C","110°C"],1],["What is the approximate speed of light?",["300,000 km/s","30,000 km/s","3,000 km/s"],0],["Which unit measures electric current?",["Volt","Ampere","Watt"],1]],
    5: [["What is the formula for water?",["CO₂","H₂O","O₂"],1],["Which is the lightest element?",["Helium","Hydrogen","Lithium"],1],["What is the chemical symbol for gold?",["Ag","Au","Fe"],1],["A neutral solution has which pH?",["6","7","8"],1]],
  },
  tr: {
    0: [["12 + 8 kaç eder?",["18","20","22"],1],["6 × 7 kaç eder?",["40","42","45"],1],["81’in karekökü kaçtır?",["7","8","9"],2],["2 üzeri 4 kaçtır?",["8","16","32"],1]],
    1: [["“Happy” ne demektir?",["Üzgün","Mutlu","Kızgın"],1],["“Fast” kelimesinin zıttı nedir?",["Yavaş","Hızlı","Çabuk"],0],["Child kelimesinin çoğulu nedir?",["Childs","Children","Childes"],1],["Hangi kelime bir renktir?",["Red","Run","Book"],0]],
    2: [["Türkiye Cumhuriyeti hangi yıl kuruldu?",["1920","1923","1925"],1],["İstanbul hangi yıl fethedildi?",["1299","1453","1517"],1],["Fransız Devrimi hangi yıl başladı?",["1776","1789","1804"],1],["II. Dünya Savaşı hangi yıl bitti?",["1943","1945","1947"],1]],
    3: [["Türkiye’nin başkenti neresidir?",["İstanbul","Ankara","Bursa"],1],["Türkiye kaç kıtada yer alır?",["Bir","İki","Üç"],1],["Türkiye’nin en büyük gölü hangisidir?",["Van Gölü","Tuz Gölü","Beyşehir Gölü"],0],["Pamukkale hangi şehirdedir?",["Denizli","Antalya","Konya"],0]],
    4: [["Kuvvetin SI birimi nedir?",["Joule","Newton","Pascal"],1],["Deniz seviyesinde su kaç derecede kaynar?",["90°C","100°C","110°C"],1],["Işığın yaklaşık hızı nedir?",["300.000 km/s","30.000 km/s","3.000 km/s"],0],["Elektrik akımının birimi nedir?",["Volt","Amper","Watt"],1]],
    5: [["Suyun formülü nedir?",["CO₂","H₂O","O₂"],1],["En hafif element hangisidir?",["Helyum","Hidrojen","Lityum"],1],["Altının kimyasal simgesi nedir?",["Ag","Au","Fe"],1],["Nötr çözeltinin pH değeri kaçtır?",["6","7","8"],1]],
  },
  fr: {
    0: [["Combien font 12 + 8 ?",["18","20","22"],1],["Combien font 6 × 7 ?",["40","42","45"],1],["Quelle est la racine carrée de 81 ?",["7","8","9"],2],["Combien font 2 puissance 4 ?",["8","16","32"],1]],
    1: [["Que signifie « happy » ?",["Triste","Joyeux","Fâché"],1],["Quel est l’opposé de « fast » ?",["Lent","Rapide","Vif"],0],["Quel est le pluriel de child ?",["Childs","Children","Childes"],1],["Quel mot est une couleur ?",["Red","Run","Book"],0]],
    2: [["En quelle année la République de Türkiye fut-elle fondée ?",["1920","1923","1925"],1],["Quand Istanbul a-t-elle été conquise ?",["1299","1453","1517"],1],["Quand a commencé la Révolution française ?",["1776","1789","1804"],1],["Quand la Seconde Guerre mondiale s’est-elle terminée ?",["1943","1945","1947"],1]],
    3: [["Quelle est la capitale de la Türkiye ?",["Istanbul","Ankara","Bursa"],1],["Sur combien de continents se trouve la Türkiye ?",["Un","Deux","Trois"],1],["Quel est le plus grand lac de Türkiye ?",["Lac de Van","Lac Tuz","Lac Beyşehir"],0],["Dans quelle ville se trouve Pamukkale ?",["Denizli","Antalya","Konya"],0]],
    4: [["Quelle est l’unité SI de force ?",["Joule","Newton","Pascal"],1],["À quelle température l’eau bout-elle au niveau de la mer ?",["90°C","100°C","110°C"],1],["Quelle est la vitesse approximative de la lumière ?",["300 000 km/s","30 000 km/s","3 000 km/s"],0],["Quelle unité mesure le courant électrique ?",["Volt","Ampère","Watt"],1]],
    5: [["Quelle est la formule de l’eau ?",["CO₂","H₂O","O₂"],1],["Quel est l’élément le plus léger ?",["Hélium","Hydrogène","Lithium"],1],["Quel est le symbole chimique de l’or ?",["Ag","Au","Fe"],1],["Quel pH a une solution neutre ?",["6","7","8"],1]],
  },
  it: {
    0: [["Quanto fa 12 + 8?",["18","20","22"],1],["Quanto fa 6 × 7?",["40","42","45"],1],["Qual è la radice quadrata di 81?",["7","8","9"],2],["Quanto fa 2 alla quarta?",["8","16","32"],1]],
    1: [["Che cosa significa “happy”?",["Triste","Felice","Arrabbiato"],1],["Qual è l’opposto di “fast”?",["Lento","Veloce","Rapido"],0],["Qual è il plurale di child?",["Childs","Children","Childes"],1],["Quale parola è un colore?",["Red","Run","Book"],0]],
    2: [["In quale anno fu fondata la Repubblica di Türkiye?",["1920","1923","1925"],1],["Quando fu conquistata Istanbul?",["1299","1453","1517"],1],["Quando iniziò la Rivoluzione francese?",["1776","1789","1804"],1],["Quando terminò la Seconda guerra mondiale?",["1943","1945","1947"],1]],
    3: [["Qual è la capitale della Türkiye?",["Istanbul","Ankara","Bursa"],1],["Su quanti continenti si trova la Türkiye?",["Uno","Due","Tre"],1],["Qual è il lago più grande della Türkiye?",["Lago di Van","Lago Tuz","Lago Beyşehir"],0],["In quale città si trova Pamukkale?",["Denizli","Antalya","Konya"],0]],
    4: [["Qual è l’unità SI della forza?",["Joule","Newton","Pascal"],1],["A quale temperatura bolle l’acqua al livello del mare?",["90°C","100°C","110°C"],1],["Qual è la velocità approssimativa della luce?",["300.000 km/s","30.000 km/s","3.000 km/s"],0],["Quale unità misura la corrente elettrica?",["Volt","Ampere","Watt"],1]],
    5: [["Qual è la formula dell’acqua?",["CO₂","H₂O","O₂"],1],["Qual è l’elemento più leggero?",["Elio","Idrogeno","Litio"],1],["Qual è il simbolo chimico dell’oro?",["Ag","Au","Fe"],1],["Quale pH ha una soluzione neutra?",["6","7","8"],1]],
  },
  ar: {
    0: [["كم يساوي 12 + 8؟",["18","20","22"],1],["كم يساوي 6 × 7؟",["40","42","45"],1],["ما الجذر التربيعي للعدد 81؟",["7","8","9"],2],["كم يساوي 2 أس 4؟",["8","16","32"],1]],
    1: [["ماذا تعني كلمة “happy”؟",["حزين","سعيد","غاضب"],1],["ما عكس كلمة “fast”؟",["بطيء","سريع","عاجل"],0],["ما جمع كلمة child؟",["Childs","Children","Childes"],1],["أي كلمة تدل على لون؟",["Red","Run","Book"],0]],
    2: [["في أي عام تأسست جمهورية تركيا؟",["1920","1923","1925"],1],["متى تم فتح إسطنبول؟",["1299","1453","1517"],1],["متى بدأت الثورة الفرنسية؟",["1776","1789","1804"],1],["متى انتهت الحرب العالمية الثانية؟",["1943","1945","1947"],1]],
    3: [["ما عاصمة تركيا؟",["إسطنبول","أنقرة","بورصة"],1],["على كم قارة تقع تركيا؟",["واحدة","اثنتان","ثلاث"],1],["ما أكبر بحيرة في تركيا؟",["بحيرة وان","بحيرة توز","بحيرة بيشهير"],0],["في أي مدينة تقع باموق قلعة؟",["دنيزلي","أنطاليا","قونية"],0]],
    4: [["ما وحدة القوة في النظام الدولي؟",["جول","نيوتن","باسكال"],1],["عند أي درجة يغلي الماء عند سطح البحر؟",["90°م","100°م","110°م"],1],["ما السرعة التقريبية للضوء؟",["300,000 كم/ث","30,000 كم/ث","3,000 كم/ث"],0],["أي وحدة تقيس التيار الكهربائي؟",["فولت","أمبير","واط"],1]],
    5: [["ما الصيغة الكيميائية للماء؟",["CO₂","H₂O","O₂"],1],["ما أخف عنصر؟",["هيليوم","هيدروجين","ليثيوم"],1],["ما الرمز الكيميائي للذهب؟",["Ag","Au","Fe"],1],["ما قيمة pH للمحلول المتعادل؟",["6","7","8"],1]],
  },
};

/* Authored localized prompts follow the same source-fact order as
 * universalQuestions. Questions without an authored translation keep the
 * source prompt instead of being removed from the playable pool. */
const localizedPrompts: Record<Exclude<QuestionLocale, "en">, Record<BranchId, Record<Difficulty, readonly string[]>>> = {
  tr: {
    0:{easy:["12 + 8 işleminin sonucu nedir?","15 - 7 işleminin sonucu nedir?","6 × 7 işleminin sonucu nedir?","25 ÷ 5 işleminin sonucu nedir?"],medium:["sin(30°) değeri nedir?","cos(60°) değeri nedir?","5! değeri nedir?","tan(45°) değeri nedir?"],hard:["∫x dx integralinin sonucu nedir?","sin x’in türevi nedir?","lim(x→0) sin(x)/x limiti nedir?","e^(iπ) + 1 ifadesinin değeri nedir?"]},
    1:{easy:["“Hello” ne demektir?","“Apple” ne demektir?","Alfabede kaç harf vardır?","“Happy” ne demektir?"],medium:["Present Continuous hangi yardımcı fiilleri kullanır?","Geçmiş zaman eki hangisidir?","“child” kelimesinin çoğulu nedir?","“Will” neyi ifade eder?"],hard:["Pragmatik neyi inceler?","Sözdizimi neyi inceler?","Fonetik neyle ilgilidir?","Morfoloji neyi inceler?"]},
    2:{easy:["Türkiye Cumhuriyeti hangi yıl kuruldu?","İstanbul hangi yıl fethedildi?","Fransız Devrimi hangi yıl gerçekleşti?","Roma hangi yıl kuruldu?"],medium:["Lozan Antlaşması hangi yıl imzalandı?","I. Dünya Savaşı hangi yıllar arasındaydı?","II. Dünya Savaşı hangi yıl bitti?","Balkan Savaşları hangi yıllardaydı?"],hard:["Mondros Ateşkesi hangi yıl imzalandı?","TBMM ilk oturumunu hangi yıl yaptı?","Sevr Antlaşması hangi yıl imzalandı?","Misak-ı Milli hangi yıl kabul edildi?"]},
    3:{easy:["Türkiye’nin başkenti neresidir?","Türkiye kaç kıtada yer alır?","En yüksek dağ hangisidir?","En uzun nehir hangisidir?"],medium:["Türkiye’de kaç il vardır?","Fırat Nehri nereden doğar?","En kuzeydeki şehir hangisidir?","En güneydeki şehir hangisidir?"],hard:["Van Gölü’nün derinliği yaklaşık kaç metredir?","Türkiye’nin yüzölçümü yaklaşık kaç bin km²’dir?","Türkiye hangi enlemler arasındadır?","Ağrı Dağı’nın yüksekliği kaç metredir?"]},
    4:{easy:["Işık hızı (km/s) kaçtır?","Su kaç °C’de kaynar?","Kuvvetin birimi nedir?","Enerjinin birimi nedir?"],medium:["Ohm Yasası nedir?","Hız nedir?","İvmenin birimi nedir?","Dalga denkleminde v nedir?"],hard:["Planck sabiti (J·s) kaçtır?","Heisenberg belirsizlik ilkesi nedir?","Özel görelilikte kütle nedir?","de Broglie dalga boyu nedir?"]},
    5:{easy:["Su nedir?","En hafif element hangisidir?","Tuzun formülü nedir?","Demirin simgesi nedir?"],medium:["Periyodik tabloda kaç grup vardır?","Alkali metaller hangi gruptadır?","Soy gazlar hangi gruptadır?","Saf suyun pH değeri kaçtır?"],hard:["Le Chatelier ilkesi neyi söyler?","Hund kuralı nedir?","Aufbau ilkesi nedir?","Gibbs serbest enerjisi: G = ?"]},
  },
  fr: {
    0:{easy:["Quel est le résultat de 12 + 8 ?","Quel est le résultat de 15 - 7 ?","Quel est le résultat de 6 × 7 ?","Quel est le résultat de 25 ÷ 5 ?"],medium:["Quelle est la valeur de sin(30°) ?","Quelle est la valeur de cos(60°) ?","Quelle est la valeur de 5! ?","Quelle est la valeur de tan(45°) ?"],hard:["Quelle est la valeur de l’intégrale ∫x dx ?","Quelle est la dérivée de sin x ?","Quelle est la limite lim(x→0) sin(x)/x ?","Quelle est la valeur de e^(iπ) + 1 ?"]},
    1:{easy:["Que signifie « Hello » ?","Que désigne « Apple » ?","Combien de lettres compte l’alphabet ?","Que signifie « Happy » ?"],medium:["Quels auxiliaires utilise le Present Continuous ?","Quel suffixe marque le passé ?","Quel est le pluriel de « child » ?","« Will » exprime ?"],hard:["Que couvre la pragmatique ?","Que couvre la syntaxe ?","La phonétique étudie ?","La morphologie étudie ?"]},
    2:{easy:["En quelle année fut fondée la République de Turquie ?","En quelle année Istanbul fut-elle conquise ?","Quand eut lieu la Révolution française ?","Quand Rome fut-elle fondée ?"],medium:["Le traité de Lausanne date de ?","La Première Guerre mondiale a eu lieu en ?","La Seconde Guerre mondiale s’est terminée en ?","Les guerres balkaniques ont eu lieu en ?"],hard:["L’armistice de Moudros date de ?","La première session de la TBMM eut lieu en ?","Le traité de Sèvres date de ?","Le Misak-ı Milli fut adopté en ?"]},
    3:{easy:["Quelle est la capitale de la Turquie ?","La Turquie se situe sur combien de continents ?","Quelle est la plus haute montagne ?","Quel est le plus long fleuve ?"],medium:["La Turquie compte combien de provinces ?","Où prend sa source l’Euphrate ?","Quelle est la ville la plus septentrionale ?","Quelle est la ville la plus méridionale ?"],hard:["Quelle est la profondeur approximative du lac de Van ?","Quelle est la superficie de la Turquie en milliers de km² ?","Entre quelles latitudes se trouve la Turquie ?","Quelle est l’altitude du mont Ağrı ?"]},
    4:{easy:["Quelle est la vitesse de la lumière (km/s) ?","À quelle température l’eau bout-elle ?","Quelle est l’unité de force ?","Quelle est l’unité d’énergie ?"],medium:["Quelle est la loi d’Ohm ?","La vitesse vaut ?","Quelle est l’unité d’accélération ?","Dans l’équation d’onde, v vaut ?"],hard:["Quelle est la constante de Planck (J·s) ?","Quel est le principe d’incertitude de Heisenberg ?","En relativité restreinte, la masse vaut ?","Quelle est la longueur d’onde de de Broglie ?"]},
    5:{easy:["Quelle est la formule de l’eau ?","Quel est l’élément le plus léger ?","Quelle est la formule du sel ?","Quel est le symbole du fer ?"],medium:["Combien de groupes compte le tableau périodique ?","Dans quel groupe sont les métaux alcalins ?","Dans quel groupe sont les gaz nobles ?","Quel est le pH de l’eau pure ?"],hard:["Que dit le principe de Le Chatelier ?","Quelle est la règle de Hund ?","Quel est le principe d’Aufbau ?","L’énergie libre de Gibbs : G = ?"]},
  },
  it: {
    0:{easy:["Qual è il risultato di 12 + 8?","Qual è il risultato di 15 - 7?","Qual è il risultato di 6 × 7?","Qual è il risultato di 25 ÷ 5?"],medium:["Quanto vale sin(30°)?","Quanto vale cos(60°)?","Quanto vale 5!?","Quanto vale tan(45°)?"],hard:["Qual è l’integrale ∫x dx?","Qual è la derivata di sin x?","Qual è il limite lim(x→0) sin(x)/x?","Quanto vale e^(iπ) + 1?"]},
    1:{easy:["Che cosa significa «Hello»?","Che cosa indica «Apple»?","Quante lettere ha l’alfabeto?","Che cosa significa «Happy»?"],medium:["Quali ausiliari usa il Present Continuous?","Qual è il suffisso del passato?","Qual è il plurale di «child»?","Che cosa esprime «Will»?"],hard:["Che cosa studia la pragmatica?","Che cosa studia la sintassi?","Di che cosa si occupa la fonetica?","Che cosa studia la morfologia?"]},
    2:{easy:["In quale anno fu fondata la Repubblica di Turchia?","In quale anno fu conquistata Istanbul?","Quando avvenne la Rivoluzione francese?","Quando fu fondata Roma?"],medium:["A quando risale il trattato di Losanna?","In quali anni si svolse la Prima guerra mondiale?","In quale anno terminò la Seconda guerra mondiale?","In quali anni si svolsero le guerre balcaniche?"],hard:["A quando risale l’armistizio di Mudros?","Quando si tenne la prima sessione della TBMM?","A quando risale il trattato di Sèvres?","Quando fu adottato il Misak-ı Milli?"]},
    3:{easy:["Qual è la capitale della Turchia?","Su quanti continenti si trova la Turchia?","Qual è la montagna più alta?","Qual è il fiume più lungo?"],medium:["Quante province ha la Turchia?","Dove nasce l’Eufrate?","Qual è la città più settentrionale?","Qual è la città più meridionale?"],hard:["Qual è la profondità approssimativa del lago di Van?","Qual è l’area della Turchia in migliaia di km²?","Tra quali latitudini si trova la Turchia?","Qual è l’altitudine del monte Ağrı?"]},
    4:{easy:["Qual è la velocità della luce (km/s)?","A quale temperatura bolle l’acqua?","Qual è l’unità della forza?","Qual è l’unità dell’energia?"],medium:["Qual è la legge di Ohm?","A che cosa equivale la velocità?","Qual è l’unità dell’accelerazione?","Nell’equazione delle onde, quanto vale v?"],hard:["Qual è la costante di Planck (J·s)?","Qual è il principio di indeterminazione di Heisenberg?","Nella relatività speciale, quanto vale la massa?","Qual è la lunghezza d’onda di de Broglie?"]},
    5:{easy:["Qual è la formula dell’acqua?","Qual è l’elemento più leggero?","Qual è la formula del sale?","Qual è il simbolo del ferro?"],medium:["Quanti gruppi ha la tavola periodica?","In quale gruppo sono i metalli alcalini?","In quale gruppo sono i gas nobili?","Qual è il pH dell’acqua pura?"],hard:["Che cosa afferma il principio di Le Chatelier?","Qual è la regola di Hund?","Qual è il principio di Aufbau?","L’energia libera di Gibbs è G = ?"]},
  },
  ar: {
    0:{easy:["ما ناتج 12 + 8؟","ما ناتج 15 - 7؟","ما ناتج 6 × 7؟","ما ناتج 25 ÷ 5؟"],medium:["ما قيمة sin(30°)؟","ما قيمة cos(60°)؟","ما قيمة 5!؟","ما قيمة tan(45°)؟"],hard:["ما ناتج التكامل ∫x dx؟","ما مشتقة sin x؟","ما قيمة النهاية lim(x→0) sin(x)/x؟","ما قيمة e^(iπ) + 1؟"]},
    1:{easy:["ماذا تعني «Hello»؟","إلى ماذا تشير «Apple»؟","كم حرفًا في الأبجدية؟","ماذا تعني «Happy»؟"],medium:["ما الأفعال المساعدة المستخدمة في Present Continuous؟","ما لاحقة الزمن الماضي؟","ما جمع «child»؟","عمّ تعبّر «Will»؟"],hard:["ماذا يدرس علم التداولية؟","ماذا يدرس علم النحو؟","بماذا يهتم علم الصوتيات؟","ماذا يدرس علم الصرف؟"]},
    2:{easy:["في أي عام تأسست جمهورية تركيا؟","في أي عام فُتحت إسطنبول؟","متى وقعت الثورة الفرنسية؟","متى تأسست روما؟"],medium:["متى وُقعت معاهدة لوزان؟","في أي أعوام وقعت الحرب العالمية الأولى؟","في أي عام انتهت الحرب العالمية الثانية؟","في أي أعوام وقعت حروب البلقان؟"],hard:["متى وُقعت هدنة مودروس؟","متى انعقدت أول جلسة للمجلس الوطني التركي TBMM؟","متى وُقعت معاهدة سيفر؟","متى اعتُمد الميثاق الوطني Misak-ı Milli؟"]},
    3:{easy:["ما عاصمة تركيا؟","في كم قارة تقع تركيا؟","ما أعلى جبل؟","ما أطول نهر؟"],medium:["كم ولاية في تركيا؟","من أين ينبع نهر الفرات؟","ما المدينة الواقعة في أقصى الشمال؟","ما المدينة الواقعة في أقصى الجنوب؟"],hard:["ما العمق التقريبي لبحيرة وان؟","ما مساحة تركيا بآلاف km²؟","بين أي خطي عرض تقع تركيا؟","ما ارتفاع جبل Ağrı؟"]},
    4:{easy:["ما سرعة الضوء (km/s)؟","عند أي درجة يغلي الماء؟","ما وحدة القوة؟","ما وحدة الطاقة؟"],medium:["ما قانون أوم؟","ما معادلة السرعة؟","ما وحدة التسارع؟","في معادلة الموجة، ما قيمة v؟"],hard:["ما ثابت بلانك (J·s)؟","ما مبدأ عدم اليقين لهايزنبرغ؟","في النسبية الخاصة، ما معادلة الكتلة؟","ما طول موجة دي برولي؟"]},
    5:{easy:["ما صيغة الماء؟","ما أخف عنصر؟","ما صيغة الملح؟","ما رمز الحديد؟"],medium:["كم مجموعة في الجدول الدوري؟","في أي مجموعة تقع الفلزات القلوية؟","في أي مجموعة تقع الغازات النبيلة؟","ما قيمة pH للماء النقي؟"],hard:["ماذا ينص مبدأ لو شاتلييه؟","ما قاعدة هوند؟","ما مبدأ أوفباو؟","طاقة غيبس الحرة هي G = ؟"]},
  },
};

type OptionTriple = readonly [string, string, string];
type LocalizedOptionOverrides = Partial<Record<BranchId, Partial<Record<Difficulty, readonly OptionTriple[]>>>>;

/* Language-neutral numbers, dates, formulae, SI units, and proper names are
 * read unchanged from the source bank. Every ordinary-language triple is
 * explicitly authored here. */
const localizedOptionTriples: Record<Exclude<QuestionLocale, "en">, LocalizedOptionOverrides> = {
  tr: {
    1: {
      easy: [["Hoşça kal","Selamlaşma","Güle güle"],["Meyve","Renk","Sayı"],["24","25","26"],["Üzgün","Neşeli","Kızgın"]],
      medium: [["Do","Am/Is/Are","Have"],["-ing","-ed","-ly"],["childs","children","childes"],["Geçmiş","Şimdiki","Gelecek"]],
      hard: [["Kelimeler","Bağlam","Dil bilgisi"],["Kelimeler","Cümleler","Ses"],["Anlam","Dil bilgisi","Konuşma sesleri"],["Kelime yapısı","Cümleler","Anlam"]],
    },
    5: {
      easy: [undefined as unknown as OptionTriple,["Helyum","Hidrojen","Lityum"]],
      hard: [["Denge kayar","Tepkime durur","Hız iki katına çıkar"],["En çok paralel spin","En çok zıt spin","Önce en düşük enerji düzeyi dolar"],["Önce en yüksek enerji düzeyi dolar","Önce en düşük enerji düzeyi dolar","Rastgele dolar"]],
    },
  },
  fr: {
    1: {
      easy: [["Au revoir","Salutation","Salut"],["Fruit","Couleur","Nombre"],["24","25","26"],["Triste","Joyeux","Fâché"]],
      medium: [["Do","Am/Is/Are","Have"],["-ing","-ed","-ly"],["childs","children","childes"],["Passé","Présent","Futur"]],
      hard: [["Mots","Contexte","Grammaire"],["Mots","Phrases","Son"],["Sens","Grammaire","Sons de la parole"],["Structure des mots","Phrases","Sens"]],
    },
    5: {
      easy: [undefined as unknown as OptionTriple,["Hélium","Hydrogène","Lithium"]],
      hard: [["L’équilibre se déplace","La réaction s’arrête","La vitesse double"],["Maximum de spins parallèles","Maximum de spins opposés","Remplir d’abord le niveau le plus bas"],["Remplir d’abord le niveau le plus haut","Remplir d’abord le niveau le plus bas","Remplir au hasard"]],
    },
  },
  it: {
    1: {
      easy: [["Arrivederci","Saluto","Ciao"],["Frutto","Colore","Numero"],["24","25","26"],["Triste","Felice","Arrabbiato"]],
      medium: [["Do","Am/Is/Are","Have"],["-ing","-ed","-ly"],["childs","children","childes"],["Passato","Presente","Futuro"]],
      hard: [["Parole","Contesto","Grammatica"],["Parole","Frasi","Suono"],["Significato","Grammatica","Suoni del parlato"],["Struttura delle parole","Frasi","Significato"]],
    },
    5: {
      easy: [undefined as unknown as OptionTriple,["Elio","Idrogeno","Litio"]],
      hard: [["L’equilibrio si sposta","La reazione si ferma","La velocità raddoppia"],["Massimo di spin paralleli","Massimo di spin opposti","Riempire prima il livello più basso"],["Riempire prima il livello più alto","Riempire prima il livello più basso","Riempire casualmente"]],
    },
  },
  ar: {
    1: {
      easy: [["وداع","تحية","إلى اللقاء"],["فاكهة","لون","عدد"],["24","25","26"],["حزين","سعيد","غاضب"]],
      medium: [["Do","Am/Is/Are","Have"],["-ing","-ed","-ly"],["childs","children","childes"],["الماضي","الحاضر","المستقبل"]],
      hard: [["الكلمات","السياق","القواعد"],["الكلمات","الجمل","الصوت"],["المعنى","القواعد","أصوات الكلام"],["بنية الكلمات","الجمل","المعنى"]],
    },
    5: {
      easy: [undefined as unknown as OptionTriple,["الهيليوم","الهيدروجين","الليثيوم"]],
      hard: [["ينزاح الاتزان","يتوقف التفاعل","تتضاعف السرعة"],["أكبر عدد من اللفّات المتوازية","أكبر عدد من اللفّات المتعاكسة","يُملأ المستوى الأدنى أولًا"],["يُملأ المستوى الأعلى أولًا","يُملأ المستوى الأدنى أولًا","يُملأ عشوائيًا"]],
    },
  },
};

function buildLocaleBank(locale: QuestionLocale): LocalizedQuestionBank {
  const bank = {} as LocalizedQuestionBank;
  ([0, 1, 2, 3, 4, 5] as BranchId[]).forEach((branch) => {
    bank[branch] = {} as Record<Difficulty, LocalizedQuestion[]>;
    (["easy", "medium", "hard"] as Difficulty[]).forEach((difficulty) => {
      const sourceFacts = universalQuestions[branch][difficulty]
        .map(({ q, o, c }) => [q, [o[0], o[1], o[2]], o.indexOf(c) as 0 | 1 | 2] as Fact);
      const localizedFacts = locale !== "en"
        ? sourceFacts.map(([sourceQuestion, sourceLabels, correctIndex], index) => {
          const labels = localizedOptionTriples[locale][branch]?.[difficulty]?.[index] ?? sourceLabels;
          const question = localizedPrompts[locale][branch][difficulty][index] ?? sourceQuestion;
          return [question, labels, correctIndex] as Fact;
        })
        : sourceFacts;
      bank[branch][difficulty] = (locale === "en" ? sourceFacts : localizedFacts)
        .map(([question, labels, correctIndex], index) => ({
        id: `${locale}-${branch}-${difficulty}-${index}`,
        question,
        options: labels.map((label, optionIndex) => ({
          id: `${locale}-${branch}-${difficulty}-${index}-option-${optionIndex}`,
          label,
        })),
        correctOptionId: `${locale}-${branch}-${difficulty}-${index}-option-${correctIndex}`,
      }));
    });
  });
  return bank;
}

export const localizedQuestionBanks: Record<QuestionLocale, LocalizedQuestionBank> = {
  tr: buildLocaleBank("tr"), en: buildLocaleBank("en"), fr: buildLocaleBank("fr"),
  it: buildLocaleBank("it"), ar: buildLocaleBank("ar"),
};

export const localizedRoomNames: Record<QuestionLocale, Record<string, string>> = {
  en: { room1: "Cosmic Core", room2: "Nebula Lab", room3: "Quantum Vault", room4: "Galaxy Bridge" },
  tr: { room1: "Kozmik Çekirdek", room2: "Bulutsu Laboratuvarı", room3: "Kuantum Kasası", room4: "Galaksi Köprüsü" },
  fr: { room1: "Cœur cosmique", room2: "Laboratoire de la nébuleuse", room3: "Coffre quantique", room4: "Pont galactique" },
  it: { room1: "Nucleo cosmico", room2: "Laboratorio della nebulosa", room3: "Caveau quantico", room4: "Ponte galattico" },
  ar: { room1: "النواة الكونية", room2: "مختبر السديم", room3: "الخزنة الكمية", room4: "جسر المجرة" },
};

export function validateLocalizedQuestionBanks(): string[] {
  const errors: string[] = [];
  (Object.keys(localizedQuestionBanks) as QuestionLocale[]).forEach((locale) => {
    const questionIds = new Set<string>();
    const optionIds = new Set<string>();
    ([0, 1, 2, 3, 4, 5] as BranchId[]).forEach((branch) => {
      (["easy", "medium", "hard"] as Difficulty[]).forEach((difficulty) => {
        const questions = localizedQuestionBanks[locale][branch][difficulty];
        const sourceQuestions = universalQuestions[branch][difficulty];
        if (questions.length !== sourceQuestions.length) {
          errors.push(`${locale}/${branch}/${difficulty} has ${questions.length} questions; expected ${sourceQuestions.length}`);
        }
        const contentFingerprints = new Set<string>();
        questions.forEach((question, index) => {
          const questionOptionIds = new Set(question.options.map((option) => option.id));
          const contentFingerprint = `${question.question}\u0000${question.options.map((option) => option.label).join("\u0000")}`;
          if (contentFingerprints.has(contentFingerprint)) {
            errors.push(`${locale}/${branch}/${difficulty}/${index} duplicates another question in the same pool`);
          }
          contentFingerprints.add(contentFingerprint);
          if (questionIds.has(question.id)) errors.push(`${locale}/${question.id} is not unique`);
          questionIds.add(question.id);
          question.options.forEach((option) => {
            if (optionIds.has(option.id)) errors.push(`${locale}/${option.id} option id is not unique`);
            optionIds.add(option.id);
          });
          if (!question.question.trim() || question.options.length < 2 || questionOptionIds.size !== question.options.length ||
              question.options.some((option) => !option.id.trim() || !option.label.trim()) ||
              !question.options.some((option) => option.id === question.correctOptionId)) {
            errors.push(`${locale}/${question.id} is unusable`);
          }
          if (/Choose the basic answer|Apply the concept carefully|Use advanced subject knowledge|Temel bilgiyi kullanın|Kavramı dikkatle uygulayın|İleri düzey konu bilginizi kullanın|Utilisez la notion de base|Appliquez le concept avec soin|Utilisez des connaissances avancées|Usa la nozione di base|Applica con cura il concetto|Usa conoscenze avanzate|استخدم المعرفة الأساسية|طبّق المفهوم بعناية|استخدم معرفة متقدمة بالمادة/.test(question.question)) {
            errors.push(`${locale}/${question.id} contains a rejected generic difficulty prompt`);
          }
          if (locale !== "en") {
            const english = localizedQuestionBanks.en[branch][difficulty][index];
            const sameQuestion = question.question === english.question;
            const sameOptions = question.options.every((option, optionIndex) => option.label === english.options[optionIndex]?.label);
            const hasAuthoredPrompt = index < localizedPrompts[locale][branch][difficulty].length;
            if (hasAuthoredPrompt && sameQuestion && sameOptions) {
              errors.push(`${locale}/${question.id} duplicates English content despite having an authored translation`);
            }
            const requiresLocalizedOptions = branch === 5 &&
              ((difficulty === "easy" && index === 1) || (difficulty === "hard" && index < 3));
            if (branch !== 1 && requiresLocalizedOptions && sameOptions) {
              errors.push(`${locale}/${question.id} leaves an ordinary-language option triple in English`);
            }
          }
        });
      });
      const fingerprints = (["easy", "medium", "hard"] as Difficulty[]).map((difficulty) =>
        localizedQuestionBanks[locale][branch][difficulty]
          .map((question) => `${question.question}\u0000${question.options.map((option) => option.label).join("\u0000")}`)
          .join("\u0001")
      );
      if (new Set(fingerprints).size !== fingerprints.length) {
        errors.push(`${locale}/${branch} reuses a question set across difficulties`);
      }
    });
  });
  return errors;
}
