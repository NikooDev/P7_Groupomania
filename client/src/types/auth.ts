/**
 * Interfaces des données d'authentification
 */

export interface ISignup {
	firstname: string
	name: string
	reg_email: string
	reg_password: string
	password_confirmation: string
}

export interface ILogin {
	email: string
	password: string
}

export interface IAuthContext {
	displayLogin: boolean
	displaySignup: boolean
	showEmail: string
	loading: boolean
}

export interface IAuthAction {
	type: 'DISPLAY_SIGNUP' | 'DISPLAY_LOGIN' | 'SET_EMAIL' | 'SHOW_LOADING' | 'HIDE_LOADING'
	payload?: string
}