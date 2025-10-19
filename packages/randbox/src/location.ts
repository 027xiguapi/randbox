/**
 * Location module
 * Contains location-related generation functions like addresses, coordinates, countries, etc.
 */

import { initOptions, testRange, RandBox } from "./core.js";

/**
 * Generate a random address
 * @param options - Configuration options
 * @param options.short_suffix - Use short street suffix
 * @returns Random address
 */
export function address(this: RandBox, options: any) {
	options = initOptions(options);
	return this.natural({ min: 5, max: 2000 }) + " " + this.street(options);
}

/**
 * Generate a random altitude in meters
 * @param options - Configuration options
 * @param options.fixed - Number of decimal places
 * @param options.min - Minimum altitude
 * @param options.max - Maximum altitude
 * @returns Random altitude
 */
export function altitude(this: RandBox, options: any) {
	options = initOptions(options, { fixed: 5, min: 0, max: 8848 });
	return this.floating({
		min: options.min,
		max: options.max,
		fixed: options.fixed,
	});
}

/**
 * Generate a random area code
 * @param options - Configuration options
 * @param options.parens - Include parentheses around area code
 * @param options.exampleNumber - Use example number 555
 * @returns Random area code
 */
export function areacode(this: RandBox, options: any) {
	options = initOptions(options, { parens: true });
	// Don't want area codes to start with 1, or have a 9 as the second digit
	var areacode = options.exampleNumber
		? "555"
		: this.natural({ min: 2, max: 9 }).toString() +
		  this.natural({ min: 0, max: 8 }).toString() +
		  this.natural({ min: 0, max: 9 }).toString();

	return options.parens ? "(" + areacode + ")" : areacode;
}

/**
 * Generate a random city name
 * @returns Random city name
 */
export function city(this: RandBox) {
	return this.capitalize(this.word({ syllables: 3 }));
}

/**
 * Generate random coordinates (latitude, longitude)
 * @param options - Configuration options for coordinate format
 * @returns Random coordinates as string
 */
export function coordinates(this: RandBox, options: any) {
	return this.latitude(options) + ", " + this.longitude(options);
}

/**
 * Get array of all countries
 * @returns Array of country objects
 */
export function countries(this: RandBox) {
	return this.get("countries");
}

/**
 * Generate a random country
 * @param options - Configuration options
 * @param options.full - Return full name instead of abbreviation
 * @param options.raw - Return raw country object
 * @returns Random country name or abbreviation
 */
export function country(this: RandBox, options: any) {
	options = initOptions(options);
	var country = this.pick(this.countries());
	return options.raw
		? country
		: options.full
		? country.name
		: country.abbreviation;
}

/**
 * Get array of counties for a country
 * @param options - Configuration options
 * @param options.country - Country code (default: 'uk')
 * @returns Array of county objects
 */
export function counties(this: RandBox, options: any) {
	options = initOptions(options, { country: "uk" });
	return this.get("counties")[options.country.toLowerCase()];
}

/**
 * Generate a random county
 * @param options - Configuration options for county selection
 * @returns Random county name
 */
export function county(this: RandBox, options: any) {
	return this.pick(this.counties(options)).name;
}

/**
 * Get array of provinces for a country
 * @param options - Configuration options
 * @param options.country - Country code (default: 'ca')
 * @returns Array of province objects
 */
export function provinces(this: RandBox, options: any) {
	options = initOptions(options, { country: "ca" });
	return this.get("provinces")[options.country.toLowerCase()];
}

/**
 * Generate a random province
 * @param options - Configuration options
 * @param options.full - Return full name instead of abbreviation
 * @returns Random province name or abbreviation
 */
export function province(this: RandBox, options: any) {
	return options && options.full
		? this.pick(this.provinces()).name
		: this.pick(this.provinces()).abbreviation;
}

/**
 * Generate a random depth (negative altitude)
 * @param options - Configuration options
 * @param options.fixed - Number of decimal places
 * @param options.min - Minimum depth
 * @param options.max - Maximum depth
 * @returns Random depth
 */
export function depth(this: RandBox, options: any) {
	options = initOptions(options, { fixed: 5, min: -10994, max: 0 });
	return this.floating({
		min: options.min,
		max: options.max,
		fixed: options.fixed,
	});
}

