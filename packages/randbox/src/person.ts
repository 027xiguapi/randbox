/**
 * Person module for RandBox.js
 * Contains person-related generation functions like names, ages, genders, etc.
 */

import { initOptions, testRange, RandBox } from "./core.js";

/**
 * Generate a random age
 * @param options - Configuration options
 * @param options.type - Age type ('child', 'teen', 'adult', 'senior', 'all')
 * @returns Random age
 */
export function age(this: RandBox, options: any) {
	options = initOptions(options);
	var ageRange;

	switch (options.type) {
		case "child":
			ageRange = { min: 0, max: 12 };
			break;
		case "teen":
			ageRange = { min: 13, max: 19 };
			break;
		case "adult":
			ageRange = { min: 18, max: 65 };
			break;
		case "senior":
			ageRange = { min: 65, max: 100 };
			break;
		case "all":
			ageRange = { min: 0, max: 100 };
			break;
		default:
			ageRange = { min: 18, max: 65 };
			break;
	}

	return this.natural(ageRange);
}

/**
 * Generate a random birthday
 * @param options - Configuration options
 * @param options.type - Age type for the birthday
 * @param options.minAge - Minimum age
 * @param options.maxAge - Maximum age
 * @returns Random birthday date
 */
export function birthday(this: RandBox, options: any) {
	var age = this.age(options);
	var now = new Date();
	var currentYear = now.getFullYear();

	if (options && options.type) {
		var min = new Date();
		var max = new Date();
		min.setFullYear(currentYear - age - 1);
		max.setFullYear(currentYear - age);

		options = initOptions(options, {
			min: min,
			max: max,
		});
	} else if (
		options &&
		(options.minAge !== undefined || options.maxAge !== undefined)
	) {
		testRange(options.minAge < 0, "RandBox: MinAge cannot be less than zero.");
		testRange(
			options.minAge > options.maxAge,
			"RandBox: MinAge cannot be greater than MaxAge."
		);

		var minAge = options.minAge !== undefined ? options.minAge : 0;
		var maxAge = options.maxAge !== undefined ? options.maxAge : 100;

		var minDate = new Date(
			currentYear - maxAge - 1,
			now.getMonth(),
			now.getDate()
		);
		var maxDate = new Date(currentYear - minAge, now.getMonth(), now.getDate());

		minDate.setDate(minDate.getDate() + 1);

		maxDate.setDate(maxDate.getDate() + 1);
		maxDate.setMilliseconds(maxDate.getMilliseconds() - 1);

		options = initOptions(options, {
			min: minDate,
			max: maxDate,
		});
	} else {
		options = initOptions(options, {
			year: currentYear - age,
		});
	}

	return this.date(options);
}

/**
 * Generate a random Brazilian CPF (Cadastro de Pessoas Físicas)
 * @param options - Configuration options
 * @param options.formatted - Whether to include formatting (dots and dash)
 * @returns Random CPF
 */
export function cpf(this: RandBox, options: any) {
	options = initOptions(options, {
		formatted: true,
	});

	var n = this.n(this.natural, 9, { max: 9 });
	var d1 =
		n[8] * 2 +
		n[7] * 3 +
		n[6] * 4 +
		n[5] * 5 +
		n[4] * 6 +
		n[3] * 7 +
		n[2] * 8 +
		n[1] * 9 +
		n[0] * 10;
	d1 = 11 - (d1 % 11);
	if (d1 >= 10) d1 = 0;
	var d2 =
		d1 * 2 +
		n[8] * 3 +
		n[7] * 4 +
		n[6] * 5 +
		n[5] * 6 +
		n[4] * 7 +
		n[3] * 8 +
		n[2] * 9 +
		n[1] * 10 +
		n[0] * 11;
	d2 = 11 - (d2 % 11);
	if (d2 >= 10) d2 = 0;
	var cpf =
		"" +
		n[0] +
		n[1] +
		n[2] +
		"." +
		n[3] +
		n[4] +
		n[5] +
		"." +
		n[6] +
		n[7] +
		n[8] +
		"-" +
		d1 +
		d2;
	return options.formatted ? cpf : cpf.replace(/\D/g, "");
}

