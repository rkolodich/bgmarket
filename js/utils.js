/**
 * 
 * @param {string} currency 
 * @throws
 */
export function setCurrencyToCookie(currency) {
	if(Cookies) {
		Cookies.set('currency', $(this).val());
	}
	else {
		throw new Error('Возникла неизвестная ошибка')
	}
}

/**
 * 
 * @param {HTMLSelectElement} el 
 * @returns {{ text: string, value: string }}
 */
export function getSelectedOption(el) {
	return {
		text: el.options[el.selectedIndex].text,
		value: el.value
	}
}

/**
 * 
 * @param {Function} callback 
 * @param {number} timeout 
 * @returns 
 */
export function debounce(callback, timeout) {
	let timeoutId = null;
	return function() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			callback.apply(this, arguments);
		}, timeout);
	};
}

/**
 * 
 * @param {object} value 
 * @returns {URLSearchParams}
 */
export function objectToUrlSearchParams(value) {
	const searchParams = new URLSearchParams()

	if (!value || typeof value !== 'object' || value === null) {
		return value
	}
	
	for (const key in value) {
		if (!Object.hasOwnProperty.call(value, key)) {
			continue
		}

		searchParams.set(key, value)
	}

	return searchParams
}

export function debugAfter(delay) {
	setTimeout(() => {
		debugger
	}, delay)
}