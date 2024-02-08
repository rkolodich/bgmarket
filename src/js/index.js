import { getSelectedOption } from "./utils.js"

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
}