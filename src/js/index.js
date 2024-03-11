import { SimpleSpoiler } from "./components.js"
import { useOnScroll } from "./hooks.js"
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
	// initHeader()
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

function initHeader() {
	const headerEl = document.getElementById('header')
	let isSticky = false
	let isStickyActive = false

	useOnScroll(({ toBottom, toTop, x, y }) => {
		if (y < headerEl.offsetHeight) {
			setSticky(false)
			setStickyActive(false)
			return
		}
		
		if (toBottom) {
			setSticky(true)
			setStickyActive(false)
		}
		else if (toTop) {
			setStickyActive(true)
		}
	}, { registerImmediately: true })

	const _classes = {
		sticky: 'header--sticky',
		stickyActive: 'header--sticky--active',
	}

	function setSticky(value) {
		if (value === isSticky) {
			return
		}

		if (value) headerEl.classList.add(_classes.sticky)
		else headerEl.classList.remove(_classes.sticky)
		isSticky = value
	}

	function setStickyActive(value) {
		if (isStickyActive === value) {
			return
		}

		if (value) headerEl.classList.add(_classes.stickyActive)
		else headerEl.classList.remove(_classes.stickyActive)

		isStickyActive = value
	}
}