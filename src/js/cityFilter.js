import { fetchLocations, groupBy } from './api.js'
import { highlightChoseInList } from './vendor.js'
import { debounce, debugAfter, getSelectedOption } from './utils.js';

const selectId = 'town'
const el = document.getElementById('town');
const choiceSelect = new Choices(el, {
	itemSelectText: '',
	classNames: {
		containerOuter: 'choices choices--no-right-padding z-2 choices--bs-sm choices--bs-theme--default choices--truncate',
	},
	searchChoices: false,
	removeItemButton: true,
	searchResultLimit: 999999, // searchResultLimit: -1 не позволит искать нужные элементы, после их загрузки
})

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
			...el,
			value: el.idw,
			label: `${el.city_name}, ${el.region_name}`,
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