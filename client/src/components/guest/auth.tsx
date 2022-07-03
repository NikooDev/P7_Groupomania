import React, { useEffect, useRef } from 'react'
import g from '@Asset/theme/global.module.scss'
import d from '@Asset/theme/default.module.scss'
import cl from './auth.module.scss'
import { useAuthForm, useAuthFormDispatch } from '@Context/form.context'
import Class from 'classnames'
import Dynamic from 'next/dynamic'

const Signup = Dynamic(() => import('./form/signup'))
const Login = Dynamic(() => import('./form/login'))

/**
 * Composant d'authentification
 * @constructor
 */
const Auth = () => {
	const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>,
		{ displayLogin, displaySignup, loading } = useAuthForm(),
		dispatch = useAuthFormDispatch()

	useEffect(() => {
		if(displayLogin) containerRef.current.classList.remove(cl.right)
		if(displaySignup) containerRef.current.classList.add(cl.right)
	}, [displayLogin, displaySignup])

	/**
	 * Switch entre le formulaire de connexion et d'inscription
	 * @param to
	 * @param event
	 */
	const handleDirection = (to: 'left' | 'right', event: React.MouseEvent) => {
		event.preventDefault()
		if(!containerRef || loading) return

		switch (to) {
			case 'left':
				containerRef.current.classList.add(cl.right)
				dispatch({ type: 'DISPLAY_SIGNUP' })
				break
			case 'right':
				containerRef.current.classList.remove(cl.right)
				dispatch({ type: 'DISPLAY_LOGIN' })
				break
		}
	}

	return (
		<section className={Class(g.dFlex, g.jcCenter, g.aiCenter, cl.auth)}>
			<div className={Class(g.pRelative, g.mw100, d.bgWhite, cl.auth__container)} ref={containerRef}>
				<div className={Class(g.dFlex, g.pRelative, g.mxAuto, g.br100, g.zi90, d.bgWhite, cl.auth__logo)}>
					<img src="/static/logo/logo.svg" alt="logo" />
				</div>
				<div className={Class(g.pAbsolute, g.t0, g.l50p, g.w50p, g.h100p, g.zi70, g.ovHidden, cl.auth__overlay)}>
					<div className={Class(g.pRelative, g.h100p, cl.auth__overlay__container)}>
						<div className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.fdColumn, g.pAbsolute, g.t0, g.h100p, g.pl10, g.pr10, g.w50p, g.taCenter, cl.auth__overlay__panel, cl.right)}>
							<h1 className={Class(g.mb20, g.fwe500)}><span>Bienvenue sur Groupomania</span></h1>
							<img src="/static/svg/world.svg" height={280} width={280} className={g.mb10} alt="world" />
							<div className={g.mt20}>
								<p className={Class(g.fwe500, g.mb10)}>Vous n’avez pas encore de compte ?</p>
								<button className={Class(g.brtl30, g.brtr30, g.brbl30, g.brbr30, g.pl10, g.pr10, g.fwe700, d.bgWhite)}
								        onClick={(event) => handleDirection('left', event)}>INSCRIVEZ-VOUS</button>
							</div>
						</div>
						<div className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.fdColumn, g.pAbsolute, g.t0, g.h100p, g.pl10, g.pr10, g.w50p, g.taCenter, cl.auth__overlay__panel, cl.left)}>
							<h1 className={Class(g.mb25, g.fwe500)}>Avec Groupomania, partagez, discutez et restez en contact avec vos collègues</h1>
							<img src="/static/svg/messaging.svg" height={280} width={280} alt="messaging" />
							<div className={g.mt10}>
								<p className={Class(g.fwe500, g.mb10)}>Déjà inscrit ?</p>
								<button className={Class(g.brtl30, g.brtr30, g.brbl30, g.brbr30, g.pl10, g.pr10, g.fwe700, d.bgWhite)}
								        onClick={(event) => handleDirection('right', event)}>CONNECTEZ-VOUS</button>
							</div>
						</div>
					</div>
				</div>
				<div className={Class(g.pAbsolute, g.t0, g.l0, g.op0, g.h100p, g.zi10, cl.auth__signup)}>
					<Signup />
				</div>
				<div className={Class(g.pAbsolute, g.t0, g.l0, g.h100p, g.zi20, cl.auth__login)}>
					<Login />
				</div>
			</div>
		</section>
	)
}

export default Auth