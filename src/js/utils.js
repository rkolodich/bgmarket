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

/**
 * @template T
 * @param {T|NodeList} value
 * @returns {T[]}
 */
export function castToArray(value) {
	if (value instanceof NodeList) {
		return [...value];
	}
	return Array.isArray(value) ? value : [value]
}

/**
 * @param {string|HTMLElement} elOrSelector
 * @param {HTMLElement} target
 * @returns {HTMLElement}
 */
export function getEl(elOrSelector, target = document) {
	if (typeof elOrSelector === 'string') {
		return target.querySelector(elOrSelector);
	}
	return elOrSelector;
}

/**
 * @param {string|HTMLElement[]|NodeList} elsOrSelector
 * @param {HTMLElement} target
 * @returns {HTMLElement[]}
 */
export function getEls(elsOrSelector, target = document) {
	if (typeof elsOrSelector === 'string') {
		return [...target.querySelectorAll(elsOrSelector)];
	}
	return castToArray(elsOrSelector);
}

/**
 * @param {string|HTMLElement} elOrSelector
 * @param {boolean} bool
 */
export function setExpanded(elOrSelector, bool) {
	getEl(elOrSelector).setAttribute('aria-expanded', bool ? 'true' : 'false')
}

/**
 * @param {string|HTMLElement|HTMLElement[]|NodeList} elsOrSelector 
 * @param {string|string[]} _class 
 * @param {HTMLElement} target 
 */
export function addClass(elsOrSelector, _class, target = document) {
	const _els = getEls(elsOrSelector, target);
	_els.forEach(el => {
		el.classList.add(...castToArray(_class));
	});
}

/**
 * @param {string|HTMLElement|HTMLElement[]|NodeList} elsOrSelector 
 * @param {string|string[]} _class 
 * @param {HTMLElement} target 
 */
export function removeClass(elsOrSelector, _class, target = document) {
	const _els = getEls(elsOrSelector, target);
	_els.forEach(el => {
		el.classList.remove(...castToArray(_class));
	});
}