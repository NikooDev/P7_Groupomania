import { FormState, UseFormClearErrors, UseFormSetFocus } from 'react-hook-form'
import { ILogin, ISignup } from '@Type/auth'
import { useCallback } from 'react'

/**
 * Remise à zéro des erreurs des formulaires d'authentification
 * @param clearErrors
 */
const useClearErrors = (clearErrors: UseFormClearErrors<ISignup> | UseFormClearErrors<ILogin>) => {
	const handleBlur = useCallback(() => {
		window.addEventListener('click', () => clearErrors())

		return () => {
			window.removeEventListener('click', () => clearErrors())
		}
	}, [clearErrors])

	const handleErrorFocus = useCallback((formState: FormState<ISignup> & FormState<ILogin>, setFocus: UseFormSetFocus<ISignup & ILogin>) => {
		const firstError = (
			Object.keys(formState.errors) as Array<keyof typeof formState.errors>
		).reduce<keyof typeof formState.errors | null>((field, a) => {
			const fieldKey = field as keyof typeof formState.errors
			return !!formState.errors[fieldKey] ? fieldKey : a
		}, null)

		if(firstError) setFocus(firstError)
	}, [])

	return {
		handleBlur, handleErrorFocus
	}
}

export default useClearErrors