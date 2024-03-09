import { addClass, getEl, getEls, removeClass, setExpanded } from "./utils.js"

const simpleSpoilerClasses = {
	hidden: 'simple-spoiler__hidden',
}

const simpleSpoilerAttrs = {
	spoilerText: 'data-spoiler-text',
}

export class SimpleSpoiler {
	expanded = false

	/**
	 * @param {Object} options
	 * @param {HTMLElement|String} options.container
	 * @param {HTMLElement} options.target
	 * @param {String} options.targetActiveClass
	 * @param {Boolean} options.soft
	 */
	constructor(options = {}) {
		this.container = getEl(options.container)

		if (!this.container) {
			if (!options.soft) {
				throw Error(`SimpleSpoiler dint find container with '${options.container}' selector`)
			}
			return
		}

		this.elActiveClass = options.elActiveClass
		this.target = getEl(options.target)
		this.targetActiveClass = options.targetActiveClass
		/**
		 * @type {ReturnType<typeof getEls>}
		 * @public
		 */
		this.items = getEls(`.${simpleSpoilerClasses.hidden}`, this.container)

		this.hide()
		this._registerEvents()
	}

	expand() {
		setExpanded(this.container, true)
		removeClass(this.items, simpleSpoilerClasses.hidden)
		this.expanded = true
	}

	hide() {
		setExpanded(this.container, false)
		addClass(this.items, simpleSpoilerClasses.hidden)
		this.expanded = false
	}

	toggle() {
		if (this.expanded) {
			this.hide()
		}
		else {
			this.expand()
		}
	}

	_registerEvents() {
		this.target.addEventListener('click', this._onClickTarget.bind(this))
	}

	/**
	 * @param {Event} event 
	 */
	_onClickTarget(event) {
		event.preventDefault();
		const el = event.target.hasAttribute(simpleSpoilerAttrs.spoilerText)
			? event.target
			: getEl(`[${simpleSpoilerAttrs.spoilerText}]`, event.target)
		const text = el.innerText
		const spoilerText = el.getAttribute(simpleSpoilerAttrs.spoilerText)
		el.setAttribute(simpleSpoilerAttrs.spoilerText, text)
		el.innerText = spoilerText
		this.toggle()
	}
}