/**
 * Generate a random Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * @returns Random formatted CNPJ
 */
export function cnpj(this: RandBox) {
	var n = this.n(this.natural, 8, { max: 9 });
	var d1 =
		2 +
		n[7] * 6 +
		n[6] * 7 +
		n[5] * 8 +
		n[4] * 9 +
		n[3] * 2 +
		n[2] * 3 +
		n[1] * 4 +
		n[0] * 5;
	d1 = 11 - (d1 % 11);
	if (d1 >= 10) {
		d1 = 0;
	}
	var d2 =
		d1 * 2 +
		3 +
		n[7] * 7 +
		n[6] * 8 +
		n[5] * 9 +
		n[4] * 2 +
		n[3] * 3 +
		n[2] * 4 +
		n[1] * 5 +
		n[0] * 6;
	d2 = 11 - (d2 % 11);
	if (d2 >= 10) {
		d2 = 0;
	}
	return (
		"" +
		n[0] +
		n[1] +
		"." +
		n[2] +
		n[3] +
		n[4] +
		"." +
		n[5] +
		n[6] +
		n[7] +
		"/0001-" +
		d1 +
		d2
	);
}

/**
 * Generate a random first name
 * @param options - Configuration options
 * @param options.gender - Gender for the name ('male' or 'female')
 * @param options.nationality - Nationality code (default: 'en')
 * @returns Random first name
 */
export function first(this: RandBox, options: any) {
	options = initOptions(options, { gender: this.gender(), nationality: "en" });
	return this.pickone(
		this.get("firstNames")[options.gender.toLowerCase()][
			options.nationality.toLowerCase()
		]
	);
}

/**
 * Generate a random gender
 * @param options - Configuration options
 * @param options.extraGenders - Additional genders to include
 * @returns Random gender
 */
export function gender(this: RandBox, options: any) {
	options = initOptions(options, { extraGenders: [] });
	return this.pickone(["Male", "Female"].concat(options.extraGenders));
}

/**
 * Generate a random last name
 * @param options - Configuration options
 * @param options.nationality - Nationality code (default: '*' for all)
 * @returns Random last name
 */
export function last(this: RandBox, options: any) {
	options = initOptions(options, { nationality: "*" });
	if (options.nationality === "*") {
		var allLastNames = this.get("lastNames"),
			lastNames: any[] = [];
		Object.keys(allLastNames).forEach(function (nat) {
			lastNames = lastNames.concat(allLastNames[nat]);
		});
		return this.pickone(lastNames);
	} else {
		return this.pickone(
			this.get("lastNames")[options.nationality.toLowerCase()]
		);
	}
}

/**
 * Generate a random Israeli ID number
 * @returns Random Israeli ID number
 */
export function israelId(this: RandBox) {
	var x = this.string({ pool: "0123456789", length: 8 });
	var y = 0;
	for (var i = 0; i < x.length; i++) {
		var thisDigit = parseInt(x[i], 10) * (Math.floor(i / 2) === i / 2 ? 1 : 2);
		var thisDigitStr = this.pad(thisDigit, 2).toString();
		thisDigit = parseInt(thisDigitStr[0]) + parseInt(thisDigitStr[1]);
		y = y + thisDigit;
	}
	x = x + (10 - parseInt(y.toString().slice(-1))).toString().slice(-1);
	return x;
}

/**
 * Generate a random MRZ (Machine Readable Zone) for passport
 * @param options - Configuration options
 * @param options.first - First name
 * @param options.last - Last name
 * @param options.passportNumber - Passport number
 * @param options.nationality - Nationality code
 * @param options.issuer - Issuer country code
 * @returns Random MRZ string
 */
