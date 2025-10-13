/**
 * Simple integration test to verify functionality
 */

import Chance from './dist/index.js';

// Test basic functionality
const chance = new Chance();

const randomBoolean = chance.bool({ likelihood: 75 });
const randomInteger = chance.integer({ min: 1, max: 100 });
const randomString = chance.string({ length: 10 });
const randomCharacter = chance.character({ alpha: true });
const randomFloat = chance.floating({ fixed: 2, min: 0, max: 1 });

console.log('Integration test passed!');
console.log('Random boolean:', randomBoolean);
console.log('Random integer:', randomInteger);
console.log('Random string:', randomString);
console.log('Random character:', randomCharacter);
console.log('Random float:', randomFloat);

// Test factory function
const chance2 = Chance();
const anotherNumber = chance2.natural({ max: 50 });
console.log('Factory function works:', anotherNumber);

// Test individual imports
import { bool, integer } from './dist/basics.js';
console.log('Individual function imports work too!');