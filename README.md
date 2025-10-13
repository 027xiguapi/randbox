# RandBox Modular Structure

This directory contains the modularized version of RandBox, split into separate ES6 modules for better maintainability and tree-shaking support.

## Module Structure

### Core Module (`core.js`)
Contains the main RandBox constructor, constants, utility functions, and core dependencies that other modules depend on.

**Exports:**
- `RandBox` - Main constructor
- Constants: `MAX_INT`, `MIN_INT`, `NUMBERS`, `CHARS_LOWER`, `CHARS_UPPER`, `HEX_POOL`
- Utilities: `initOptions`, `testRange`, `range`, `base64`, `UnsupportedError`

### Feature Modules

Each module contains related functionality and can be imported individually:

1. **Basics (`basics.js`)** - Core random generation
   - `bool`, `character`, `floating`, `integer`, `natural`, `string`, `buffer`, `hex`

2. **Helpers (`helpers.js`)** - Array and utility functions
   - `capitalize`, `mixin`, `unique`, `n`, `pad`, `pick`, `pickone`, `pickset`, `shuffle`, `weighted`

3. **Text (`text.js`)** - Text generation
   - `paragraph`, `sentence`, `syllable`, `word`, `emoji`

4. **Person (`person.js`)** - People-related data
   - `age`, `birthday`, `first`, `last`, `name`, `gender`, `ssn`, `animal`, etc.

5. **Mobile (`mobile.js`)** - Mobile device identifiers
   - `android_id`, `apple_token`, `wp8_anid2`, `wp7_anid`, `bb_pin`

6. **Web (`web.js`)** - Web-related data
   - `avatar`, `color`, `domain`, `email`, `ip`, `url`, `hashtag`, etc.

7. **Location (`location.js`)** - Geographic data
   - `address`, `city`, `country`, `coordinates`, `latitude`, `longitude`, `phone`, etc.

8. **Finance (`finance.js`)** - Financial data
   - `cc`, `currency`, `dollar`, `euro`, `iban`, `luhn_check`, etc.

9. **Music (`music.js`)** - Music-related data
   - `note`, `chord`, `tempo`, `music_genre`

10. **Miscellaneous (`miscellaneous.js`)** - Various utilities
    - `coin`, dice functions (`d4`, `d6`, etc.), `guid`, `hash`, date functions, `normal`

## Usage

### Import Everything (Equivalent to Original)
```javascript
import RandBox from './src/index.js';
const randBox = new RandBox();
console.log(randBox.name()); // Works exactly like the original
```

### Import Specific Modules (Tree Shaking)
```javascript
import { RandBox, basicsFunctions } from './src/core.js';
import { name, email } from './src/person.js';

// Use individual functions
console.log(name()); // Direct function call

// Or extend a RandBox instance with specific modules
const randBox = new RandBox();
Object.assign(randBox, { name, email });
console.log(randBox.name());
```

### Import Individual Functions
```javascript
import { name } from './src/person.js';
import { email } from './src/web.js';
import { natural } from './src/basics.js';

// Use directly (note: 'this' context will need to be bound to a RandBox instance)
```

## Benefits

1. **Tree Shaking**: Bundle only the functions you need
2. **Maintainability**: Related functions are grouped together
3. **Modularity**: Easy to add new modules or modify existing ones
4. **ES6 Compatibility**: Modern JavaScript module system
5. **Backwards Compatibility**: `index.js` provides the same API as the original

## Dependencies

Each module imports only what it needs from `core.js`, minimizing dependencies and enabling better optimization.