export function mrz(this: RandBox, options: any) {
	var checkDigit = function (input: any) {
		var alpha = "<ABCDEFGHIJKLMNOPQRSTUVWXYXZ".split(""),
			multipliers = [7, 3, 1],
			runningTotal = 0;

		if (typeof input !== "string") {
			input = input.toString();
		}

		input.split("").forEach(function (character: string, idx: number) {
			var pos = alpha.indexOf(character);
			var charValue: number;

			if (pos !== -1) {
				charValue = pos === 0 ? 0 : pos + 9;
			} else {
				charValue = parseInt(character, 10);
			}
			charValue *= multipliers[idx % multipliers.length];
			runningTotal += charValue;
		});
		return runningTotal % 10;
	};

	var generate = function (opts: any) {
		var pad = function (length: any) {
			return new Array(length + 1).join("<");
		};
		var number = [
			"P<",
			opts.issuer,
			opts.last.toUpperCase(),
			"<<",
			opts.first.toUpperCase(),
			pad(39 - (opts.last.length + opts.first.length + 2)),
			opts.passportNumber,
			checkDigit(opts.passportNumber),
			opts.nationality,
			opts.dob,
			checkDigit(opts.dob),
			opts.gender,
			opts.expiry,
			checkDigit(opts.expiry),
			pad(14),
			checkDigit(pad(14)),
		].join("");

		return (
			number +
			checkDigit(
				number.substr(44, 10) + number.substr(57, 7) + number.substr(65, 7)
			)
		);
	};

	var that = this;

	options = initOptions(options, {
		first: this.first(),
		last: this.last(),
		passportNumber: this.string({ pool: "0123456789", length: 9 }),
		dob: (function () {
			var date = that.birthday({ type: "adult" });
			return [
				date.getFullYear().toString().slice(2),
				that.pad(date.getMonth() + 1, 2),
				that.pad(date.getDate(), 2),
			].join("");
		})(),
		expiry: (function () {
			var date = new Date();
			return [
				(date.getFullYear() + 5).toString().slice(2),
				that.pad(date.getMonth() + 1, 2),
				that.pad(date.getDate(), 2),
			].join("");
		})(),
		gender: this.gender() === "Female" ? "F" : "M",
		issuer: "GBR",
		nationality: "GBR",
	});

	return generate({
		first: options.first,
		last: options.last,
		passportNumber: options.passportNumber,
		dob: options.dob,
		expiry: options.expiry,
		gender: options.gender,
		issuer: options.issuer,
		nationality: options.nationality,
		personal: that.string({ pool: "0123456789", length: 14 }),
	});
}

/**
 * Generate a random full name
 * @param options - Configuration options
 * @param options.middle - Include middle name
 * @param options.middle_initial - Include middle initial
 * @param options.prefix - Include name prefix
 * @param options.suffix - Include name suffix
 * @returns Random full name
 */
export function name(this: RandBox, options: any) {
	options = initOptions(options);

	var first = this.first(options),
		last = this.last(options),
		name;

	if (options.middle) {
		name = first + " " + this.first(options) + " " + last;
	} else if (options.middle_initial) {
		name =
			first +
			" " +
			this.character({ alpha: true, casing: "upper" }) +
			". " +
			last;
	} else {
		name = first + " " + last;
	}

	if (options.prefix) {
		name = this.prefix(options) + " " + name;
	}

	if (options.suffix) {
		name = name + " " + this.suffix(options);
	}

	return name;
}

/**
 * Generate a random name prefix
 * @param options - Configuration options
 * @param options.gender - Gender for the prefix
 * @returns Random name prefix
 */
export function prefix(this: RandBox, options: any) {
	options = initOptions(options, { gender: this.gender() });
	return this.pick(this.name_prefixes(options.gender.toLowerCase())).abbreviation;
}

/**
 * Generate a random Social Security Number (SSN)
 * @param options - Configuration options
 * @param options.ssnFour - Return only last 4 digits
 * @param options.dashes - Include dashes in formatting
 * @returns Random SSN
 */
export function ssn(this: RandBox, options: any) {
	options = initOptions(options, { ssnFour: false, dashes: true });

	var ssn_pool = "1234567890",
		ssn,
		dash = options.dashes ? "-" : "";

	if (!options.ssnFour) {
		ssn =
			this.string({ pool: ssn_pool, length: 3 }) +
			dash +
			this.string({ pool: ssn_pool, length: 2 }) +
			dash +
			this.string({ pool: ssn_pool, length: 4 });
	} else {
		ssn = this.string({ pool: ssn_pool, length: 4 });
	}

	return ssn;
}

