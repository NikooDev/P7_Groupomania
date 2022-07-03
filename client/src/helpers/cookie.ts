import Cookies from 'js-cookie'

/**
 * Récupère la valeur d'un cookie
 * @param key
 */
export const getCookie = (key: string) => {
	return Cookies.get(key)
}

/**
 * Création d'un cookie
 * @param key
 * @param value
 * @param expires
 * @param sameSite
 */
export const setCookie = (key: string, value: string, expires?: number, sameSite: 'Strict' | 'Lax' | 'None' = 'Lax') => {
	return Cookies.set(key, value, { expires: expires, sameSite: sameSite, secure: false })
	// Secure: false pour Safari sans https en développement
}

/**
 * Suppression d'un cookie
 * @param key
 */
export const removeCookie = (key: string) => {
	return Cookies.remove(key)
}

/**
 * Suppression de tous les cookies
 */
export const removeAllCookie = () => {
	Object.keys(Cookies.get()).forEach(function(key) {
		let neededAttributes = {}
		Cookies.remove(key, neededAttributes)
	})
}
