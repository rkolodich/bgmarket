import { addClass, removeClass } from "./utils.js"

// --- Choices ---

/**
 * 
 * @param {object} choicesInstance 
 * @param {HTMLSelectElement} value 
 */
export function highlightChoseInList(choicesInstance, selectEl) {
    if (!choicesInstance.choiceList) {
        return
    }

    const listEl = choicesInstance.choiceList.element
    removeClass('choices__item--selected', 'choices__item--selected', listEl)

    const optionEls = [...selectEl.children]
    optionEls.forEach(optionEl => {
        const value = optionEl.getAttribute('value')
        addClass(`[data-value="${value}"]`, 'choices__item--selected', listEl)
    })
}