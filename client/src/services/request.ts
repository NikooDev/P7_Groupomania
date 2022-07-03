import { App } from '@Config'
import IRequest from '@Type/request'
import { Notif } from '@Core/notifs'

/**
 * Requête fetch
 * @param method
 * @param url
 * @param data
 * @param token
 * @param header
 * @constructor
 */
const Request = async ({ method, url, data, token, header }: IRequest): Promise<any> => {
	let headers: HeadersInit = {
		'Accept': 'application/json',
		'Access-Control-Allow-Origin': App.api
	}

	if(token) {
		headers = {
			...headers, 'Authorization': 'Bearer '+token
		}
	}

	if(header) {
		headers = {
			...headers, ...header
		}
	}

	let fetchInit: RequestInit = {
		method: method,
		mode: 'cors',
		headers: headers
	}

	if(data) {
		fetchInit = {
			...fetchInit,
			body: data
		}
	}

	try {
		const res = await fetch(App.api+url, fetchInit)

		return await res.json()
	} catch (e) {
		if(e.message === 'Failed to fetch') {
			Notif({ id: 'ErrorServer', type: 'error', message: 'Le serveur est actuellement indisponible', duration: 5000 })
		}

		if(App.mode === 'development') {
			console.log(e)
		}
	}
}

export default Request