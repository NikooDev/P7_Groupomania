import React, { useEffect } from 'react'
import { signupSchema, authValidation } from '@Validator/auth.validator'
import { ISignup } from '@Type/auth'
import g from '@Asset/theme/global.module.scss'
import d from '@Asset/theme/default.module.scss'
import cl from './form.module.scss'
import { UserIcon, EmailIcon, PasswordIcon, PasswordConfirmIcon } from '@Core/icons/auth'
import { AuthAction } from '@Action/auth.action'
import { useAuthForm, useAuthFormDispatch } from '@Context/form.context'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Notif } from '@Core/notifs'
import useClearErrors from '@Hook/useClearErrors'
import Class from 'classnames'
import Loader from '@Core/loader'

/**
 * Formulaire d'inscription
 * @constructor
 */
const Signup = () => {
	const formOptions = { resolver: yupResolver(signupSchema) },
		{ register, setFocus, handleSubmit, clearErrors, setError, getValues, reset, formState } = useForm<ISignup>({ ...formOptions, reValidateMode: 'onSubmit' }),
		{ handleBlur, handleErrorFocus } = useClearErrors(clearErrors),
		{ displaySignup } = useAuthForm(),
		dispatch = useAuthFormDispatch()

	useEffect(() => {
		displaySignup && setFocus('firstname')
	}, [displaySignup, setFocus])

	useEffect(() => {
		displaySignup && handleErrorFocus(formState, setFocus)
	}, [displaySignup, setFocus, formState, handleErrorFocus])

	useEffect(() => handleBlur(), [handleBlur])

	useEffect(() => authValidation(formState, true), [formState])

	const handleOnSubmit: SubmitHandler<ISignup> = async (user) => {
		const res = await AuthAction(user, 'signup')

		dispatch({ type: 'SHOW_LOADING' })

		if(res && res.ok) {
			Notif({ id: 'signupSuccess', type: 'success', message: 'Votre inscription à bien été enregistrée !', duration: 6000 })
			dispatch({ type: 'SET_EMAIL', payload: getValues('reg_email') })
			dispatch({ type: 'DISPLAY_LOGIN' })
			dispatch({ type: 'HIDE_LOADING' })
			reset()
		} else {
			if(!res) return
			res.error.hasOwnProperty('field') && setError(res.error.field, { type: 'validate' })
			setFocus(res.error.field)
			dispatch({ type: 'HIDE_LOADING' })
		}
	}

	const handleDisplayLogin = (event: React.MouseEvent) => {
		event.preventDefault()
		dispatch({ type: 'DISPLAY_LOGIN' })
	}

	return (
		<form method="post"
		      className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.fdColumn, g.h100p, g.taCenter, d.bgWhite, cl.form)}
		      onSubmit={handleSubmit(handleOnSubmit)}>
			<h2 className={g.mb15}>Inscrivez-vous</h2>
			<div className={Class(g.dFlex, g.aiCenter, g.pRelative, g.w100p, g.mb10)}>
				<span className={Class(g.dFlex, g.pAbsolute, cl.form__icon)}>
					<UserIcon height={25} width={25} />
				</span>
				<div className={Class(g.dFlex, g.jcSpaceBetween, g.w100p, cl.form__group)}>
					<input type="text" {...register('firstname')} placeholder="Prénom" disabled={formState.isSubmitting}
					       className={Class(g.w100p, g.brtl30, g.brtr15, g.brbl30, g.brbr15, g.pl30, g.pr15, g.fwe500, cl.form__input, formState.errors.firstname ? cl.error : null)} />
					<input type="text" {...register('name')} placeholder="Nom" disabled={formState.isSubmitting}
					       className={Class(g.w100p, g.brtl15, g.brtr30, g.brbl15, g.brbr30, g.pl10, g.pr15, g.fwe500, cl.form__input, !formState.errors.firstname && formState.errors.name ? cl.error : null)} />
				</div>
			</div>
			<div className={Class(g.dFlex, g.aiCenter, g.pRelative, g.w100p, g.mb10)}>
				<span className={Class(g.dFlex, g.pAbsolute, cl.form__icon)}>
					<EmailIcon height={25} width={25} />
				</span>
				<input type="text" {...register('reg_email')} placeholder="Adresse e-mail" autoComplete="off" disabled={formState.isSubmitting}
				       className={Class(g.w100p, g.brtl30, g.brtr30, g.brbl30, g.brbr30, g.pl30, g.pr15, g.fwe500, cl.form__input, !formState.errors.name && formState.errors.reg_email ? cl.error : null)} />
			</div>
			<div className={Class(g.dFlex, g.aiCenter, g.pRelative, g.w100p, g.mb10)}>
				<span className={Class(g.dFlex, g.pAbsolute, cl.form__icon)}>
					<PasswordIcon height={25} width={25} />
				</span>
				<input type="password" {...register('reg_password')} placeholder="Mot de passe" autoComplete="new-password" disabled={formState.isSubmitting}
				       className={Class(g.w100p, g.brtl30, g.brtr30, g.brbl30, g.brbr30, g.pl30, g.pr15, g.fwe500, cl.form__input, !formState.errors.reg_email && formState.errors.reg_password ? cl.error : null)} />
			</div>
			<div className={Class(g.dFlex, g.aiCenter, g.pRelative, g.w100p, g.mb10)}>
				<span className={Class(g.dFlex, g.pAbsolute, cl.form__icon)}>
					<PasswordConfirmIcon height={25} width={25} />
				</span>
				<input type="password" {...register('password_confirmation')} placeholder="Confirmer votre mot de passe" disabled={formState.isSubmitting}
				       className={Class(g.w100p, g.brtl30, g.brtr30, g.brbl30, g.brbr30, g.pl30, g.pr15, g.fwe500, cl.form__input, !formState.errors.reg_password && formState.errors.password_confirmation ? cl.error : null)} />
			</div>
			<button type="submit" disabled={formState.isSubmitting} className={Class(g.pRelative, g.brtl30, g.brtr30, g.brbl30, g.brbr30, g.fwe700, g.mt20, g.w70p, cl.form__submit, formState.isSubmitting ? cl.form__submit__loading : null)}>
				{ formState.isSubmitting ? <Loader height={40} width={40} color="#fff" classname={Class(g.pAbsolute, g.t0, g.l0, g.r0, g.b0, g.mAuto)} /> : <span className={cl.form__submit__text}>S'INSCRIRE</span> }
			</button>
			<div className={Class(g.mt10, cl.form__link__mobile)}>
				<a href="/" onClick={(event) => handleDisplayLogin(event)}>Déjà inscrit ?</a>
			</div>
		</form>
	)
}

export default Signup