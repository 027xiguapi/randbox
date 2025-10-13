/**
 * Miscellaneous module
 * Contains various utility functions like dice, GUIDs, hashes, dates, etc.
 */

import { initOptions, testRange, HEX_POOL, RandBox } from "./core.js";

// Coin - Flip, flip, flipadelphia
export function coin(this: RandBox) {
	return this.bool() ? "heads" : "tails";
}

// Dice - For all the board game geeks out there, myself included ;)
function diceFn(range: any) {
	return function (this: RandBox) {
		return this.natural(range);
	};
}

export const d4 = diceFn({ min: 1, max: 4 });
export const d6 = diceFn({ min: 1, max: 6 });
export const d8 = diceFn({ min: 1, max: 8 });
export const d10 = diceFn({ min: 1, max: 10 });
export const d12 = diceFn({ min: 1, max: 12 });
export const d20 = diceFn({ min: 1, max: 20 });
export const d30 = diceFn({ min: 1, max: 30 });
export const d100 = diceFn({ min: 1, max: 100 });

export function emotion(this: RandBox) {
	return this.pick(this.get("emotions"));
}

export function tv(this: RandBox, options: any) {
	return this.radio(options);
}

export function rpg(this: RandBox, thrown: any, options: any) {
	options = initOptions(options);
	if (!thrown) {
		throw new RangeError("RandBox: A type of die roll must be included");
	} else {
		var bits = thrown.toLowerCase().split("d"),
			rolls = [];

		if (bits.length !== 2 || !parseInt(bits[0], 10) || !parseInt(bits[1], 10)) {
			throw new Error(
				"RandBox: Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die"
			);
		}
		for (var i = bits[0]; i > 0; i--) {
			rolls[i - 1] = this.natural({ min: 1, max: bits[1] });
		}
		return typeof options.sum !== "undefined" && options.sum
			? rolls.reduce(function (p, c) {
					return p + c;
			  })
			: rolls;
	}
}

// Guid
export function guid(this: RandBox, options: any) {
	options = initOptions(options, { version: 5 });

	var guid_pool = "abcdef1234567890",
		variant_pool = "ab89",
		guid =
			this.string({ pool: guid_pool, length: 8 }) +
			"-" +
			this.string({ pool: guid_pool, length: 4 }) +
			"-" +
			// The Version
			options.version +
			this.string({ pool: guid_pool, length: 3 }) +
			"-" +
			// The Variant
			this.string({ pool: variant_pool, length: 1 }) +
			this.string({ pool: guid_pool, length: 3 }) +
			"-" +
			this.string({ pool: guid_pool, length: 12 });
	return guid;
}

// Hash
export function hash(this: RandBox, options: any) {
	options = initOptions(options, { length: 40, casing: "lower" });
	var pool = options.casing === "upper" ? HEX_POOL.toUpperCase() : HEX_POOL;
	return this.string({ pool: pool, length: options.length });
}

export function ampm(this: RandBox) {
	return this.bool() ? "am" : "pm";
}

// Date functions
export function date(this: RandBox, options: any) {
	var date_string: string, date: Date;

	// If interval is specified we ignore preset
	if (options && (options.min || options.max)) {
		options = initOptions(options, {
			american: true,
			string: false,
		});
		var min = typeof options.min !== "undefined" ? options.min.getTime() : 1;
		// 100,000,000 days measured relative to midnight at the beginning of 01 January, 1970 UTC. http://es5.github.io/#x15.9.1.1
		var max =
			typeof options.max !== "undefined"
				? options.max.getTime()
				: 8640000000000000;

		date = new Date(this.integer({ min: min, max: max }));
	} else {
		var m = this.month({ raw: true });
		var daysInMonth = m.days;

		if (options && options.month) {
			// Mod 12 to allow months outside range of 0-11 (not encouraged, but also not prevented).
			daysInMonth = this.get("months")[((options.month % 12) + 12) % 12].days;
		}

		options = initOptions(options, {
			year: parseInt(this.year(), 10),
			// Necessary to subtract 1 because Date() 0-indexes month but not day or year
			// for some reason.
			month: m.numeric - 1,
			day: this.natural({ min: 1, max: daysInMonth }),
			hour: this.hour({ twentyfour: true }),
			minute: this.minute(),
			second: this.second(),
			millisecond: this.millisecond(),
			american: true,
			string: false,
		});

		date = new Date(
			options.year,
			options.month,
			options.day,
			options.hour,
			options.minute,
			options.second,
			options.millisecond
		);
	}

	if (options.american) {
		// Adding 1 to the month is necessary because Date() 0-indexes
		// months but not day for some odd reason.
		date_string =
			date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
	} else {
		date_string =
			date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
	}

	return options.string ? date_string : date;
}

