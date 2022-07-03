import React, { useCallback, useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import Link from 'next/link'
import g from '@Asset/theme/global.module.scss'
import cl from './navigation.module.scss'
import { ChatIcon, FeedIcon, ImageIcon, ShieldIcon } from '@Core/icons/menu'
import { Avatar } from '@Core/avatar'
import { capitalize } from '@Helper/utils'
import useUser from '@Hook/useUser'
import usePost from '@Hook/usePost'
import Class from 'classnames'
import Tooltip from '@Core/tooltip'
import Loader from '@Core/loader'

/**
 * Sidebar gauche de navigation
 * @constructor
 */
const Navigation = () => {
	const [loader, setLoader] = useState<boolean>(false),
		{ user, loading } = useUser(),
		{ isFetching, status } = usePost(),
		router = useRouter()

	const handleRouteStart = useCallback(() => setLoader(true), [])
	const handleRouteDone = useCallback(() => setLoader(false), [])

	useEffect(() => {
		if(loading || isFetching || status === 'loading') handleRouteStart()
		else handleRouteDone()

		Router.events.on('routeChangeStart', handleRouteStart)
		Router.events.on('routeChangeComplete', handleRouteDone)
		Router.events.on('routeChangeError', handleRouteDone)

		return () => {
			Router.events.off('routeChangeStart', handleRouteStart)
			Router.events.off('routeChangeComplete', handleRouteDone)
			Router.events.off('routeChangeError', handleRouteDone)
		}
	}, [loading, isFetching, status, handleRouteStart, handleRouteDone])

	return (
		<aside className={Class(g.pFixed, g.zim1, g.h100p, g.t0, g.l0, g.w60, g.zi50, cl.navigation)} role="complementary">
			<div className={Class(g.dFlex, g.h40)}>
				<Link href="/home" passHref>
					<a href="/home" className={Class(g.dFlex, g.jcCenter, g.aiCenter, g.w100p, cl.navigation__logo)}>
						{ loader ?
							<Loader height={46} width={46} color="#fff" classname={g.dFlex} /> :
							<img src="/static/logo/logoWhite.svg" height={50} width={50} alt="logo" />
						}
					</a>
				</Link>
			</div>
			<div className={Class(g.dFlex, g.aiCenter, g.fdColumn)}>
				<ul className={cl.navigation__menu}>
					<li className={g.mt15}>
						<Link href="/home" passHref prefetch={false}>
							<Tooltip
								href="/home"
								content="Fil d'actualité"
								placement="right"
								trigger="focusin mouseenter"
								offset={[0, 15]}>
								<a href="/home" className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.h30, g.w30, g.br100, cl.navigation__menu__link, router.asPath === '/home' ? cl.active : null)}>
									<FeedIcon height={23} width={23} />
								</a>
							</Tooltip>
						</Link>
					</li>
					<li className={g.mt15}>
						<Link href="/photos" passHref prefetch={false}>
							<Tooltip
								href="/photos"
								content="Photos"
								placement="right"
								offset={[0, 15]}>
								<a href="/photos" className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.h30, g.w30, g.br100, cl.navigation__menu__link, router.asPath === '/photos' ? cl.active : null)}>
									<ImageIcon height={23} width={23} />
								</a>
							</Tooltip>
						</Link>
					</li>
					<li className={g.mt15}>
						<Link href="/messages" passHref prefetch={false}>
							<Tooltip
								href="/messages"
								content="Messages"
								placement="right"
								offset={[0, 15]}>
								<a href="/messages" className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.h30, g.w30, g.br100, cl.navigation__menu__link, router.asPath === '/messages' ? cl.active : null)}>
									<ChatIcon height={23} width={23} />
								</a>
							</Tooltip>
						</Link>
					</li>
					{ user && user.role === 'admin' &&
						<li className={g.mt15}>
							<Link href="/admin" passHref prefetch={false}>
								<Tooltip
									href="/admin"
									content="Administration"
									placement="right"
									offset={[0, 15]}>
									<a href="/admin" className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.h30, g.w30, g.br100, cl.navigation__menu__link, router.asPath === '/admin' ? cl.active : null)}>
										<ShieldIcon height={23} width={23} />
									</a>
								</Tooltip>
							</Link>
						</li>
					}
					<li className={g.mt15}>
						<Link href={user && user.username ? '/'+user.username : '/home'} passHref prefetch={false}>
							<Tooltip
								href={user && user.username ? '/'+user.username : '/home'}
								content={user && user.profile ? capitalize(user.profile.firstname)+' '+capitalize(user.profile.name) : 'Chargement...'}
								placement="right"
								offset={[0, 15]}>
								<a href={user && user.username ? '/'+user.username : '/home'} className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.h30, g.w30, g.br100, cl.navigation__menu__link, router.asPath === '/'+user?.username ? cl.active : null)}>
									<Avatar avatar_url={user?.avatar && user.avatar.avatar_url} user_id={user?.id} width={46} height={46} classnameLoader={Class(g.pl5, g.pb5, g.pr5, g.pt5)} colorLoader="#fff" />
								</a>
							</Tooltip>
						</Link>
					</li>
				</ul>
			</div>
		</aside>
	)
}

export default Navigation