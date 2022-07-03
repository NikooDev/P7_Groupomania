import React, { createContext, useContext, useReducer } from 'react'
import { formInitialState, FormReducer } from '@Reducer/form.reducer'
import { IAuthAction, IAuthContext } from '@Type/auth'
import { IChildren } from '@Type/utils'

const AuthFormContext = createContext<IAuthContext>(formInitialState),
	AuthFormDispatch = createContext<React.Dispatch<IAuthAction>>(() => {})

/**
 * Contexte des formulaires d'authentification
 * @param children
 * @constructor
 */
const FormProvider = ({ children }: IChildren) => {
	const [state, dispatch] = useReducer(FormReducer, formInitialState)

	return (
		<AuthFormContext.Provider value={state}>
			<AuthFormDispatch.Provider value={dispatch}>
				{ children }
			</AuthFormDispatch.Provider>
		</AuthFormContext.Provider>
	)
}

export const useAuthForm = () => useContext(AuthFormContext)
export const useAuthFormDispatch = () => useContext(AuthFormDispatch)
export default FormProvider