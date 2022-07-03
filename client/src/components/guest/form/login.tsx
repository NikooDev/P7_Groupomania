import React, { useEffect } from 'react'
import { loginSchema, authValidation } from '@Validator/auth.validator'
import { ILogin } from '@Type/auth'
import g from '@Asset/theme/global.module.scss'
import d from '@Asset/theme/default.module.scss'
import cl from './form.module.scss'
import { EmailIcon, PasswordIcon } from '@Core/icons/auth'
import { AuthAction } from '@Action/auth.action'
import { useAuthForm, useAuthFormDispatch } from '@Context/form.context'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, SubmitHandler } from 'react-hook-form'
import { isEmpty } from '@Helper/utils'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import useClearErrors from '@Hook/useClearErrors'
import Class from 'classnames'
import Loader from '@Core/loader'

/**
 * Formulaire de connexion
 * @constructor
 */
const Login = () => {
	const formOptions = { resolver: yupResolver(loginSchema) },
		{ register, handleSubmit, resetField, setError, setFocus, getValues, clearErrors, formState } = useForm<ILogin>({ ...formOptions, reValidateMode: 'onSubmit' }),
		{ displayLogin, showEmail } = useAuthForm(),
		{ handleBlur, handleErrorFocus } = useClearErrors(clearErrors),
		dispatch = useAuthFormDispatch(),
		router = useRouter()

	useEffect(() => {
		if(displayLogin){
			setFocus('email')
			if(!isEmpty(getValues('email')) || !isEmpty(showEmail)) setFocus('password')
		}
	}, [displayLogin, showEmail, setFocus])

	useEffect(() => {
		displayLogin && handleErrorFocus(formState, setFocus)
	}, [displayLogin, setFocus, formState, handleErrorFocus])

	useEffect(() => handleBlur(), [handleBlur])

	useEffect(() => authValidation(formState, false), [formState])

	const handleOnSubmit: SubmitHandler<ILogin> = async (user) => {
		const res = await AuthAction(user, 'login'),
			route = router.query,
			next = isEmpty(route.next as string)

		dispatch({ type: 'SHOW_LOADING' })

		if(res && res.ok) {
			toast.remove()
			await router.replace(!next ? decodeURIComponent(route.next as string) : '/home')
		} else {
			if(!res) return
			dispatch({ type: 'HIDE_LOADING' })
			resetField('password')
			res.hasOwnProperty('field') && setError(res.field, { type: 'validate' })
		}
	}

	const handleDisplaySignup = (event: React.MouseEvent) => {
		event.preventDefault()
		dispatch({ type: 'DISPLAY_SIGNUP' })
	}

	return (
		<form method="post"
		      className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.fdColumn, g.h100p, g.taCenter, d.bgWhite, cl.form)}
		      onSubmit={handleSubmit(handleOnSubmit)}>
			<h2 className={g.mb30}>Connectez-vous</h2>
			<div className={Class(g.dFlex, g.fdColumn, g.aiCenter, g.jcCenter, g.pRelative, g.w100p, g.mb10)}>
				<span className={Class(g.dFlex, g.pAbsolute, g.zi50, cl.form__icon)}>
					<EmailIcon height={25} width={25} />
				</span>
				<input type="text" {...register('email')} defaultValue={!isEmpty(showEmail) ? showEmail : undefined} placeholder="Adresse e-mail" disabled={formState.isSubmitting}
				       className={Class(g.pRelative, g.zi40, g.w100p, g.brtl30, g.brtr30, g.brbl30, g.brbr30, g.pl30, g.pr15, g.fwe500, cl.form__input, formState.errors.email ? cl.error : null)} />
			</div>
			<div className={Class(g.dFlex, g.fdColumn, g.aiCenter, g.jcCenter, g.pRelative, g.w100p, g.mb10)}>
				<span className={Class(g.dFlex, g.pAbsolute, g.zi50, cl.form__icon)}>
					<PasswordIcon height={25} width={25} />
				</span>
				<input type="password" {...register('password')} placeholder="Mot de passe" disabled={formState.isSubmitting}
				       className={Class(g.pRelative, g.zi40, g.w100p, g.brtl30, g.brtr30, g.brbl30, g.brbr30, g.pl30, g.pr15, g.fwe500, cl.form__input, !formState.errors.email && formState.errors.password ? cl.error : null)} />
			</div>
			<button type="submit" disabled={formState.isSubmitting} className={Class(g.pRelative, g.brtl30, g.brtr30, g.brbl30, g.brbr30, g.fwe700, g.mt20, g.mb5, g.w70p, cl.form__submit, formState.isSubmitting ? cl.form__submit__loading : null)}>
				{ formState.isSubmitting ? <Loader height={40} width={40} color="#fff" classname={Class(g.pAbsolute, g.t0, g.l0, g.r0, g.b0, g.mAuto)} /> : <span className={cl.form__submit__text}>GET STARTED !</span> }
			</button>
			<a href="/" className={Class(g.mt5, cl.form__link)}>Mot de passe oublié</a>
			<div className={Class(g.mt10, cl.form__link__mobile)}>
				<a href="/" onClick={(event) => handleDisplaySignup(event)}>Vous n’avez pas encore de compte ?</a>
			</div>
		</form>
	)
}

export default Login