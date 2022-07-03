import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Menu } from '@szhsin/react-menu'
import g from '@Asset/theme/global.module.scss'
import d from '@Users/dropdown/dropdown.module.scss'
import t from '@Asset/theme/default.module.scss'
import cl from './header.module.scss'
import { AlertIcon, ChatIcon, GridCol2, GridCol3, HamburgenIcon } from '@Core/icons/menu'
import { Avatar } from '@Core/avatar'
import { useSettings } from '@Context/settings.context'
import { setCookie } from '@Helper/cookie'
import { capitalize } from '@Helper/utils'
import Router, { useRouter } from 'next/router'
import useUser from '@Hook/useUser'
import Tooltip from '@Core/tooltip'
import Class from 'classnames'
import Container from '@Core/container'
import useOutside from '@Hook/useOutside'
import SettingsMenu from '@Users/dropdown/settings'
import NotifsMenu from '@Users/dropdown/notifs'
import MessagesMenu from '@Users/dropdown/messages'
import Dynamic from 'next/dynamic'

const Search = Dynamic(() => import('@Users/search'))

/**
 * Header => Utilisateurs connectés
 * @constructor
 */
const Header = () => {
	const [breakpoint, setBreakpoint] = useState<string>(''),
		[showMenu, setShowMenu] = useState<boolean>(false),
		btnAvatarRef = useRef() as React.MutableRefObject<HTMLButtonElement>,
		btnFirstnameRef = useRef() as React.MutableRefObject<HTMLSpanElement>,
		buttonRef = useRef() as React.MutableRefObject<HTMLDivElement>,
		router = useRouter(),
		{ breakpointCol } = useSettings(),
		{ user } = useUser()

	useOutside(buttonRef, () => setShowMenu(false))

	const handleBreakpointToggle = () => {
		setCookie('breakpointCols', breakpointCol === '2' ? '3' : '2')
		router.replace(router.asPath)
	}

	useEffect(() => {
		breakpointCol && setBreakpoint(breakpointCol !== '2' ? '3' : '2')
	}, [breakpointCol])

	const handleAvatarLoad = useCallback(() => {
		if(user && user.profile && btnFirstnameRef && btnAvatarRef) {
			const width = btnFirstnameRef.current.offsetWidth, padding = 5
			btnAvatarRef.current.style.width = 46 + width + padding + 'px'
		}
	}, [user, btnFirstnameRef, btnAvatarRef])

	const handleToggleMenu = useCallback((event: React.MouseEvent) => {
		event.preventDefault()
		setShowMenu(showMenu => !showMenu)
	}, [])

	useEffect(() => {
		if(showMenu) {
			document.body.classList.add('showMenu')
		} else document.body.classList.remove('showMenu')
	}, [showMenu])

	useEffect(() => {
		Router.events.on('routeChangeStart', () => setShowMenu(false))
	}, [])

	useEffect(() => {
		handleAvatarLoad()
	}, [handleAvatarLoad])

	return (
		<header className={Class(g.pFixed, g.w100p, g.l0, g.t0, g.h40, g.zi50, t.bgWhite, cl.header)} role="banner">
			<Container>
				<div className={Class(g.dFlex, g.aiCenter, g.h40)}>
					<div className={Class(g.mr5, g.ml10, cl.header__mobile)} ref={buttonRef}>
						<button onClick={(event) => handleToggleMenu(event)} className={Class(g.dFlex, g.pt5, g.pl5, g.pb5, g.pr5, g.br100, cl.header__mobile__toggle)}>
							<HamburgenIcon height={30} width={30} />
						</button>
					</div>
					<Search />
					{ router.pathname === '/home' || router.pathname === '/photos' ?
					<div className={Class(g.h100p, g.ml5, cl.header__breakpointBtn)}>
						<ul className={Class(g.dFlex, g.aiCenter, cl.header__nav)}>
							<li className={Class(g.mr5)}>
								<Tooltip content="Modifier l'affichage du fil d'actualité" placement="right" offset={[0, 16]}>
									<button onClick={() => handleBreakpointToggle()} className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.br100, g.pt5, g.pl5, g.pr5, g.pb5)}>
										{ breakpoint.length > 0 ? breakpoint === '3' ? <GridCol3 height={25} width={25} /> : <GridCol2 height={25} width={25} /> : <></> }
									</button>
								</Tooltip>
							</li>
						</ul>
					</div> : <></> }
					<div className={Class(g.dFlex, g.h100p, g.mlAuto)}>
						<ul className={Class(g.dFlex, g.aiCenter, cl.header__nav)}>
							<li className={Class(g.mr5, g.ml10)}>
								<Menu arrow={true} offsetY={4} align="center" menuClassName={Class(g.brtl15, g.brtr15, g.brbl15, g.brbr15, g.px0, d.dropdown, d.large)} menuButton={
									<Tooltip content="Messages" placement="bottom" offset={[0, 16]}>
										<button className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.br100, g.pt5, g.pl5, g.pr5, g.pb5)}>
											<ChatIcon height={25} width={25} />
										</button>
									</Tooltip>
								} transition>
									<MessagesMenu />
								</Menu>
							</li>
							<li className={g.mr5}>
								<Menu arrow={true} offsetY={4} align="center" menuClassName={Class(g.brtl15, g.brtr15, g.brbl15, g.brbr15, g.px0, d.dropdown, d.large)} menuButton={
									<Tooltip content="Notifications" placement="bottom" offset={[0, 16]}>
										<button className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.br100, g.pt5, g.pl5, g.pr5, g.pb5)}>
											<AlertIcon height={30} width={30} />
										</button>
									</Tooltip>
								} transition>
									<NotifsMenu />
								</Menu>
							</li>
							<li>
								<Menu arrow={true} offsetY={4} offsetX={0} align="end" menuClassName={Class(g.brtl15, g.brtr15, g.brbl15, g.brbr15, g.px0, d.dropdown)} menuButton={
									<Tooltip content="Votre profil" placement="bottom" offset={[0, 16]}>
										<button className={Class(g.dFlex, g.aiCenter, user?.avatar && user.avatar.avatar_url ? g.jcSpaceBetween : g.jcCenter, g.brtl30, g.brtr30, g.brbl30, g.brbr30, g.ovHidden, g.px0)} ref={btnAvatarRef}>
											<Avatar avatar_url={user?.avatar && user.avatar.avatar_url} user_id={user?.id} width={46} height={46} classname={Class(g.pRelative, cl.btnAvatar)} classnameAvatarDefault={Class(g.pt5, g.pl5, g.pb5, g.pr5)} classnameLoader={Class(g.pl5, g.pb5, g.pr5, g.pt5)} colorLoader="#fff" />
											{ user?.profile && <span className={Class(g.fwe600, user?.avatar && user.avatar.avatar_url ? [g.pl10, g.pr15] : [g.pl5, g.pr10])} ref={btnFirstnameRef}>{ capitalize(user.profile.firstname as string) }</span> }
										</button>
									</Tooltip>
								} transition>
									<SettingsMenu />
								</Menu>
							</li>
						</ul>
					</div>
				</div>
			</Container>
		</header>
	)
}

export default Header