/**
 * Finance module for RandBox.js
 * Contains financial data generation functions like credit cards, currencies, etc.
 */

import { initOptions, RandBox } from "./core.js";

export interface CreditCardOptions {
	type?: string;
}

/**
 * Generate a random credit card number
 * @param options - Configuration options
 * @param options.type - Credit card type
 * @returns Random credit card number
 */
export function cc(this: RandBox, options?: CreditCardOptions) {
	options = initOptions(options);

	var type, number, to_generate;

	type = options.type
		? this.cc_type({ name: options.type, raw: true })
		: this.cc_type({ raw: true });

	number = type.prefix.split("");
	to_generate = type.length - type.prefix.length - 1;

	// Generates n - 1 digits
	number = number.concat(this.n(this.integer, to_generate, { min: 0, max: 9 }));

	// Generates the last digit according to Luhn algorithm
	number.push(this.luhn_calculate(number.join("")));

	return number.join("");
}

/**
 * Get array of credit card types
 * @returns Array of credit card type objects
 */
export function cc_types(this: RandBox) {
	// http://en.wikipedia.org/wiki/Bank_card_number#Issuer_identification_number_.28IIN.29
	return this.get("cc_types");
}

/**
 * Generate a random credit card type
 * @param options - Configuration options
 * @param options.name - Specific card type name
 * @param options.raw - Return raw object instead of name
 * @returns Random credit card type
 */
export function cc_type(this: RandBox, options: any) {
	options = initOptions(options);
	var types = this.cc_types(),
		type = null;

	if (options.name) {
		for (var i = 0; i < types.length; i++) {
			// Accept either name or short_name to specify card type
			if (
				types[i].name === options.name ||
				types[i].short_name === options.name
			) {
				type = types[i];
				break;
			}
		}
		if (type === null) {
			throw new RangeError(
				"RandBox: Credit card type '" + options.name + "' is not supported"
			);
		}
	} else {
		type = this.pickone(types);
	}

	return options.raw ? type : type.name;
}

/**
 * Get array of currency types
 * @returns Array of currency type objects
 */
export function currency_types(this: RandBox) {
	return this.get("currency_types");
}

/**
 * Generate a random currency
 * @returns Random currency object
 */
export function currency(this: RandBox) {
	return this.pickone(this.get("currency_types"));
}

/**
 * Generate a random currency pair
 * @param returnAsString - Return as string format instead of array
 * @returns Random currency pair
 */
export function currency_pair(this: RandBox, returnAsString?: any) {
	var currencies = this.unique(this.currency, 2, {
		comparator: function (arr: any[], val: any) {
			return arr.reduce(function (acc: boolean, item: any) {
				return acc || item.code === val.code;
			}, false);
		},
	});

	if (returnAsString) {
		return currencies[0].code + "/" + currencies[1].code;
	} else {
		return currencies;
	}
}

/**
 * Generate a random dollar amount
 * @param options - Configuration options
 * @param options.max - Maximum dollar amount
 * @param options.min - Minimum dollar amount
 * @returns Random dollar amount as formatted string
 */
export function dollar(this: RandBox, options: any) {
	// By default, a somewhat more sane max for dollar than all available numbers
	options = initOptions(options, { max: 10000, min: 0 });

	var dollar = this.floating({
			min: options.min,
			max: options.max,
			fixed: 2,
		}).toString(),
		cents = dollar.split(".")[1];

	if (cents === undefined) {
		dollar += ".00";
	} else if (cents.length < 2) {
		dollar = dollar + "0";
	}

	if (dollar < 0) {
		return "-$" + dollar.replace("-", "");
	} else {
		return "$" + dollar;
	}
}

/**
 * Generate a random euro amount
 * @param options - Configuration options (same as dollar)
 * @returns Random euro amount as formatted string
 */
export function euro(this: RandBox, options: any) {
	return Number(this.dollar(options).replace("$", "")).toLocaleString() + "€";
}

/**
 * Generate a random credit card expiration date
 * @param options - Configuration options
 * @param options.raw - Return as object instead of formatted string
 * @returns Random expiration date
 */