export function hammertime(this: RandBox, options: any) {
	return this.date(options).getTime();
}

export function millisecond(this: RandBox) {
	return this.natural({ max: 999 });
}

export function second(this: RandBox, options: any) {
	options = initOptions(options, { min: 0, max: 59 });

	testRange(options.min < 0, "RandBox: Min cannot be less than 0.");
	testRange(options.max > 59, "RandBox: Max cannot be greater than 59.");
	testRange(
		options.min > options.max,
		"RandBox: Min cannot be greater than Max."
	);

	return this.natural({ min: options.min, max: options.max });
}

export function minute(this: RandBox, options: any) {
	options = initOptions(options, { min: 0, max: 59 });

	testRange(options.min < 0, "RandBox: Min cannot be less than 0.");
	testRange(options.max > 59, "RandBox: Max cannot be greater than 59.");
	testRange(
		options.min > options.max,
		"RandBox: Min cannot be greater than Max."
	);

	return this.natural({ min: options.min, max: options.max });
}

export function hour(this: RandBox, options: any) {
	options = initOptions(options, {
		min: options && options.twentyfour ? 0 : 1,
		max: options && options.twentyfour ? 23 : 12,
	});

	testRange(options.min < 0, "RandBox: Min cannot be less than 0.");
	testRange(
		options.twentyfour && options.max > 23,
		"RandBox: Max cannot be greater than 23 for twentyfour option."
	);
	testRange(
		!options.twentyfour && options.max > 12,
		"RandBox: Max cannot be greater than 12."
	);
	testRange(
		options.min > options.max,
		"RandBox: Min cannot be greater than Max."
	);

	return this.natural({ min: options.min, max: options.max });
}

export function month(this: RandBox, options: any) {
	options = initOptions(options, { min: 1, max: 12 });

	testRange(options.min < 1, "RandBox: Min cannot be less than 1.");
	testRange(options.max > 12, "RandBox: Max cannot be greater than 12.");
	testRange(
		options.min > options.max,
		"RandBox: Min cannot be greater than Max."
	);

	var month = this.pick(this.get("months").slice(options.min - 1, options.max));
	return options.raw ? month : month.name;
}

export function months(this: RandBox) {
	return this.get("months");
}

export function timestamp(this: RandBox) {
	// Generate timestamp from Unix epoch to current time (in seconds)
	const now = Math.floor(new Date().getTime() / 1000);
	const epoch = 1; // Unix epoch start (1970-01-01 00:00:00 UTC) in seconds
	return this.integer({ min: epoch, max: now });
}

export function weekday(this: RandBox, options: any) {
	options = initOptions(options, { weekday_only: false });
	var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	if (!options.weekday_only) {
		weekdays.push("Saturday");
		weekdays.push("Sunday");
	}
	return this.pickone(weekdays);
}

export function year(this: RandBox, options: any) {
	// Set default range from current year to a century in the future
	const currentYear = new Date().getFullYear();
	const defaultMin = currentYear; // Start from current year, not past
	const defaultMax = currentYear + 100;

	// Check what was originally provided
	const hasMin = options && options.hasOwnProperty("min");
	const hasMax = options && options.hasOwnProperty("max");

	options = initOptions(options, { min: defaultMin, max: defaultMax });

	// If only min is specified and it's higher than default max, adjust max
	if (hasMin && !hasMax && options.min > defaultMax) {
		options.max = options.min + 100;
	}
	// If only max is specified and it's lower than default min, adjust min
	if (hasMax && !hasMin && options.max < defaultMin) {
		options.min = options.max - 100;
	}

	return this.natural(options).toString();
}

// Timezone
export function timezone(this: RandBox) {
	return this.pickone(this.get("timezones"));
}


