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
