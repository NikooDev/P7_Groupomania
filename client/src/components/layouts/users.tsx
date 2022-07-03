import React from 'react'
import { ToastBar, Toaster } from 'react-hot-toast'
import { toastbarAnimIn, toastbarAnimOut, toasterStyle } from '@Core/notifs/styles'
import ILayout from '@Type/layout'
import cl from '@Core/container/container.module.scss'
import Head from 'next/head'
import SettingsProvider from '@Context/settings.context'
import Dynamic from 'next/dynamic'

const Header = Dynamic(() => import('@Users/header'))
const Navigation = Dynamic(() => import('@Users/navigation'))
const ListUsers = Dynamic(() => import('@Users/chat/listUsers'))

/**
 * Layout users => Connecté
 * @param title
 * @param description
 * @param children
 * @constructor
 */
const Users: React.FC<ILayout> = ({
	title,
	description,
	children }) => {
	return (
		<>
			<Head>
				<title>{ title }</title>
				<meta name="description" content={ description } />
			</Head>
			<Toaster position="top-right" containerStyle={toasterStyle}>
				{(t) => (<ToastBar toast={t} style={{ ...t.style, animation: t.visible ? toastbarAnimIn : toastbarAnimOut }}/>)}
			</Toaster>
			<SettingsProvider>
				<Header />
				<Navigation />
				<ListUsers />
				<main role="main" className={cl.main}>
					{ children }
				</main>
			</SettingsProvider>
		</>
	)
}

export default Users