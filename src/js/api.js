const API_URL = 'http://31.41.44.86'

/**
 * @typedef {object} FetchLocationsOptions 
 * @property {string} searchText=''
 */

/**
 * @typedef {object} FetchLocationsResult
 * @property {string} param
 * @property {string} city_name
 * @property {string} region_name
 * @property {string} country_name
 * @property {string} idw
 */

/**
 * @param {FetchLocationsOptions} options
 * @returns {Promise<FetchLocationsResult[]>}
 */
export async function fetchLocations(options = {}) {
    const { searchText = 'null' } = options
    const searchParams = new URLSearchParams()
    searchParams.set('searchText', searchText)
    const res = await fetch(`${API_URL}/users/search?${searchParams.toString()}`)
    const json = await res.json()
    return json.data
}

/**
 * 
 * @param {Array} arr 
 * @param {string|number|Function} f 
 * @returns 
 */
export function groupBy(arr, f) {
    return arr.reduce((out, val) => {
        let by = typeof f === 'function' ? '' + f(val) : val[f];
        (out[by] = out[by] || []).push(val);
        return out;
    }, {});
};