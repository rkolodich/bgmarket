import { SimpleSpoiler } from "./components.js"
import { 
	getSelectedOption,
	getEl,
	formDataToSearchParams,
	getUrl,
} from "./utils.js"

document.addEventListener('DOMContentLoaded', init)

function init() {
	const currencyEl = document.querySelector('#currency-select')
	currencyEl.addEventListener('change', () => {
		if (!Cookies) {
			return
		}

		const { value } = getSelectedOption(currencyEl)
		Cookies.set('currency', value)
		location.reload()
	})

	initSpoilers()
	initSearch()
}

function initSpoilers() {
	new SimpleSpoiler({
		container: '#dd-categories',
		target: '#dd-categories-btn',
		soft: true,
	})

	new SimpleSpoiler({
		container: '#dd-mechanics',
		target: '#dd-mechanics-btn',
		soft: true,
	})

	new SimpleSpoiler({
		container: '#game-price-cards',
		target: '#game-price-cards-btn',
		soft: true,
	})

	new SimpleSpoiler({
		container: '#game-price-cards-by-words',
		target: '#game-price-cards-by-words-btn',
		soft: true,
	})
}

function initSearch() {
	let btnEl

	btnEl = getEl('#search-with-filters')
	if (btnEl) {
		btnEl.addEventListener('click', (e) => {
			e.preventDefault()
			const searchParams = formDataToSearchParams('#form-filters')
			const { origin, pathname, } = getUrl()
			const url = origin + pathname + '?' + searchParams;
			history.pushState({}, '', url);
			window.location.replace(url);
		})
	}
}