/**
 * Generate a random geohash string
 * @param options - Configuration options
 * @param options.length - Length of the geohash (default: 7)
 * @returns Random geohash string
 */
export function geohash(this: RandBox, options: any) {
	options = initOptions(options, { length: 7 });
	return this.string({
		length: options.length,
		pool: "0123456789bcdefghjkmnpqrstuvwxyz",
	});
}

/**
 * Generate random GeoJSON coordinates (lat, lng, alt)
 * @param options - Configuration options for coordinate format
 * @returns Random GeoJSON coordinate string
 */
export function geojson(this: RandBox, options: any) {
	return (
		this.latitude(options) +
		", " +
		this.longitude(options) +
		", " +
		this.altitude(options)
	);
}

/**
 * Generate a random latitude
 * @param options - Configuration options
 * @param options.format - Format ('dd', 'ddm', 'dms')
 * @param options.min - Minimum latitude
 * @param options.max - Maximum latitude
 * @param options.fixed - Number of decimal places
 * @returns Random latitude
 */
export function latitude(this: RandBox, options: any) {
	var [DDM, DMS, DD] = ["ddm", "dms", "dd"];

	options = initOptions(
		options,
		options &&
			options.format &&
			[DDM, DMS].includes(options.format.toLowerCase())
			? { min: 0, max: 89, fixed: 4 }
			: { fixed: 5, min: -90, max: 90, format: DD }
	);

	var format = options.format.toLowerCase();

	if (format === DDM || format === DMS) {
		testRange(
			options.min < 0 || options.min > 89,
			"RandBox: Min specified is out of range. Should be between 0 - 89"
		);
		testRange(
			options.max < 0 || options.max > 89,
			"RandBox: Max specified is out of range. Should be between 0 - 89"
		);
		testRange(
			options.fixed > 4,
			"RandBox: Fixed specified should be below or equal to 4"
		);
	}

	switch (format) {
		case DDM: {
			return (
				this.integer({ min: options.min, max: options.max }) +
				"°" +
				this.floating({ min: 0, max: 59, fixed: options.fixed })
			);
		}
		case DMS: {
			return (
				this.integer({ min: options.min, max: options.max }) +
				"°" +
				this.integer({ min: 0, max: 59 }) +
				"’" +
				this.floating({ min: 0, max: 59, fixed: options.fixed }) +
				"”"
			);
		}
		case DD:
		default: {
			return this.floating({
				min: options.min,
				max: options.max,
				fixed: options.fixed,
			});
		}
	}
}

/**
 * Generate a random longitude
 * @param options - Configuration options
 * @param options.format - Format ('dd', 'ddm', 'dms')
 * @param options.min - Minimum longitude
 * @param options.max - Maximum longitude
 * @param options.fixed - Number of decimal places
 * @returns Random longitude
 */
export function longitude(this: RandBox, options: any) {
	var [DDM, DMS, DD] = ["ddm", "dms", "dd"];

	options = initOptions(
		options,
		options &&
			options.format &&
			[DDM, DMS].includes(options.format.toLowerCase())
			? { min: 0, max: 179, fixed: 4 }
			: { fixed: 5, min: -180, max: 180, format: DD }
	);

	var format = options.format.toLowerCase();

	if (format === DDM || format === DMS) {
		testRange(
			options.min < 0 || options.min > 179,
			"RandBox: Min specified is out of range. Should be between 0 - 179"
		);
		testRange(
			options.max < 0 || options.max > 179,
			"RandBox: Max specified is out of range. Should be between 0 - 179"
		);
		testRange(
			options.fixed > 4,
			"RandBox: Fixed specified should be below or equal to 4"
		);
	}

	switch (format) {
		case DDM: {
			return (
				this.integer({ min: options.min, max: options.max }) +
				"°" +
				this.floating({ min: 0, max: 59.9999, fixed: options.fixed })
			);
		}
		case DMS: {
			return (
				this.integer({ min: options.min, max: options.max }) +
				"°" +
				this.integer({ min: 0, max: 59 }) +
				"’" +
				this.floating({ min: 0, max: 59.9999, fixed: options.fixed }) +
				"”"
			);
		}
		case DD:
		default: {
			return this.floating({
				min: options.min,
				max: options.max,
				fixed: options.fixed,
			});
		}
	}
}

