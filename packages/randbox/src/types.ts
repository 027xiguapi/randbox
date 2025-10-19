/**
 * Type definitions for RandBox.js
 */

import { RandBox as RandBoxCore } from './core.js';

// Basic option types

/** Basic options interface with any string keys */
export interface BasicOptions {
    [key: string]: any;
}

/** Options for boolean generation */
export interface BoolOptions {
    likelihood: number;
}

/** Options for falsy value generation */
export interface FalsyOptions {
    pool: any[];
}

/** Options for animal name generation */
export interface AnimalOptions {
    type?: 'desert' | 'ocean' | 'grassland' | 'forest' | 'zoo' | 'pets' | 'farm';
}

/** Options for character generation */
export interface CharacterOptions {
    pool?: string;
    alpha?: boolean;
    numeric?: boolean;
    symbols?: boolean;
    casing?: 'lower' | 'upper';
}

/** Options for floating point number generation */
export interface FloatingOptions {
    fixed: number;
    precision?: number;
    min: number;
    max: number;
}

/** Options for integer generation */
export interface IntegerOptions {
    min: number;
    max: number;
}

/** Options for natural number generation */
export interface NaturalOptions extends IntegerOptions {
    numerals?: number;
    exclude?: number[];
}

/** Options for prime number generation */
export interface PrimeOptions {
    min: number;
    max: number;
}

/** Options for hexadecimal number generation */
export interface HexOptions {
    min: number;
    max: number;
    casing: 'lower' | 'upper';
}

/** Options for letter generation */
export interface LetterOptions {
    casing: 'lower' | 'upper';
}

/** Options for string generation */
export interface StringOptions {
    length?: number;
    min: number;
    max: number;
    pool?: string;
    alpha?: boolean;
    numeric?: boolean;
    symbols?: boolean;
    casing?: 'lower' | 'upper';
}

/** Options for buffer generation */
export interface BufferOptions {
    length: number;
}

/** Options for file name generation */
export interface FileOptions {
    length?: number;
    extension?: string;
    extensions?: string[] | { [key: string]: string[] };
    fileType?: 'raster' | 'vector' | 'audio' | 'video' | 'document' | 'spreadsheet' | 'presentation' | 'archive' | 'code';
}

/** Options for file with content generation */
export interface FileWithContentOptions {
    fileName?: string;
    fileExtension?: string;
    fileSize: number;
}

/** Result type for file with content generation */
export interface FileWithContentResult {
    fileName: string;
    fileData: Buffer;
}

// Text options

/** Options for word generation */
export interface WordOptions {
    syllables?: number;
    length?: number;
}

/** Options for sentence generation */
export interface SentenceOptions {
    words?: number;
}

/** Options for paragraph generation */
export interface ParagraphOptions {
    sentences?: number;
}

// Person options

/** Options for name generation */
export interface NameOptions {
    middle?: boolean;
    middle_initial?: boolean;
    prefix?: boolean;
    suffix?: boolean;
    gender?: 'male' | 'female';
    nationality?: string;
}

/** Options for first name generation */
export interface FirstNameOptions {
    gender?: 'male' | 'female';
    nationality?: string;
}

/** Options for last name generation */
export interface LastNameOptions {
    nationality?: string;
}

/** Options for age generation */
export interface AgeOptions {
    type?: 'child' | 'teen' | 'adult' | 'senior';
}

/** Options for birthday generation */
export interface BirthdayOptions {
    string?: boolean;
    american?: boolean;
    type?: 'child' | 'teen' | 'adult' | 'senior';
}

/** Options for SSN generation */
export interface SsnOptions {
    ssnFour?: boolean;
    dashes?: boolean;
}

/** Options for gender generation */
export interface GenderOptions {
    extraGenders?: string[];
}

// Web options

/** Options for email generation */
export interface EmailOptions {
    domain?: string;
    length?: number;
}

/** Options for domain generation */
export interface DomainOptions {
    tld?: string;
}

/** Options for IP address generation */
export interface IpOptions {
    version?: 4 | 6;
}

/** Options for URL generation */
export interface UrlOptions {
    protocol?: string;
    domain?: string;
    path?: string;
    extensions?: string[];
}

/** Options for color generation */
export interface ColorOptions {
    format?: 'hex' | 'shorthex' | 'rgb' | 'rgba' | '0x' | 'name';
    grayscale?: boolean;
    casing?: 'lower' | 'upper';
    min?: number;
    max?: number;
    min_red?: number;
    max_red?: number;
    min_green?: number;
    max_green?: number;
    min_blue?: number;
    max_blue?: number;
    min_alpha?: number;
    max_alpha?: number;
}

// Location options

/** Options for address generation */
export interface AddressOptions {
    short_suffix?: boolean;
}

/** Options for coordinates generation */
export interface CoordinatesOptions {
    fixed?: number;
    format?: 'dd' | 'ddm' | 'dms';
}

/** Options for country generation */
export interface CountryOptions {
    full?: boolean;
}

/** Options for province generation */
export interface ProvinceOptions {
    country?: string;
    full?: boolean;
}

/** Options for state generation */
export interface StateOptions {
    full?: boolean;
    territories?: boolean;
    armed_forces?: boolean;
    us_states_and_dc?: boolean;
    us_states_territories_and_dc?: boolean;
}

