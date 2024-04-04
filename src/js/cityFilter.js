import { fetchLocations, groupBy } from './api.js'
import { highlightChoseInList } from './vendor.js'
import { debounce, debugAfter, getSelectedOption } from './utils.js';

const el = document.getElementById('city-select')
const choiceSelect = new Choices(el, {
	itemSelectText: '',
	classNames: {
		containerOuter: 'choices choices--no-right-padding z-2 choices--bs-sm choices--bs-theme--default choices--truncate',
	},
	searchChoices: false,
	removeItemButton: true,
	searchResultLimit: 999999, // searchResultLimit: -1 не позволит искать нужные элементы, после их загрузки
})
choiceSelect.setChoices([], 'value', 'label', true) // очищает поиск от выбранного <option> через HTML

const searchEl = choiceSelect.input.element
const handleSearchDebounced = debounce(handleSearch, 300)
searchEl.addEventListener('input', (e) => {
	const searchText = e.target.value
	if (searchText === '') {
		choiceSelect.clearChoices()
		return
	}

	handleSearchDebounced(e)
})
el.addEventListener('addItem', setTitleAttrForChosenItem, false,)

el.addEventListener('choice', (e) => {
	const properties = e?.detail?.choice?.customProperties;
	if (!properties) {
		return
	}

	const { id, type } = parseParam(properties.param)
	setInputLocationValue(type, id)
})

async function handleSearch(e) {
	const searchText = e.target.value
	let data = await fetchLocations({ searchText })
	data = prepareFetchLocationResult(data)
	choiceSelect.setChoices(data, 'value', 'label', true)
	e.target.parentNode.querySelector('input').focus();
	highlightChoseInList(choiceSelect, el)
}

function prepareFetchLocationResult(items = []) {
	if (items.length === 0) {
		return []
	}

	items = groupBy(items, 'country_name')

	const res = Object.entries(items).map(([county, els]) => {
		const choices = els.map(el => ({
			customProperties: el,
			value: el.param,
			label: makeChoiceLabel(el),
		}))

		return {
			label: county,
			id: county,
			disabled: false,
			choices
		}
	})

	return res
}

function setTitleAttrForChosenItem(event) {
	const { id, label, value } = event.detail
	const selector = `.choices__item[data-value="${value}"][data-id="${id}"]`
	const el = document.querySelector(selector)
	if (!el) {
		return console.error(`el with '${selector}' does not exist`);
	}
	el.setAttribute('title', label)
}

function makeChoiceLabel(el) {
	const { country_name, region_name, city_name } = el
	if (country_name && region_name && city_name) {
		if (country_name === region_name) {
			return city_name
		}
		else {
			return `${city_name}, ${region_name}`
		}
	}
	else if (country_name && region_name && !city_name) {
		return region_name
	}
	return country_name
}

/**
 * 
 * @param {string} param 
 * @returns {{ id: number, type: 'country'|'region'|'city' }}
 */
function parseParam(param) {
	const [type, id] = param.split('_')
	return { type, id: +id }
}

/**
 * 
 * @param {'country'|'region'|'city'} type 
 * @param {number} value 
 */
function setInputLocationValue(type, value) {
	const countryInputEl = document.getElementById('country-input')
	const regionInputEl = document.getElementById('region-input')
	const cityInputEl = document.getElementById('city-input')

	countryInputEl.value = ''
	regionInputEl.value = ''
	cityInputEl.value = ''

	switch (type) {
		case 'country':
			countryInputEl.value = value
			break;
		case 'region':
			regionInputEl.value = value
			break;
		case 'city':
			cityInputEl.value = value
			break;
	}
}