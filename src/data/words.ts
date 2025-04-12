import { Word } from '@/types';

/**
 * Words dataset for the Guess the Word game
 * Each word includes id, word, definition, difficulty, and optional category
 */

const words: Word[] = [
  // Easy difficulty words
  {
    id: '1',
    word: 'book',
    definition: 'A written or printed work consisting of pages glued or sewn together along one side and bound in covers.',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: '2',
    word: 'apple',
    definition: 'A round fruit with red, yellow, or green skin and a white interior.',
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: '3',
    word: 'house',
    definition: 'A building for human habitation, especially one that is lived in by a family or small group of people.',
    difficulty: 'easy',
    category: 'buildings'
  },
  {
    id: '4',
    word: 'dog',
    definition: 'A domesticated carnivorous mammal that typically has a long snout, an acute sense of smell, and a barking, howling, or whining voice.',
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: '5',
    word: 'sun',
    definition: 'The star around which the earth orbits and which provides light and heat for the earth during the day.',
    difficulty: 'easy',
    category: 'astronomy'
  },
  
  // Medium difficulty words
  {
    id: '6',
    word: 'architecture',
    definition: 'The art and science of designing and constructing buildings and other physical structures.',
    difficulty: 'medium',
    category: 'arts'
  },
  {
    id: '7',
    word: 'democracy',
    definition: 'A system of government where power is vested in the people, who rule either directly or through freely elected representatives.',
    difficulty: 'medium',
    category: 'politics'
  },
  {
    id: '8',
    word: 'algorithm',
    definition: 'A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.',
    difficulty: 'medium',
    category: 'technology'
  },
  {
    id: '9',
    word: 'metaphor',
    definition: 'A figure of speech in which a word or phrase is applied to an object or action to which it is not literally applicable.',
    difficulty: 'medium',
    category: 'language'
  },
  {
    id: '10',
    word: 'climate',
    definition: 'The weather conditions prevailing in an area in general or over a long period of time.',
    difficulty: 'medium',
    category: 'environment'
  },
  
  // Hard difficulty words
  {
    id: '11',
    word: 'serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '12',
    word: 'ephemeral',
    definition: 'Lasting for a very short time; transitory.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '13',
    word: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '14',
    word: 'dichotomy',
    definition: 'A division or contrast between two things that are or are represented as being opposed or entirely different.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '15',
    word: 'paradigm',
    definition: 'A typical example or pattern of something; a model or framework.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '16',
    word: 'eloquent',
    definition: 'Fluent or persuasive in speaking or writing; having the ability to express thoughts and feelings clearly.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '17',
    word: 'philanthropy',
    definition: 'The desire to promote the welfare of others, expressed by the generous donation of money to good causes.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '18',
    word: 'pragmatic',
    definition: 'Dealing with things sensibly and realistically in a way that is based on practical considerations.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '19',
    word: 'ambiguous',
    definition: 'Open to more than one interpretation; having a double meaning or being unclear and inexact.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '20',
    word: 'quintessential',
    definition: 'Representing the most perfect or typical example of a quality or class.',
    difficulty: 'hard',
    category: 'qualities'
  },
  
  // Additional easy words
  {
    id: '21',
    word: 'cat',
    definition: 'A small domesticated carnivorous mammal with soft fur, a short snout, and retractable claws.',
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: '22',
    word: 'water',
    definition: 'A colorless, transparent, odorless liquid that forms the seas, lakes, rivers, and rain.',
    difficulty: 'easy',
    category: 'environment'
  },
  {
    id: '23',
    word: 'chair',
    definition: 'A separate seat for one person, typically with a back and four legs.',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: '24',
    word: 'bread',
    definition: 'Food made of flour, water, and yeast mixed together and baked.',
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: '25',
    word: 'shoe',
    definition: 'A covering for the foot, typically made of leather, with a sturdy sole and not reaching above the ankle.',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: '26',
    word: 'tree',
    definition: 'A woody perennial plant, typically having a single stem or trunk growing to a considerable height.',
    difficulty: 'easy',
    category: 'environment'
  },
  {
    id: '27',
    word: 'car',
    definition: 'A road vehicle, typically with four wheels, powered by an internal combustion engine or electric motor.',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: '28',
    word: 'moon',
    definition: 'The natural satellite of the earth, visible by reflected light from the sun.',
    difficulty: 'easy',
    category: 'astronomy'
  },
  {
    id: '29',
    word: 'fish',
    definition: 'A cold-blooded vertebrate animal living wholly in water with gills and fins.',
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: '30',
    word: 'table',
    definition: 'A piece of furniture with a flat top and legs, used for eating, writing, or working at.',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: '31',
    word: 'flower',
    definition: 'The seed-bearing part of a plant, consisting of reproductive organs surrounded by petals.',
    difficulty: 'easy',
    category: 'environment'
  },
  {
    id: '32',
    word: 'bird',
    definition: 'A warm-blooded egg-laying vertebrate animal with feathers, wings, and a beak.',
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: '33',
    word: 'park',
    definition: 'A large public garden or area of land used for recreation.',
    difficulty: 'easy',
    category: 'environment'
  },
  {
    id: '34',
    word: 'door',
    definition: 'A hinged, sliding, or revolving barrier at the entrance to a building, room, or vehicle.',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: '35',
    word: 'window',
    definition: 'An opening in the wall or roof of a building or vehicle that is fitted with glass to allow light in.',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: '36',
    word: 'sky',
    definition: 'The area above the earth that you can see when you look up, where clouds and the sun appear.',
    difficulty: 'easy',
    category: 'environment'
  },
  {
    id: '37',
    word: 'beach',
    definition: 'A pebbly or sandy shore, especially by the sea between high and low water marks.',
    difficulty: 'easy',
    category: 'environment'
  },
  {
    id: '38',
    word: 'baby',
    definition: 'A very young child, especially one newly or recently born.',
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: '39',
    word: 'fruit',
    definition: 'The sweet and fleshy product of a tree or other plant that contains seed and can be eaten as food.',
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: '40',
    word: 'hat',
    definition: 'A shaped covering for the head worn for warmth, as a fashion item, or as part of a uniform.',
    difficulty: 'easy',
    category: 'objects'
  },
  
  // Additional medium words
  {
    id: '41',
    word: 'psychology',
    definition: 'The scientific study of the human mind and its functions, especially those affecting behavior.',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: '42',
    word: 'hurricane',
    definition: 'A storm with a violent wind, in particular a tropical cyclone in the Caribbean.',
    difficulty: 'medium',
    category: 'environment'
  },
  {
    id: '43',
    word: 'symphony',
    definition: 'An elaborate musical composition for full orchestra, typically in four movements.',
    difficulty: 'medium',
    category: 'arts'
  },
  {
    id: '44',
    word: 'geography',
    definition: 'The study of the physical features of the earth and its atmosphere, and of human activity as it affects and is affected by these.',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: '45',
    word: 'telescope',
    definition: 'An optical instrument designed to make distant objects appear nearer, containing lenses or mirrors.',
    difficulty: 'medium',
    category: 'technology'
  },
  {
    id: '46',
    word: 'constitution',
    definition: 'A body of fundamental principles or established precedents according to which a state or organization is governed.',
    difficulty: 'medium',
    category: 'politics'
  },
  {
    id: '47',
    word: 'democracy',
    definition: 'A system of government by the whole population or all eligible members of a state, typically through elected representatives.',
    difficulty: 'medium',
    category: 'politics'
  },
  {
    id: '48',
    word: 'ecosystem',
    definition: 'A biological community of interacting organisms and their physical environment.',
    difficulty: 'medium',
    category: 'environment'
  },
  {
    id: '49',
    word: 'mythology',
    definition: 'A collection of myths, especially one belonging to a particular religious or cultural tradition.',
    difficulty: 'medium',
    category: 'arts'
  },
  {
    id: '50',
    word: 'vaccination',
    definition: 'Treatment with a vaccine to produce immunity against a disease.',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: '51',
    word: 'industrial',
    definition: 'Relating to or characterized by industry, especially manufacturing.',
    difficulty: 'medium',
    category: 'technology'
  },
  {
    id: '52',
    word: 'ambassador',
    definition: 'An accredited diplomat sent by a state as its permanent representative in a foreign country.',
    difficulty: 'medium',
    category: 'politics'
  },
  {
    id: '53',
    word: 'peninsula',
    definition: 'A piece of land almost surrounded by water or projecting out into a body of water.',
    difficulty: 'medium',
    category: 'environment'
  },
  {
    id: '54',
    word: 'sculpture',
    definition: 'The art of making three-dimensional forms, typically by carving stone or wood or by casting metal or plaster.',
    difficulty: 'medium',
    category: 'arts'
  },
  {
    id: '55',
    word: 'historical',
    definition: 'Of or concerning history or past events.',
    difficulty: 'medium',
    category: 'concepts'
  },
  {
    id: '56',
    word: 'equation',
    definition: 'A statement that the values of two mathematical expressions are equal.',
    difficulty: 'medium',
    category: 'technology'
  },
  {
    id: '57',
    word: 'democracy',
    definition: 'A form of government in which the people have the authority to choose their governing legislators.',
    difficulty: 'medium',
    category: 'politics'
  },
  {
    id: '58',
    word: 'generation',
    definition: 'All of the people born and living at about the same time, regarded collectively.',
    difficulty: 'medium',
    category: 'concepts'
  },
  {
    id: '59',
    word: 'interview',
    definition: 'A formal meeting in which someone is asked questions to see if they are suitable for a job or course.',
    difficulty: 'medium',
    category: 'language'
  },
  {
    id: '60',
    word: 'experiment',
    definition: 'A scientific procedure undertaken to make a discovery, test a hypothesis, or demonstrate a known fact.',
    difficulty: 'medium',
    category: 'science'
  },
  
  // Additional hard words
  {
    id: '61',
    word: 'juxtaposition',
    definition: 'The fact of two things being seen or placed close together with contrasting effect.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '62',
    word: 'magnanimous',
    definition: 'Very generous or forgiving, especially toward a rival or someone less powerful.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '63',
    word: 'obfuscate',
    definition: 'To make obscure, unclear, or unintelligible, often deliberately to conceal the truth.',
    difficulty: 'hard',
    category: 'language'
  },
  {
    id: '64',
    word: 'esoteric',
    definition: 'Intended for or likely to be understood by only a small number of people with specialized knowledge.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '65',
    word: 'insidious',
    definition: 'Proceeding in a gradual, subtle way, but with very harmful effects.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '66',
    word: 'sycophant',
    definition: 'A person who acts obsequiously toward someone important in order to gain advantage.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '67',
    word: 'loquacious',
    definition: 'Tending to talk a great deal; garrulous.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '68',
    word: 'recalcitrant',
    definition: 'Having an obstinately uncooperative attitude toward authority or discipline.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '69',
    word: 'antediluvian',
    definition: 'Of or belonging to the time before the biblical flood; extremely old-fashioned and outdated.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '70',
    word: 'soliloquy',
    definition: 'An act of speaking one\'s thoughts aloud when by oneself or regardless of any hearers.',
    difficulty: 'hard',
    category: 'language'
  },
  {
    id: '71',
    word: 'malevolent',
    definition: 'Having or showing a wish to do evil to others.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '72',
    word: 'pernicious',
    definition: 'Having a harmful effect, especially in a gradual or subtle way.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '73',
    word: 'existential',
    definition: 'Relating to existence, especially human existence, or concerned with philosophical questions about the meaning of life.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '74',
    word: 'propensity',
    definition: 'An inclination or natural tendency to behave in a particular way.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '75',
    word: 'superfluous',
    definition: 'Unnecessary, especially through being more than enough.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '76',
    word: 'idiosyncrasy',
    definition: 'A mode of behavior or way of thought peculiar to an individual.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '77',
    word: 'cacophony',
    definition: 'A harsh, discordant mixture of sounds.',
    difficulty: 'hard',
    category: 'language'
  },
  {
    id: '78',
    word: 'vicissitude',
    definition: 'A change of circumstances or fortune, typically one that is unwelcome or unpleasant.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '79',
    word: 'circumlocution',
    definition: 'The use of many words where fewer would do, especially in a deliberate attempt to be vague or evasive.',
    difficulty: 'hard',
    category: 'language'
  },
  {
    id: '80',
    word: 'perspicacious',
    definition: 'Having a ready insight into and understanding of things; mentally perceptive.',
    difficulty: 'hard',
    category: 'qualities'
  },
  
  // More medium words
  {
    id: '81',
    word: 'analyze',
    definition: 'To examine methodically and in detail the constitution or structure of something.',
    difficulty: 'medium',
    category: 'concepts'
  },
  {
    id: '82',
    word: 'innovative',
    definition: 'Featuring new methods; advanced and original.',
    difficulty: 'medium',
    category: 'qualities'
  },
  {
    id: '83',
    word: 'integrity',
    definition: 'The quality of being honest and having strong moral principles.',
    difficulty: 'medium',
    category: 'qualities'
  },
  {
    id: '84',
    word: 'optimize',
    definition: 'Make the best or most effective use of a situation or resource.',
    difficulty: 'medium',
    category: 'technology'
  },
  {
    id: '85',
    word: 'portfolio',
    definition: 'A set of pieces of creative work intended to demonstrate a person\'s ability to a potential employer.',
    difficulty: 'medium',
    category: 'arts'
  },
  
  // More easy words
  {
    id: '86',
    word: 'rain',
    definition: 'Water that falls from clouds in small drops.',
    difficulty: 'easy',
    category: 'environment'
  },
  {
    id: '87',
    word: 'phone',
    definition: 'A device that uses either a system of wires or a wireless system to transmit sounds to other phones.',
    difficulty: 'easy',
    category: 'technology'
  },
  {
    id: '88',
    word: 'friend',
    definition: 'A person whom one knows and with whom one has a bond of mutual affection.',
    difficulty: 'easy',
    category: 'concepts'
  },
  {
    id: '89',
    word: 'pencil',
    definition: 'An instrument for writing or drawing, consisting of a thin stick of graphite enclosed in a long thin piece of wood.',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: '90',
    word: 'song',
    definition: 'A short poem or other set of words set to music or meant to be sung.',
    difficulty: 'easy',
    category: 'arts'
  },
  
  // More hard words
  {
    id: '91',
    word: 'aberration',
    definition: 'A departure from what is normal, usual, or expected, typically an unwelcome one.',
    difficulty: 'hard',
    category: 'concepts'
  },
  {
    id: '92',
    word: 'equivocate',
    definition: 'Use ambiguous language so as to conceal the truth or avoid committing oneself.',
    difficulty: 'hard',
    category: 'language'
  },
  {
    id: '93',
    word: 'fastidious',
    definition: 'Very attentive to and concerned about accuracy and detail.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '94',
    word: 'perfunctory',
    definition: 'Carried out without real interest, feeling, or effort.',
    difficulty: 'hard',
    category: 'qualities'
  },
  {
    id: '95',
    word: 'quintessence',
    definition: 'The most perfect or typical example of a quality or class.',
    difficulty: 'hard',
    category: 'concepts'
  },
  
  // Final words to reach 100
  {
    id: '96',
    word: 'autumn',
    definition: 'The third season of the year, when crops and fruits are gathered and leaves fall, in the northern hemisphere from September to November.',
    difficulty: 'easy',
    category: 'environment'
  },
  {
    id: '97',
    word: 'quantum',
    definition: 'A discrete quantity of energy proportional in magnitude to the frequency of the radiation it represents.',
    difficulty: 'hard',
    category: 'science'
  },
  {
    id: '98',
    word: 'volcano',
    definition: 'A mountain or hill, typically conical, having a crater or vent through which lava, rock fragments, hot vapor, and gas are or have been erupted from the earth\'s crust.',
    difficulty: 'medium',
    category: 'environment'
  },
  {
    id: '99',
    word: 'xylophone',
    definition: 'A musical instrument played by striking a row of wooden bars of graduated length with one or more small wooden or plastic mallets.',
    difficulty: 'medium',
    category: 'arts'
  },
  {
    id: '100',
    word: 'zenith',
    definition: 'The time at which something is most powerful or successful.',
    difficulty: 'hard',
    category: 'concepts'
  }
];

export default words; 