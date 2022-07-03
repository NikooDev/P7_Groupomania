import { DateTime } from 'luxon'

/**
 * Retourne la chaine de caractère avec sa première lettre en majuscule
 * @param value
 * @return string
 */
export const capitalize = (value: string): string => {
	const lower = value && value.toLowerCase()
	return value && value.charAt(0).toUpperCase() + lower.slice(1)
}

/**
 * Vérifie si une chaîne de caractère est vide
 * @param value
 * @return boolean
 */
export const isEmpty = (value: string | undefined): boolean => {
	value = value && value.trim()
	return (value === null || value === '' || typeof value === 'undefined')
}

export const relativeDate = (date: string): string | null => {
	let now = DateTime.fromISO(date).toRelative()
	if(now === 'il y a 0 seconde') now = 'À l\'instant'
	else if(now) now = now.replace('il y a', '')

	return now
}