/**
 * Generate a random name suffix
 * @param options - Configuration options
 * @returns Random name suffix
 */
export function suffix(this: RandBox, options: any) {
	return this.name_suffix(options);
}

/**
 * Generate a random name suffix (alias for suffix)
 * @param options - Configuration options
 * @param options.full - Return full name instead of abbreviation
 * @returns Random name suffix
 */
export function name_suffix(this: RandBox, options: any) {
	options = initOptions(options);
	return options.full
		? this.pick(this.name_suffixes()).name
		: this.pick(this.name_suffixes()).abbreviation;
}

/**
 * Generate a random Aadhar number (Indian identification)
 * @param options - Configuration options
 * @param options.onlyLastFour - Return only last 4 digits
 * @param options.separatedByWhiteSpace - Include spaces for formatting
 * @returns Random Aadhar number
 */
export function aadhar(this: RandBox, options: any) {
	options = initOptions(options, {
		onlyLastFour: false,
		separatedByWhiteSpace: true,
	});
	var aadhar_pool = "1234567890",
		aadhar,
		whiteSpace = options.separatedByWhiteSpace ? " " : "";

	if (!options.onlyLastFour) {
		aadhar =
			this.string({ pool: aadhar_pool, length: 4 }) +
			whiteSpace +
			this.string({ pool: aadhar_pool, length: 4 }) +
			whiteSpace +
			this.string({ pool: aadhar_pool, length: 4 });
	} else {
		aadhar = this.string({ pool: aadhar_pool, length: 4 });
	}
	return aadhar;
}

/**
 * Get array of name suffixes
 * @returns Array of name suffix objects with name and abbreviation
 */
export function name_suffixes(this: RandBox) {
	var suffixes = [
		{ name: "Doctor of Osteopathic Medicine", abbreviation: "D.O." },
		{ name: "Doctor of Philosophy", abbreviation: "Ph.D." },
		{ name: "Esquire", abbreviation: "Esq." },
		{ name: "Junior", abbreviation: "Jr." },
		{ name: "Juris Doctor", abbreviation: "J.D." },
		{ name: "Master of Arts", abbreviation: "M.A." },
		{ name: "Master of Business Administration", abbreviation: "M.B.A." },
		{ name: "Master of Science", abbreviation: "M.S." },
		{ name: "Medical Doctor", abbreviation: "M.D." },
		{ name: "Senior", abbreviation: "Sr." },
		{ name: "The Third", abbreviation: "III" },
		{ name: "The Fourth", abbreviation: "IV" },
		{ name: "Bachelor of Engineering", abbreviation: "B.E" },
		{ name: "Bachelor of Technology", abbreviation: "B.TECH" },
	];
	return suffixes;
}

/**
 * Generate a random animal name
 * @param options - Configuration options
 * @param options.type - Animal type ('ocean', 'desert', 'grassland', 'forest', 'zoo', 'pets', 'farm')
 * @returns Random animal name
 */
export function animal(this: RandBox, options: any) {
	options = initOptions(options);

	if (typeof options.type !== "undefined") {
		// Can't use a switch here because it's not a constant
		if (options.type === "ocean") {
			return this.pickone(this.get("animals")["ocean"]);
		}
		if (options.type === "desert") {
			return this.pickone(this.get("animals")["desert"]);
		}
		if (options.type === "grassland") {
			return this.pickone(this.get("animals")["grassland"]);
		}
		if (options.type === "forest") {
			return this.pickone(this.get("animals")["forest"]);
		}
		if (options.type === "zoo") {
			return this.pickone(this.get("animals")["zoo"]);
		}
		if (options.type === "pets") {
			return this.pickone(this.get("animals")["pets"]);
		}
		if (options.type === "farm") {
			return this.pickone(this.get("animals")["farm"]);
		}
	} else {
		var animals = this.get("animals");
		var animalTypeArray = [
			"ocean",
			"desert",
			"grassland",
			"forest",
			"zoo",
			"pet",
			"farm",
		];
		return this.pickone(animals[this.pickone(animalTypeArray)]);
	}

	throw new RangeError(
		"Please pick from desert, ocean, grassland, forest, zoo, pets, farm."
	);
}

