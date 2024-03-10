/**
 * 
 * @param {Function} callback 
 * @param {object} options
 * @param {boolean} [options.registerImmediately=false]
 * @param {HTMLElement} [options.target=document]
 * @returns 
 */
export function useOnScroll(callback = () => {}, options = {}) {
	let prevX = window.scrollX
	let prevY = window.scrollY
	let prevDirections = undefined

	const {
		target = document,
		registerImmediately = false
	} = options

	const onScroll = function(event) {
		const x = window.scrollX
		const y = window.scrollY

		const dx = x - prevX
		const dy = y - prevY

		const directions = {
			toLeft:   dx > 0,
			toRight:  dx < 0,
			toTop:    dy < 0,
			toBottom: dy > 0,
		}
		
		const payload = {
			event,
			x,
			y,
			directionXChanged: !prevDirections || directions.toRight === prevDirections.toLeft || prevDirections.toLeft === directions.toRight,
			directionYChanged: !prevDirections || directions.toTop === prevDirections.toBottom || prevDirections.toBottom === directions.toTop,
			...directions,
		}

		callback(payload)

		prevX = x
		prevY = y
		prevDirections = directions
	}

	function register() {
		target.addEventListener('scroll', onScroll)
	}

	function unregister() {
		target.removeEventListener('scroll', onScroll)
	}

	if (registerImmediately) {
		register()
	}

	return { register, unregister }
}