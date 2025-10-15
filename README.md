# RandBox

[![npm version](https://badge.fury.io/js/randbox.svg)](https://badge.fury.io/js/randbox)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

RandBox is a powerful JavaScript random data generation library, providing a rich API for generating various types of random data with TypeScript support.

**🏠 Homepage:** [https://randbox.top](https://randbox.top)
**📦 Repository:** [https://github.com/027xiguapi/randbox](https://github.com/027xiguapi/randbox)

## Features

- 🎲 **Comprehensive Data Generation** - Generate random data across 10+ categories
- 🌳 **Tree Shaking Support** - Import only what you need with ES6 modules
- 📝 **TypeScript Support** - Full TypeScript definitions included
- 🔧 **Flexible Usage** - Use as a complete library or import individual functions
- 🎯 **Extensive API** - Over 100 methods for different data types
- 🧪 **Well Tested** - Comprehensive test coverage

## Installation

```bash
npm install randbox
```

## Quick Start

```javascript
import RandBox from 'randbox';

const randBox = new RandBox();

// Generate basic data
console.log(randBox.name());        // "John Smith"
console.log(randBox.email());       // "john@example.com"
console.log(randBox.integer(1, 10)); // 7
console.log(randBox.bool());         // true
```

## Data Categories

RandBox provides random data generation across multiple categories:

### 📊 **Basics** - Core random generation
- `bool()`, `character()`, `floating()`, `integer()`, `natural()`, `string()`, `buffer()`, `hex()`

### 🔧 **Helpers** - Array and utility functions
- `capitalize()`, `mixin()`, `unique()`, `n()`, `pad()`, `pick()`, `pickone()`, `pickset()`, `shuffle()`, `weighted()`

### 📝 **Text** - Text generation
- `paragraph()`, `sentence()`, `syllable()`, `word()`, `emoji()`

### 👤 **Person** - People-related data
- `age()`, `birthday()`, `first()`, `last()`, `name()`, `gender()`, `ssn()`, `animal()`

### 📱 **Mobile** - Mobile device identifiers
- `android_id()`, `apple_token()`, `wp8_anid2()`, `wp7_anid()`, `bb_pin()`

### 🌐 **Web** - Web-related data
- `avatar()`, `color()`, `domain()`, `email()`, `ip()`, `url()`, `hashtag()`

### 📍 **Location** - Geographic data
- `address()`, `city()`, `country()`, `coordinates()`, `latitude()`, `longitude()`, `phone()`

### 💰 **Finance** - Financial data
- `cc()`, `currency()`, `dollar()`, `euro()`, `iban()`, `luhn_check()`

### 🎵 **Music** - Music-related data
- `note()`, `chord()`, `tempo()`, `music_genre()`

### 🎲 **Miscellaneous** - Various utilities
- `coin()`, dice functions (`d4()`, `d6()`, etc.), `guid()`, `hash()`, date functions, `normal()`

## Advanced Usage

### Tree Shaking Support

Import only the modules you need for optimal bundle size:

```javascript
// Import specific functions
import { name, email } from 'randbox/dist/person';
import { natural } from 'randbox/dist/basics';

console.log(name());    // Direct function call
console.log(natural()); // Generate natural number
```

### Custom Seeding

```javascript
import RandBox from 'randbox';

const randBox = new RandBox('my-seed');
console.log(randBox.integer(1, 10)); // Reproducible results
```

### Multiple Instance Usage

```javascript
import RandBox from 'randbox';

const userGen = new RandBox();
const testGen = new RandBox('test-seed');

// Different generators for different purposes
const user = {
  name: userGen.name(),
  email: userGen.email(),
  age: userGen.age()
};

const testData = {
  id: testGen.guid(),
  value: testGen.floating(0, 100)
};
```

## Documentation

For comprehensive documentation and examples, visit: [https://randbox.top](https://randbox.top)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**027xiguapi** - [458813868@qq.com](mailto:458813868@qq.com)

---

## Technical Details

### Module Structure

### Core Module (`core.js`)
The main RandBox constructor with constants, utility functions, and core dependencies.

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

### Usage Examples

#### Import Everything (Equivalent to Original)
```javascript
import RandBox from 'randbox';
const randBox = new RandBox();
console.log(randBox.name()); // Works exactly like the original
```

#### Import Specific Modules (Tree Shaking)
```javascript
import { RandBox, basicsFunctions } from 'randbox/dist/core';
import { name, email } from 'randbox/dist/person';

// Use individual functions
console.log(name()); // Direct function call

// Or extend a RandBox instance with specific modules
const randBox = new RandBox();
Object.assign(randBox, { name, email });
console.log(randBox.name());
```

### Benefits

1. **Tree Shaking**: Bundle only the functions you need
2. **Maintainability**: Related functions are grouped together
3. **Modularity**: Easy to add new modules or modify existing ones
4. **ES6 Compatibility**: Modern JavaScript module system
5. **Backwards Compatibility**: Main export provides the same API as the original
6. **TypeScript Support**: Full type definitions included

Each module imports only what it needs from `core.js`, minimizing dependencies and enabling better optimization.