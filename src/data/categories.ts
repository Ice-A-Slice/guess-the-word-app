/**
 * Categories for word classification
 * Used to group words by subject or domain
 */

export interface Category {
  id: string;
  name: string;
  description: string;
}

const categories: Category[] = [
  {
    id: 'objects',
    name: 'Everyday Objects',
    description: 'Common things you encounter in daily life'
  },
  {
    id: 'food',
    name: 'Food & Drink',
    description: 'Things you can eat or drink'
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Living creatures from around the world'
  },
  {
    id: 'buildings',
    name: 'Buildings & Architecture',
    description: 'Structures and architectural concepts'
  },
  {
    id: 'astronomy',
    name: 'Astronomy',
    description: 'Celestial bodies and space-related concepts'
  },
  {
    id: 'arts',
    name: 'Arts & Culture',
    description: 'Concepts related to artistic expression and cultural phenomena'
  },
  {
    id: 'politics',
    name: 'Politics & Government',
    description: 'Concepts related to governance and political systems'
  },
  {
    id: 'technology',
    name: 'Technology & Computing',
    description: 'Terms related to technology, computers, and digital concepts'
  },
  {
    id: 'language',
    name: 'Language & Literature',
    description: 'Linguistic and literary concepts'
  },
  {
    id: 'environment',
    name: 'Environment & Nature',
    description: 'Natural phenomena and environmental concepts'
  },
  {
    id: 'concepts',
    name: 'Abstract Concepts',
    description: 'Ideas, theories, and abstract notions'
  },
  {
    id: 'qualities',
    name: 'Qualities & Characteristics',
    description: 'Words that describe attributes or traits'
  }
];

export default categories; 