export function mac_address(this: RandBox, options?: any) {
    // typically mac addresses are separated by ":"
    // however they can also be separated by "-"
    // the network variant uses a dot every fourth byte

    options = initOptions(options);
    if (!options.separator) {
        options.separator = options.networkVersion ? "." : ":";
    }

    var mac_pool = "ABCDEF1234567890",
        mac = "";
    if (!options.networkVersion) {
        mac = this.n(this.string, 6, { pool: mac_pool, length: 2 }).join(options.separator);
    } else {
        mac = this.n(this.string, 3, { pool: mac_pool, length: 4 }).join(options.separator);
    }

    return mac;
}

/**
 * Return a random file name
 * If nothing is provided the function return random file name with random
 * extension provided by the collection poolCollectionKey
 *
 * The user can provide an array or object collection for file extension
 * If an array is provided, chance will pick a random extension out of the array
 * If an object is provided, chance will pick a random extension out of the
 * objects keys and then pick a random extension out of that collection
 *
 * @param {Object} [options={}] can specify fileType OR extension OR extensions
 * @returns {String} a random filename with extension
 */
export function file(this: RandBox, options?: any): string {
	const fileOptions = options || {};
	const poolCollectionKey = "file_extensions";
	const typeRange = Object.keys(this.get(poolCollectionKey)); // ['raster', 'vector', 'audio', 'document', etc]
	let fileName: string;
	let fileExtension: string;

	// Generate random file name
	fileName = this.word({ length: fileOptions.length });

	// Generate file by specific extension provided by the user
	if (fileOptions.extension) {
		fileExtension = fileOptions.extension;
		return fileName + "." + fileExtension;
	}

	// Generate file by specific extension collection
	if (fileOptions.extensions) {
		if (Array.isArray(fileOptions.extensions)) {
			fileExtension = this.pickone(fileOptions.extensions);
			return fileName + "." + fileExtension;
		} else if (fileOptions.extensions.constructor === Object) {
			const extensionObjectCollection = fileOptions.extensions;
			const keys = Object.keys(extensionObjectCollection);
			fileExtension = this.pickone(
				extensionObjectCollection[this.pickone(keys)]
			);
			return fileName + "." + fileExtension;
		}
		throw new Error("RandBox: Extensions must be an Array or Object");
	}

	// Generate file extension based on specific file type
	if (fileOptions.fileType) {
		const fileType = fileOptions.fileType;
		if (typeRange.indexOf(fileType) !== -1) {
			fileExtension = this.pickone(this.get(poolCollectionKey)[fileType]);
			return fileName + "." + fileExtension;
		}
		throw new RangeError(
			"RandBox: Expect file type value to be 'raster', 'vector', 'audio', 'video', 'document', 'spreadsheet', 'presentation', 'archive', or 'code'"
		);
	}

	// Generate random file name if no extension options are passed
	fileExtension = this.pickone(
		this.get(poolCollectionKey)[this.pickone(typeRange)]
	);
	return fileName + "." + fileExtension;
}

/**
 * Generates file data of random bytes using the file method for the file name
 *
 * @param {object} options
 * fileName: String
 * fileExtension: String
 * fileSize: Number (in bytes)
 * @returns {object} fileName: String, fileData: Buffer
 */
export function fileWithContent(
	this: RandBox,
	options?: any
): { fileName: string; fileData: Buffer } {
	const fileOptions = options || {};
	let fileName =
		"fileName" in fileOptions
			? fileOptions.fileName
			: this.file().split(".")[0];
	fileName +=
		"." +
		("fileExtension" in fileOptions
			? fileOptions.fileExtension
			: this.file().split(".")[1]);

	if (typeof fileOptions.fileSize !== "number") {
		throw new Error("File size must be an integer");
	}

	const fileData = {
		fileData: this.buffer({ length: fileOptions.fileSize }),
		fileName: fileName,
	};

	return fileData;
}

// Export main miscellaneous object
export const miscellaneous = {
	coin,
	d4,
	d6,
	d8,
	d10,
	d12,
	d20,
	d30,
	d100,
	rpg,
	guid,
	hash,
	ampm,
	date,
	hammertime,
	millisecond,
	second,
	minute,
	hour,
	month,
	months,
	timestamp,
	weekday,
	year,
	timezone,
	mac_address,
	file,
	fileWithContent,
	emotion,
	tv,
};
