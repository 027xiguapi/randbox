/**
 * Type definitions for RandBox.js
 */

import { RandBox as RandBoxCore } from './core.js';

// Basic option types
export interface BasicOptions {
    [key: string]: any;
}

export interface BoolOptions {
    likelihood: number;
}

export interface FalsyOptions {
    pool: any[];
}

export interface AnimalOptions {
    type?: 'desert' | 'ocean' | 'grassland' | 'forest' | 'zoo' | 'pets' | 'farm';
}

export interface CharacterOptions {
    pool?: string;
    alpha?: boolean;
    numeric?: boolean;
    symbols?: boolean;
    casing?: 'lower' | 'upper';
}

export interface FloatingOptions {
    fixed: number;
    precision?: number;
    min: number;
    max: number;
}

export interface IntegerOptions {
    min: number;
    max: number;
}

export interface NaturalOptions extends IntegerOptions {
    numerals?: number;
    exclude?: number[];
}

export interface PrimeOptions {
    min: number;
    max: number;
}

export interface HexOptions {
    min: number;
    max: number;
    casing: 'lower' | 'upper';
}

export interface LetterOptions {
    casing: 'lower' | 'upper';
}

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

export interface BufferOptions {
    length: number;
}

export interface FileOptions {
    length?: number;
    extension?: string;
    extensions?: string[] | { [key: string]: string[] };
    fileType?: 'raster' | 'vector' | 'audio' | 'video' | 'document' | 'spreadsheet' | 'presentation' | 'archive' | 'code';
}

export interface FileWithContentOptions {
    fileName?: string;
    fileExtension?: string;
    fileSize: number;
}

export interface FileWithContentResult {
    fileName: string;
    fileData: Buffer;
}

// Text options
export interface WordOptions {
    syllables?: number;
    length?: number;
}

export interface SentenceOptions {
    words?: number;
}

export interface ParagraphOptions {
    sentences?: number;
}

// Person options
export interface NameOptions {
    middle?: boolean;
    middle_initial?: boolean;
    prefix?: boolean;
    suffix?: boolean;
    gender?: 'male' | 'female';
    nationality?: string;
}

export interface FirstNameOptions {
    gender?: 'male' | 'female';
    nationality?: string;
}

export interface LastNameOptions {
    nationality?: string;
}

export interface AgeOptions {
    type?: 'child' | 'teen' | 'adult' | 'senior';
}

export interface BirthdayOptions {
    string?: boolean;
    american?: boolean;
    type?: 'child' | 'teen' | 'adult' | 'senior';
}

export interface SsnOptions {
    ssnFour?: boolean;
    dashes?: boolean;
}

export interface GenderOptions {
    extraGenders?: string[];
}

// Web options
export interface EmailOptions {
    domain?: string;
    length?: number;
}

export interface DomainOptions {
    tld?: string;
}

export interface IpOptions {
    version?: 4 | 6;
}

export interface UrlOptions {
    protocol?: string;
    domain?: string;
    path?: string;
    extensions?: string[];
}

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
export interface AddressOptions {
    short_suffix?: boolean;
}

export interface CoordinatesOptions {
    fixed?: number;
    format?: 'dd' | 'ddm' | 'dms';
}

export interface CountryOptions {
    full?: boolean;
}

export interface ProvinceOptions {
    country?: string;
    full?: boolean;
}

export interface StateOptions {
    full?: boolean;
    territories?: boolean;
    armed_forces?: boolean;
    us_states_and_dc?: boolean;
    us_states_territories_and_dc?: boolean;
}

export interface ZipOptions {
    plusfour?: boolean;
}

// Finance options
export interface CreditCardOptions {
    type?: string;
}

export interface CurrencyOptions {
    code?: boolean;
}

export interface CurrencyPairOptions {
    returnAsObject?: boolean;
}

export interface DollarOptions {
    max?: number;
    min?: number;
}

export interface EuroOptions {
    max?: number;
    min?: number;
}

// Music options
export interface TempoOptions {
    min?: number;
    max?: number;
}

// Miscellaneous options
export interface DiceOptions {
    sides?: number;
}

export interface GuidOptions {
    version?: 1 | 2 | 3 | 4 | 5;
}

export interface HashOptions {
    length?: number;
    casing?: 'lower' | 'upper';
}

export interface TimestampOptions {
    // Add timestamp options as needed
}

export interface DateOptions {
    string?: boolean;
    american?: boolean;
    min?: Date;
    max?: Date;
}

export interface YearOptions {
    min?: number;
    max?: number;
}

export interface MonthOptions {
    raw?: boolean;
}

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