/**
 * Mobile module for RandBox.js
 * Contains mobile device and platform related functions
 */

import { RandBox, base64 } from "./core.js";

export function android_id(this: RandBox): string {
	return (
		"APA91" +
		this.string({
			pool: "0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_",
			length: 178,
		})
	);
}

export function apple_token(this: RandBox): string {
	return this.string({ pool: "abcdef1234567890", length: 64 });
}

export function bb_pin(this: RandBox): string {
	return this.hash({ length: 8 });
}

export function wp7_anid(this: RandBox): string {
	return (
		"A=" +
		this.guid().replace(/-/g, "").toUpperCase() +
		"&E=" +
		this.hash({ length: 3 }) +
		"&W=" +
		this.integer({ min: 0, max: 9 })
	);
}

export function wp8_anid2(this: RandBox): string {
	let base64: (input: string) => string = function(input: string) {
        throw new Error('No Base64 encoder available.');
    };
	if (typeof btoa === 'function') {
        base64 = btoa;
    } else if (typeof Buffer === 'function') {
        base64 = function(input: string) {
            return Buffer.from(input).toString('base64');
        };
    }
	return base64(this.hash({ length: 32 }));
}

// Export collection for easy prototype extension
export const mobile = {
	android_id,
	apple_token,
	bb_pin,
	wp7_anid,
	wp8_anid2,
};