/**
 * Generate a random phone number
 * @param options - Configuration options
 * @param options.formatted - Include formatting
 * @param options.country - Country code ('us', 'uk', 'fr', 'za', 'br')
 * @param options.mobile - Generate mobile number
 * @param options.exampleNumber - Use example numbers
 * @returns Random phone number
 */
export function phone(this: RandBox, options: any) {
	var self = this,
		numPick,
		ukNum = function (parts: { area: string; sections: number[] }): string {
			var section: string[] = [];
			//fills the section part of the phone number with random numbers.
			parts.sections.forEach(function (n: number) {
				section.push(self.string({ pool: "0123456789", length: n }));
			});
			return parts.area + section.join(" ");
		};
	options = initOptions(options, {
		formatted: true,
		country: "us",
		mobile: false,
		exampleNumber: false,
	});
	if (!options.formatted) {
		options.parens = false;
	}
	var phone;
	switch (options.country) {
		case "fr":
			if (!options.mobile) {
				numPick = this.pick([
					// Valid zone and département codes.
					"01" +
						this.pick([
							"30",
							"34",
							"39",
							"40",
							"41",
							"42",
							"43",
							"44",
							"45",
							"46",
							"47",
							"48",
							"49",
							"53",
							"55",
							"56",
							"58",
							"60",
							"64",
							"69",
							"70",
							"72",
							"73",
							"74",
							"75",
							"76",
							"77",
							"78",
							"79",
							"80",
							"81",
							"82",
							"83",
						]) +
						self.string({ pool: "0123456789", length: 6 }),
					"02" +
						this.pick([
							"14",
							"18",
							"22",
							"23",
							"28",
							"29",
							"30",
							"31",
							"32",
							"33",
							"34",
							"35",
							"36",
							"37",
							"38",
							"40",
							"41",
							"43",
							"44",
							"45",
							"46",
							"47",
							"48",
							"49",
							"50",
							"51",
							"52",
							"53",
							"54",
							"56",
							"57",
							"61",
							"62",
							"69",
							"72",
							"76",
							"77",
							"78",
							"85",
							"90",
							"96",
							"97",
							"98",
							"99",
						]) +
						self.string({ pool: "0123456789", length: 6 }),
					"03" +
						this.pick([
							"10",
							"20",
							"21",
							"22",
							"23",
							"24",
							"25",
							"26",
							"27",
							"28",
							"29",
							"39",
							"44",
							"45",
							"51",
							"52",
							"54",
							"55",
							"57",
							"58",
							"59",
							"60",
							"61",
							"62",
							"63",
							"64",
							"65",
							"66",
							"67",
							"68",
							"69",
							"70",
							"71",
							"72",
							"73",
							"80",
							"81",
							"82",
							"83",
							"84",
							"85",
							"86",
							"87",
							"88",
							"89",
							"90",
						]) +
						self.string({ pool: "0123456789", length: 6 }),
					"04" +
						this.pick([
							"11",
							"13",
							"15",
							"20",
							"22",
							"26",
							"27",
							"30",
							"32",
							"34",
							"37",
							"42",
							"43",
							"44",
							"50",
							"56",
							"57",
							"63",
							"66",
							"67",
							"68",
							"69",
							"70",
							"71",
							"72",
							"73",
							"74",
							"75",
							"76",
							"77",
							"78",
							"79",
							"80",
							"81",
							"82",
							"83",
							"84",
							"85",
							"86",
							"88",
							"89",
							"90",
							"91",
							"92",
							"93",
							"94",
							"95",
							"97",
							"98",
						]) +
						self.string({ pool: "0123456789", length: 6 }),
					"05" +
						this.pick([
							"08",
							"16",
							"17",
							"19",
							"24",
							"31",
							"32",
							"33",
							"34",
							"35",
							"40",
							"45",
							"46",
							"47",
							"49",
							"53",
							"55",
							"56",
							"57",
							"58",
							"59",
							"61",
							"62",
							"63",
							"64",
							"65",
							"67",
							"79",
							"81",
							"82",
							"86",
							"87",
							"90",
							"94",
						]) +
						self.string({ pool: "0123456789", length: 6 }),
					"09" + self.string({ pool: "0123456789", length: 8 }),
				]);
				phone = options.formatted ? numPick.match(/../g).join(" ") : numPick;
			} else {
				numPick =
					this.pick(["06", "07"]) +
					self.string({ pool: "0123456789", length: 8 });
				phone = options.formatted ? numPick.match(/../g).join(" ") : numPick;
			}
			break;
		case "uk":
			if (!options.mobile) {
				numPick = this.pick([
					//valid area codes of major cities/counties followed by random numbers in required format.

					{
						area: "01" + this.character({ pool: "234569" }) + "1 ",
						sections: [3, 4],
					},
					{ area: "020 " + this.character({ pool: "378" }), sections: [3, 4] },
					{ area: "023 " + this.character({ pool: "89" }), sections: [3, 4] },
					{ area: "024 7", sections: [3, 4] },
					{
						area:
							"028 " +
							this.pick(["25", "28", "37", "71", "82", "90", "92", "95"]),
						sections: [2, 4],
					},
					{
						area: "012" + this.pick(["04", "08", "54", "76", "97", "98"]) + " ",
						sections: [6],
					},
					{
						area: "013" + this.pick(["63", "64", "84", "86"]) + " ",
						sections: [6],
					},
					{
						area: "014" + this.pick(["04", "20", "60", "61", "80", "88"]) + " ",
						sections: [6],
					},
					{
						area: "015" + this.pick(["24", "27", "62", "66"]) + " ",
						sections: [6],
					},
					{
						area: "016" + this.pick(["06", "29", "35", "47", "59", "95"]) + " ",
						sections: [6],
					},
					{
						area: "017" + this.pick(["26", "44", "50", "68"]) + " ",
						sections: [6],
					},
					{
						area: "018" + this.pick(["27", "37", "84", "97"]) + " ",
						sections: [6],
					},
					{
						area:
							"019" +
							this.pick(["00", "05", "35", "46", "49", "63", "95"]) +
							" ",
						sections: [6],
					},
				]);
				phone = options.formatted
					? ukNum(numPick)
					: ukNum(numPick).replace(/ /g, "");
			} else {
				numPick = this.pick([
					{
						area: "07" + this.pick(["4", "5", "7", "8", "9"]),
						sections: [2, 6],
					},
					{ area: "07624 ", sections: [6] },
				]);
				phone = options.formatted
					? ukNum(numPick)
					: ukNum(numPick).replace(" ", "");
			}
			break;
		case "za":
			if (!options.mobile) {
				numPick = this.pick([
					"01" +
						this.pick(["0", "1", "2", "3", "4", "5", "6", "7", "8"]) +
						self.string({ pool: "0123456789", length: 7 }),
					"02" +
						this.pick(["1", "2", "3", "4", "7", "8"]) +
						self.string({ pool: "0123456789", length: 7 }),
					"03" +
						this.pick(["1", "2", "3", "5", "6", "9"]) +
						self.string({ pool: "0123456789", length: 7 }),
					"04" +
						this.pick(["1", "2", "3", "4", "5", "6", "7", "8", "9"]) +
						self.string({ pool: "0123456789", length: 7 }),
					"05" +
						this.pick(["1", "3", "4", "6", "7", "8"]) +
						self.string({ pool: "0123456789", length: 7 }),
				]);
				phone = options.formatted || numPick;
			} else {
				numPick = this.pick([
					"060" +
						this.pick(["3", "4", "5", "6", "7", "8", "9"]) +
						self.string({ pool: "0123456789", length: 6 }),
					"061" +
						this.pick(["0", "1", "2", "3", "4", "5", "8"]) +
						self.string({ pool: "0123456789", length: 6 }),
					"06" + self.string({ pool: "0123456789", length: 7 }),
					"071" +
						this.pick(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) +
						self.string({ pool: "0123456789", length: 6 }),
					"07" +
						this.pick(["2", "3", "4", "6", "7", "8", "9"]) +
						self.string({ pool: "0123456789", length: 7 }),
					"08" +
						this.pick(["0", "1", "2", "3", "4", "5"]) +
						self.string({ pool: "0123456789", length: 7 }),
				]);
				phone = options.formatted || numPick;
			}
			break;
		case "us":
			var areacode = this.areacode(options).toString();
			var exchange =
				this.natural({ min: 2, max: 9 }).toString() +
				this.natural({ min: 0, max: 9 }).toString() +
				this.natural({ min: 0, max: 9 }).toString();
			var subscriber = this.natural({ min: 1000, max: 9999 }).toString(); // this could be random [0-9]{4}
			phone = options.formatted
				? areacode + " " + exchange + "-" + subscriber
				: areacode + exchange + subscriber;
			break;
		case "br":
			var areaCode = this.pick([
				"11",
				"12",
				"13",
				"14",
				"15",
				"16",
				"17",
				"18",
				"19",
				"21",
				"22",
				"24",
				"27",
				"28",
				"31",
				"32",
				"33",
				"34",
				"35",
				"37",
				"38",
				"41",
				"42",
				"43",
				"44",
				"45",
				"46",
				"47",
				"48",
				"49",
				"51",
				"53",
				"54",
				"55",
				"61",
				"62",
				"63",
				"64",
				"65",
				"66",
				"67",
				"68",
				"69",
				"71",
				"73",
				"74",
				"75",
				"77",
				"79",
				"81",
				"82",
				"83",
				"84",
				"85",
				"86",
				"87",
				"88",
				"89",
				"91",
				"92",
				"93",
				"94",
				"95",
				"96",
				"97",
				"98",
				"99",
			]);
			var prefix;
			if (options.mobile) {
				// Brasilian official reference (mobile): http://www.anatel.gov.br/setorregulado/plano-de-numeracao-brasileiro?id=330
				prefix = "9" + self.string({ pool: "0123456789", length: 4 });
			} else {
				// Brasilian official reference: http://www.anatel.gov.br/setorregulado/plano-de-numeracao-brasileiro?id=331
				prefix = this.natural({ min: 2000, max: 5999 }).toString();
			}
			var mcdu = self.string({ pool: "0123456789", length: 4 });
			phone = options.formatted
				? "(" + areaCode + ") " + prefix + "-" + mcdu
				: areaCode + prefix + mcdu;
			break;
	}
	return phone;
}