export function exp(this: RandBox, options: any) {
	options = initOptions(options);
	var exp: any = {};

	exp.year = this.exp_year();

	// If the year is this year, need to ensure month is greater than the
	// current month or this expiration will not be valid
	if (exp.year === new Date().getFullYear().toString()) {
		exp.month = this.exp_month({ future: true });
	} else {
		exp.month = this.exp_month();
	}

	return options.raw ? exp : exp.month + "/" + exp.year;
}

/**
 * Generate a random expiration month
 * @param options - Configuration options
 * @param options.future - Ensure month is in the future
 * @returns Random expiration month
 */
export function exp_month(this: RandBox, options: any) {
	options = initOptions(options);
	var month,
		month_int,
		// Date object months are 0 indexed
		curMonth = new Date().getMonth() + 1;

	if (options.future && curMonth !== 12) {
		do {
			month = this.month({ raw: true }).numeric;
			month_int = parseInt(month, 10);
		} while (month_int <= curMonth);
	} else {
		month = this.month({ raw: true }).numeric;
	}

	return month;
}

/**
 * Generate a random expiration year
 * @returns Random expiration year (current year to 10 years in future)
 */
export function exp_year(this: RandBox) {
	var curMonth = new Date().getMonth() + 1,
		curYear = new Date().getFullYear();

	return this.year({
		min: curMonth === 12 ? curYear + 1 : curYear,
		max: curYear + 10,
	});
}

/**
 * Generate a random VAT number
 * @param options - Configuration options
 * @param options.country - Country code (default: 'it')
 * @returns Random VAT number
 */
export function vat(this: RandBox, options: any) {
	options = initOptions(options, { country: "it" });
	switch (options.country.toLowerCase()) {
		case "it":
			return this.it_vat();
	}
}

/**
 * Generate a string matching IBAN pattern (https://en.wikipedia.org/wiki/International_Bank_Account_Number).
 * No country-specific formats support (yet)
 */
/**
 * Generate a random IBAN (International Bank Account Number)
 * @returns Random IBAN string
 */
export function iban(this: RandBox) {
	var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var alphanum = alpha + "0123456789";
	var iban =
		this.string({ length: 2, pool: alpha }) +
		this.pad(this.integer({ min: 0, max: 99 }), 2) +
		this.string({ length: 4, pool: alphanum }) +
		this.pad(this.natural(), this.natural({ min: 6, max: 26 }));
	return iban;
}

// Luhn algorithm checker
/**
 * Validate a number using the Luhn algorithm
 * @param num - Number to validate
 * @returns True if number passes Luhn check
 */
export function luhn_check(num: any) {
	num = num.toString();
	var checkDigit = parseInt(num.slice(-1), 10);
	var checkSum = 0;

	for (var i = num.length - 2; i >= 0; i--) {
		var digit = parseInt(num.charAt(i), 10);
		if ((num.length - 2 - i) % 2 === 0) {
			digit *= 2;
			if (digit > 9) {
				digit -= 9;
			}
		}
		checkSum += digit;
	}
	return (checkSum * 9) % 10 === checkDigit;
}

// Luhn algorithm calculator
/**
 * Calculate the Luhn check digit for a number
 * @param num - Number to calculate check digit for
 * @returns Luhn check digit
 */
export function luhn_calculate(num: any) {
	num = num.toString();
	var checkSum = 0;

	for (var i = num.length - 1; i >= 0; i--) {
		var digit = parseInt(num.charAt(i), 10);
		if ((num.length - 1 - i) % 2 === 0) {
			digit *= 2;
			if (digit > 9) {
				digit -= 9;
			}
		}
		checkSum += digit;
	}
	return (Math.ceil(checkSum / 10) * 10 - checkSum) % 10;
}

// Export main finance object
export const finance = {
	cc,
	cc_types,
	cc_type,
	currency,
	currency_pair,
	dollar,
	euro,
	exp,
	exp_month,
	exp_year,
	iban,
	luhn_check,
	luhn_calculate,
	vat,
};
