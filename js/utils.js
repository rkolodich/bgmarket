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