/**
 * Generate a random Canadian postal code
 * @returns Random Canadian postal code
 */
export function postal(this: RandBox) {
	// Postal District
	var pd = this.character({ pool: "XVTSRPNKLMHJGECBA" });
	// Forward Sortation Area (FSA)
	var fsa =
		pd +
		this.natural({ max: 9 }) +
		this.character({ alpha: true, casing: "upper" });
	// Local Delivery Unut (LDU)
	var ldu =
		this.natural({ max: 9 }) +
		this.character({ alpha: true, casing: "upper" }) +
		this.natural({ max: 9 });

	return fsa + " " + ldu;
}

/**
 * Generate a random UK postcode
 * @returns Random UK postcode
 */
export function postcode(this: RandBox) {
	// Area
	var area = this.pick(this.get("postcodeAreas")).code;
	// District
	var district = this.natural({ max: 9 });
	// Sub-District
	var subDistrict = this.bool()
		? this.character({ alpha: true, casing: "upper" })
		: "";
	// Outward Code
	var outward = area + district + subDistrict;
	// Sector
	var sector = this.natural({ max: 9 });
	// Unit
	var unit =
		this.character({ alpha: true, casing: "upper" }) +
		this.character({ alpha: true, casing: "upper" });
	// Inward Code
	var inward = sector + unit;

	return outward + " " + inward;
}

