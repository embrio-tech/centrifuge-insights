/**
 * converts DS-Math WAD value string into number
 *
 * More info: https://dappsys.readthedocs.io/en/latest/ds_math.html
 *
 * @prop {string} value - WAD string
 * @returns {number} - numerical value
 */
export const wad = (value: string | null): number => Number(value) * 10 ** -18

/**
 * converts DS-Math RAY value string into number
 *
 * More info: https://dappsys.readthedocs.io/en/latest/ds_math.html
 *
 * @prop {string} value - WAD string
 * @returns {number} - numerical value
 */
export const ray = (value: string | null): number => Number(value) * 10 ** -27

/**
 * converts a number string with a fixed amount of decimals into a number
 *
 * @prop {string} value - number string
 * @prop {number} decimals - amount of decimal digits (default=18)
 * @returns {number} - numerical value
 */
export const decimal = (value: string | null, decimals = 18): number => Number(value) * 10 ** -decimals
