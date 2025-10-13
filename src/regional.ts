/**
 * Regional module for RandBox.js
 * Contains regional identification number and code generation functions
 */

import { RandBox, initOptions } from "./core.js";

export function it_vat(this: RandBox) {
	var it_vat = this.natural({ min: 1, max: 1800000 });

	it_vat =
		this.pad(it_vat, 7) +
		this.pad(this.pick(this.provinces({ country: "it" })).code, 3);
	return it_vat + this.luhn_calculate(it_vat);
}

/*
* this generator is written following the official algorithm
* all data can be passed explicitely or randomized by calling chance.cf() without options
* the code does not check that the input data is valid (it goes beyond the scope of the generator)
*
* @param  [Object] options = { first: first name,
*                              last: last name,
*                              gender: female|male,
															birthday: JavaScript date object,
															city: string(4), 1 letter + 3 numbers
															}
* @return [string] codice fiscale
*
*/
export function cf(this: RandBox, options?: any) {
	options = options || {};
	var gender = !!options.gender ? options.gender : this.gender(),
		first = !!options.first
			? options.first
			: this.first({ gender: gender, nationality: "it" }),
		last = !!options.last ? options.last : this.last({ nationality: "it" }),
		birthday = !!options.birthday ? options.birthday : this.birthday(),
		city = !!options.city
			? options.city
			: this.pickone([
					"A",
					"B",
					"C",
					"D",
					"E",
					"F",
					"G",
					"H",
					"I",
					"L",
					"M",
					"Z",
			  ]) + this.pad(this.natural({ max: 999 }), 3),
		cf: string[] = [],
		name_generator = function (name: string, isLast: boolean) {
			var temp: string,
				return_value: string[] = [];

			if (name.length < 3) {
				return_value = name.split("").concat("XXX".split("")).splice(0, 3);
			} else {
				temp = name
					.toUpperCase()
					.split("")
					.map(function (c) {
						return "BCDFGHJKLMNPRSTVWZ".indexOf(c) !== -1 ? c : undefined;
					})
					.join("");
				if (temp.length > 3) {
					if (isLast) {
						temp = temp.substr(0, 3);
					} else {
						temp = temp[0] + temp.substr(2, 2);
					}
				}
				if (temp.length < 3) {
					return_value = temp.split("");
					temp = name
						.toUpperCase()
						.split("")
						.map(function (c) {
							return "AEIOU".indexOf(c) !== -1 ? c : undefined;
						})
						.join("")
						.substr(0, 3 - return_value.length);
				}
				return_value = return_value.concat(temp.split(""));
			}

			return return_value.join("");
		},
		date_generator = function (birthday: Date, gender: string, that: RandBox) {
			var lettermonths = [
				"A",
				"B",
				"C",
				"D",
				"E",
				"H",
				"L",
				"M",
				"P",
				"R",
				"S",
				"T",
			];

			return (
				birthday.getFullYear().toString().substr(2) +
				lettermonths[birthday.getMonth()] +
				that.pad(
					birthday.getDate() + (gender.toLowerCase() === "female" ? 40 : 0),
					2
				)
			);
		},
		checkdigit_generator = function (cf: string) {
			var range1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
				range2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ",
				evens = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
				odds = "BAKPLCQDREVOSFTGUHMINJWZYX",
				digit = 0;

			for (var i = 0; i < 15; i++) {
				if (i % 2 !== 0) {
					digit += evens.indexOf(range2[range1.indexOf(cf[i])]);
				} else {
					digit += odds.indexOf(range2[range1.indexOf(cf[i])]);
				}
			}
			return evens[digit % 26];
		};

	cf = cf.concat(
		name_generator(last, true),
		name_generator(first, false),
		date_generator(birthday, gender, this),
		city.toUpperCase().split("")
	);
	var cfString = cf.join("");
	cfString += checkdigit_generator(cfString.toUpperCase());

	return cfString.toUpperCase();
}

// Polish PESEL (Personal Identity Number) generator
export function pl_pesel(this: RandBox) {
	var number = this.natural({ min: 1, max: 9999999999 });
	var arr = this.pad(number, 10).split("");
	for (var i = 0; i < arr.length; i++) {
		arr[i] = parseInt(arr[i]);
	}

	var controlNumber =
		(1 * arr[0] +
			3 * arr[1] +
			7 * arr[2] +
			9 * arr[3] +
			1 * arr[4] +
			3 * arr[5] +
			7 * arr[6] +
			9 * arr[7] +
			1 * arr[8] +
			3 * arr[9]) %
		10;
	if (controlNumber !== 0) {
		controlNumber = 10 - controlNumber;
	}

	return arr.join("") + controlNumber;
}

// Polish NIP (Tax Identification Number) generator
export function pl_nip(this: RandBox) {
	var number = this.natural({ min: 1, max: 999999999 });
	var arr = this.pad(number, 9).split("");
	for (var i = 0; i < arr.length; i++) {
		arr[i] = parseInt(arr[i]);
	}

	var controlNumber =
		(6 * arr[0] +
			5 * arr[1] +
			7 * arr[2] +
			2 * arr[3] +
			3 * arr[4] +
			4 * arr[5] +
			5 * arr[6] +
			6 * arr[7] +
			7 * arr[8]) %
		11;
	if (controlNumber === 10) {
		return this.pl_nip();
	}

	return arr.join("") + controlNumber;
}

// Polish REGON (Business Registry Number) generator
export function pl_regon(this: RandBox) {
	var number = this.natural({ min: 1, max: 99999999 });
	var arr = this.pad(number, 8).split("");
	for (var i = 0; i < arr.length; i++) {
		arr[i] = parseInt(arr[i]);
	}

	var controlNumber =
		(8 * arr[0] +
			9 * arr[1] +
			2 * arr[2] +
			3 * arr[3] +
			4 * arr[4] +
			5 * arr[5] +
			6 * arr[6] +
			7 * arr[7]) %
		11;
	if (controlNumber === 10) {
		controlNumber = 0;
	}

	return arr.join("") + controlNumber;
}

// VAT number generator (European format)
export function vat(this: RandBox, options?: any) {
	options = initOptions(options, { country: "it" });
	switch (options.country.toLowerCase()) {
		case "it":
			return this.it_vat();
	}
}

// Export collection for easy prototype extension
export const regional = {
	it_vat,
	cf,
	pl_pesel,
	pl_nip,
	pl_regon,
	vat,
};