/**
 * Generate a random radio call sign
 * @param options - Configuration options
 * @param options.side - Side of Mississippi River ('east'/'e', 'west'/'w')
 * @returns Random radio call sign
 */
export function radio(this: RandBox, options: any) {
	// Initial Letter (Typically Designated by Side of Mississippi River)
	options = initOptions(options, { side: "?" });
	var fl = "";
	switch (options.side.toLowerCase()) {
		case "east":
		case "e":
			fl = "W";
			break;
		case "west":
		case "w":
			fl = "K";
			break;
		default:
			fl = this.character({ pool: "KW" });
			break;
	}

	return (
		fl +
		this.character({ alpha: true, casing: "upper" }) +
		this.character({ alpha: true, casing: "upper" }) +
		this.character({ alpha: true, casing: "upper" })
	);
}

/**
 * Generate a random state
 * @param options - Configuration options
 * @param options.full - Return full name instead of abbreviation
 * @param options.country - Country code
 * @returns Random state name or abbreviation
 */
export function state(this: RandBox, options: any) {
	return options && options.full
		? this.pick(this.states(options)).name
		: this.pick(this.states(options)).abbreviation;
}

/**
 * Get array of states for a country
 * @param options - Configuration options
 * @param options.country - Country code (default: 'us')
 * @param options.us_states_and_dc - Include US states and DC
 * @param options.territories - Include territories
 * @param options.armed_forces - Include armed forces
 * @returns Array of state objects
 */