/** Options for ZIP code generation */
export interface ZipOptions {
    plusfour?: boolean;
}

// Finance options

/** Options for credit card generation */
export interface CreditCardOptions {
    type?: string;
}

/** Options for currency generation */
export interface CurrencyOptions {
    code?: boolean;
}

/** Options for currency pair generation */
export interface CurrencyPairOptions {
    returnAsObject?: boolean;
}

/** Options for dollar amount generation */
export interface DollarOptions {
    max?: number;
    min?: number;
}

/** Options for euro amount generation */
export interface EuroOptions {
    max?: number;
    min?: number;
}

// Music options

/** Options for tempo generation */
export interface TempoOptions {
    min?: number;
    max?: number;
}

// Miscellaneous options

/** Options for dice roll generation */
export interface DiceOptions {
    sides?: number;
}

/** Options for GUID generation */
export interface GuidOptions {
    version?: 1 | 2 | 3 | 4 | 5;
}

/** Options for hash generation */
export interface HashOptions {
    length?: number;
    casing?: 'lower' | 'upper';
}

/** Options for timestamp generation */
export interface TimestampOptions {
    // Add timestamp options as needed
}

/** Options for date generation */
export interface DateOptions {
    string?: boolean;
    american?: boolean;
    min?: Date;
    max?: Date;
}

/** Options for year generation */
export interface YearOptions {
    min?: number;
    max?: number;
}

/** Options for month generation */
export interface MonthOptions {
    raw?: boolean;
}

/** Options for weighted selection */
export interface WeightedOptions {
    weights?: number[];
}

export interface MacOptions {
    delimiter?: string;
}

export interface LocaleOptions {
    region?: boolean;
}

export interface PickOptions {
    count?: number;
}

export interface SemverOptions {
    include_prerelease?: boolean;
    range?: string;
}

// Main RandBox interface with all methods
export interface RandBox extends RandBoxCore {
    // Basics
    bool(options?: Partial<BoolOptions>): boolean;
    falsy(options?: Partial<FalsyOptions>): any;
    animal(options?: AnimalOptions): string;
    character(options?: CharacterOptions): string;
    floating(options?: Partial<FloatingOptions>): number;
    integer(options?: Partial<IntegerOptions>): number;
    natural(options?: Partial<NaturalOptions>): number;
    prime(options?: Partial<PrimeOptions>): number;
    is_prime(n: number): boolean;
    hex(options?: Partial<HexOptions>): string;
    letter(options?: Partial<LetterOptions>): string;
    string(options?: Partial<StringOptions>): string;
    template(template: string): string;
    buffer(options?: Partial<BufferOptions>): Buffer;

    // Text
    word(options?: WordOptions): string;
    sentence(options?: SentenceOptions): string;
    paragraph(options?: ParagraphOptions): string;
    emoji(): string;

    // Person
    name(options?: NameOptions): string;
    first(options?: FirstNameOptions): string;
    last(options?: LastNameOptions): string;
    age(options?: AgeOptions): number;
    birthday(options?: BirthdayOptions): Date | string;
    ssn(options?: SsnOptions): string;
    gender(options?: GenderOptions): string;

    // Web
    email(options?: EmailOptions): string;
    domain(options?: DomainOptions): string;
    ip(options?: IpOptions): string;
    url(options?: UrlOptions): string;
    color(options?: ColorOptions): string;
    locale(options?: LocaleOptions): string;
    mac(options?: MacOptions): string;
    semver(options?: SemverOptions): string;
    fbid(): string;
    google_analytics(): string;
    tld(): string;
    tlds(): string[];

    // Location
    address(options?: AddressOptions): string;
    city(): string;
    coordinates(options?: CoordinatesOptions): string;
    country(options?: CountryOptions): string;
    province(options?: ProvinceOptions): string;
    state(options?: StateOptions): string;
    zip(options?: ZipOptions): string;

    // Finance
    cc(options?: CreditCardOptions): string;
    cc_type(): string;
    currency(options?: CurrencyOptions): string;
    currency_pair(options?: CurrencyPairOptions): string | object;
    dollar(options?: DollarOptions): string;
    euro(options?: EuroOptions): string;

    // Music
    note(): string;
    chord(): string;
    tempo(options?: TempoOptions): number;

    // Miscellaneous
    coin(): string;
    dice(options?: DiceOptions): number;
    guid(options?: GuidOptions): string;
    hash(options?: HashOptions): string;
    timestamp(options?: TimestampOptions): number;
    date(options?: DateOptions): Date | string;
    year(options?: YearOptions): number;
    month(options?: MonthOptions): string | object;
    file(options?: FileOptions): string;
    fileWithContent(options: FileWithContentOptions): FileWithContentResult;

    // Helper methods
    unique<T>(fn: () => T, num: number, options?: BasicOptions): T[];
    n<T>(fn: () => T, num: number, options?: BasicOptions): T[];
    pick<T>(arr: T[], options?: PickOptions): T | T[];
    pickone<T>(arr: T[]): T;
    pickset<T>(arr: T[], num: number): T[];
    shuffle<T>(arr: T[]): T[];
    weighted<T>(arr: T[], weights: number[]): T;

    // Data methods
    get(name: string): any;
    set(name: string, data: any): this;
    mixin(mixins: any): this;
}

export default RandBox;