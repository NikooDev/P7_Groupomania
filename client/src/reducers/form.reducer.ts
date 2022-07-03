import { IAuthAction, IAuthContext } from '@Type/auth'

const formInitialState = {
	displayLogin: true,
	displaySignup: false,
	showEmail: '',
	loading: false
}

/**
 * Reducer des formulaires d'authentification
 * @param formInitialState
 * @param action
 * @constructor
 */
const FormReducer = (formInitialState: IAuthContext, action: IAuthAction) => {
	switch (action.type) {
		case 'DISPLAY_SIGNUP':
			return {
				...formInitialState,
				displayLogin: false,
				displaySignup: true,
			}
		case 'DISPLAY_LOGIN':
			return {
				...formInitialState,
				displayLogin: true,
				displaySignup: false,
			}
		case 'SET_EMAIL':
			return {
				...formInitialState,
				showEmail: action.payload!
			}
		case 'SHOW_LOADING':
			return {
				...formInitialState,
				loading: true
			}
		case 'HIDE_LOADING':
			return {
				...formInitialState,
				loading: false
			}
		default:
			throw new Error('Type d\'action non défini')
	}
}

export {
	formInitialState, FormReducer
}