export function states(this: RandBox, options: any) {
	options = initOptions(options, { country: "us", us_states_and_dc: true });

	let states: any;

	switch (options.country.toLowerCase()) {
		case "us":
			var us_states_and_dc = this.get("us_states_and_dc"),
				territories = this.get("territories"),
				armed_forces = this.get("armed_forces");

			states = [];

			if (options.us_states_and_dc) {
				states = states.concat(us_states_and_dc);
			}
			if (options.territories) {
				states = states.concat(territories);
			}
			if (options.armed_forces) {
				states = states.concat(armed_forces);
			}
			break;
		case "it":
		case "mx":
			states = this.get("country_regions")[options.country.toLowerCase()];
			break;
		case "uk":
			states = this.get("counties")[options.country.toLowerCase()];
			break;
	}

	return states;
}

/**
 * Generate a random street address
 * @param options - Configuration options
 * @param options.country - Country code (default: 'us')
 * @param options.syllables - Number of syllables in street name
 * @param options.short_suffix - Use short street suffix
 * @returns Random street address
 */
export function street(this: RandBox, options: any) {
	options = initOptions(options, { country: "us", syllables: 2 });
	var street;

	switch (options.country.toLowerCase()) {
		case "us":
			street = this.word({ syllables: options.syllables });
			street = this.capitalize(street);
			street += " ";
			street += options.short_suffix
				? this.street_suffix(options).abbreviation
				: this.street_suffix(options).name;
			break;
		case "it":
			street = this.word({ syllables: options.syllables });
			street = this.capitalize(street);
			street =
				(options.short_suffix
					? this.street_suffix(options).abbreviation
					: this.street_suffix(options).name) +
				" " +
				street;
			break;
	}
	return street;
}

/**
 * Generate a random street suffix
 * @param options - Configuration options
 * @param options.country - Country code (default: 'us')
 * @returns Random street suffix object
 */
export function street_suffix(this: RandBox, options: any) {
	options = initOptions(options, { country: "us" });
	return this.pick(this.street_suffixes(options));
}

/**
 * Get array of street suffixes for a country
 * @param options - Configuration options
 * @param options.country - Country code (default: 'us')
 * @returns Array of street suffix objects
 */
export function street_suffixes(this: RandBox, options: any) {
	options = initOptions(options, { country: "us" });
	// These are the most common suffixes.
	return (
		this.get("street_suffixes")[options.country.toLowerCase()] ||
		this.get("street_suffixes")
	);
}

/**
 * Generate a random ZIP code
 * @param options - Configuration options
 * @param options.plusfour - Include plus four extension
 * @returns Random ZIP code
 */
export function zip(this: RandBox, options?: any) {
	var zip = this.n(this.natural, 5, { max: 9 });

	if (options && options.plusfour === true) {
		zip.push("-");
		zip = zip.concat(this.n(this.natural, 4, { max: 9 }));
	}

	return zip.join("");
}

// Export main location object
export const location = {
	address,
	altitude,
	areacode,
	city,
	coordinates,
	countries,
	counties,
	county,
	country,
	depth,
	geohash,
	geojson,
	latitude,
	longitude,
	phone,
	postal,
	postcode,
	provinces,
	province,
	radio,
	state,
	states,
	street,
	street_suffix,
	street_suffixes,
	zip,
};
