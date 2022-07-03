import * as Yup from 'Yup'
import { FormState } from 'react-hook-form'
import { ILogin, ISignup } from '@Type/auth'
import { Notif } from '@Core/notifs'
import { toast } from 'react-hot-toast'

const strongPassword = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?\W).*$/,
	errorLengthFirstname = 'Votre prénom doit comporter entre 3 et 30 caractères maximum',
	errorLengthName = 'Votre nom doit comporter entre 3 et 30 caractères maximum',
	errorLengthPassword = 'Votre mot de passe doit comporter entre 8 et 180 caractères et au moins :\r\nUne majuscule, une minuscule, un chiffre et un caractère spécial'

/**
 * Schéma des champs du formulaire d'inscription
 */
export const signupSchema = Yup.object().shape({
	firstname: Yup.string().required('Quel est votre prénom ?').min(3, errorLengthFirstname).max(30, errorLengthFirstname).lowercase(),
	name: Yup.string().required('Quel est votre nom ?').min(3, errorLengthName).max(30, errorLengthName).lowercase(),
	reg_email: Yup.string().required('Une adresse e-mail est requise').email('Votre adresse e-mail est incorrecte').lowercase(),
	reg_password: Yup.string().required('Vous devez créer un mot de passe').min(8, errorLengthPassword).max(180, errorLengthPassword).matches(strongPassword, errorLengthPassword),
	password_confirmation: Yup.string().oneOf([Yup.ref('reg_password')], 'Les deux mots de passe ne correspondent pas')
})

/**
 * Schéma des champs du formulaire de connexion
 */
export const loginSchema = Yup.object().shape({
	email: Yup.string().required('Votre adresse e-mail est requise').email('Votre adresse e-mail est incorrecte'),
	password: Yup.string().required('Votre mot de passe est requis')
})

/**
 * Affiche une alerte en cas d'erreur
 * @param formState
 * @param isSignup
 */
export const authValidation = (formState: FormState<ISignup> & FormState<ILogin>, isSignup: boolean) => {
	let errorMsg = { id: '', message: '' }

	if(isSignup) {
		if(formState.errors.firstname) {
			errorMsg = { ...errorMsg, id: 'ErrorFirstname', message: formState.errors.firstname.message as string }
		} else if(formState.errors.name) {
			errorMsg = { ...errorMsg, id: 'ErrorName', message: formState.errors.name.message as string }
		} else if(formState.errors.reg_email) {
			errorMsg = { ...errorMsg, id: 'ErrorsEmail', message: formState.errors.reg_email.message as string }
		} else if(formState.errors.reg_password) {
			errorMsg = { ...errorMsg, id: 'ErrorsPassword', message: formState.errors.reg_password.message as string }
		} else if(formState.errors.password_confirmation) {
			errorMsg = { ...errorMsg, id: 'ErrorPasswordConfirmation', message: formState.errors.password_confirmation.message as string }
		}
	} else {
		if(formState.errors.email) {
			errorMsg = { ...errorMsg, id: 'ErrorEmail', message: formState.errors.email.message as string }
		} else if(formState.errors.password) {
			errorMsg = { ...errorMsg, id: 'ErrorPassword', message: formState.errors.password.message as string }
		}
	}

	if(errorMsg.message) {
		toast.dismiss()
		Notif({ id: errorMsg.id, type: 'error', message: errorMsg.message, duration: 5000 })
	}
}