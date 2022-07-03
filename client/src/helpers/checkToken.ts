import { GetServerSidePropsContext } from 'next/types'
import { getCookie } from '@Helper/cookie'

/**
 * Client =>
 * Vérifie si le token existe
 */
export const checkClientToken = (): string | undefined => {
	if(typeof window === 'undefined') return
	return getCookie('user') as string | undefined
}

/**
 * Serveur =>
 * Vérifie si le token existe
 */
export const checkServerToken = (context: GetServerSidePropsContext) => {
	const cookies = context.req.headers.cookie && context.req.headers.cookie as string
	let cookie = cookies && Object.fromEntries(cookies.split('; ')
		.map(v => v.split(/=(.*)/s)
		.map(decodeURIComponent)))

	return {
		token: cookie ? cookie.user : undefined
	}
}

export const checkBreakPoint = (context: GetServerSidePropsContext) => {
	const cookies = context.req.headers.cookie && context.req.headers.cookie as string
	let cookie = cookies && Object.fromEntries(cookies.split('; ')
		.map(v => v.split(/=(.*)/s)
			.map(decodeURIComponent)))

	return {
		breakpoint: cookie ? cookie.breakpointCols : undefined
	}
}