/**
 * Generate a random zodiac sign
 * @returns Random zodiac sign
 */
export function zodiac(this: RandBox) {
	const zodiacSigns = [
		"Aries",
		"Taurus",
		"Gemini",
		"Cancer",
		"Leo",
		"Virgo",
		"Libra",
		"Scorpio",
		"Sagittarius",
		"Capricorn",
		"Aquarius",
		"Pisces",
	];
	return this.pickone(zodiacSigns);
}

/**
 * Generate a random profession
 * @param options - Configuration options
 * @param options.rank - Include professional rank (Apprentice, Junior, Senior, Lead)
 * @returns Random profession
 */
export function profession(this: RandBox, options: any) {
	options = initOptions(options);
	if (options.rank) {
		return (
			this.pick(["Apprentice ", "Junior ", "Senior ", "Lead "]) +
			this.pick(this.get("profession"))
		);
	} else {
		return this.pick(this.get("profession"));
	}
}

/**
 * Generate a random nationality
 * @returns Random nationality name
 */
export function nationality(this: RandBox) {
	var nationality = this.pick(this.nationalities());
	return nationality.name;
}

/**
 * Generate a random Hungarian ID number
 * @returns Random Hungarian ID number (format: XXXXXXYY)
 */
export function HIDN(this: RandBox) {
	//Hungarian ID nuber structure: XXXXXXYY (X=number,Y=Capital Latin letter)
	var idn_pool = "0123456789";
	var idn_chrs = "ABCDEFGHIJKLMNOPQRSTUVWXYXZ";
	var idn = "";
	idn += this.string({ pool: idn_pool, length: 6 });
	idn += this.string({ pool: idn_chrs, length: 2 });
	return idn;
}

/**
 * Generate a random company name
 * @returns Random company name
 */
export function company(this: RandBox) {
	return this.pick(this.get("company"));
}

/**
 * Get array of nationalities
 * @returns Array of nationality objects
 */
export function nationalities(this: RandBox) {
	return this.get("nationalities");
}

/**
 * Generate a random name prefix
 * @param options - Configuration options
 * @param options.gender - Gender for the prefix ('male', 'female', 'all')
 * @param options.full - Return full name instead of abbreviation
 * @returns Random name prefix
 */
export function name_prefix(this: RandBox, options: any) {
	options = initOptions(options, { gender: "all" });
	return options.full
		? this.pick(this.name_prefixes(options.gender)).name
		: this.pick(this.name_prefixes(options.gender)).abbreviation;
}

/**
 * Get array of name prefixes
 * @param gender - Gender filter ('male', 'female', 'all')
 * @returns Array of name prefix objects with name and abbreviation
 */
export function name_prefixes(this: RandBox, gender: string) {
	gender = gender || "all";
	gender = gender.toLowerCase();

	var prefixes = [{ name: "Doctor", abbreviation: "Dr." }];

	if (gender === "male" || gender === "all") {
		prefixes.push({ name: "Mister", abbreviation: "Mr." });
	}

	if (gender === "female" || gender === "all") {
		prefixes.push({ name: "Miss", abbreviation: "Miss" });
		prefixes.push({ name: "Misses", abbreviation: "Mrs." });
	}

	return prefixes;
}

// Export main person object
export const person = {
	age,
	birthday,
	cpf,
	cnpj,
	first,
	gender,
	last,
	israelId,
	mrz,
	name,
	prefix,
	ssn,
	suffix,
	name_suffix,
	name_suffixes,
	aadhar,
	animal,
	zodiac,
	profession,
	nationality,
	HIDN,
	company,
	nationalities,
	name_prefix,
	name_prefixes,
};
