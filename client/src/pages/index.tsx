import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { checkServerToken } from '@Helper/checkToken'
import { getCookie, removeCookie } from '@Helper/cookie'
import { Notif } from '@Core/notifs'
import Auth from '@Guest/auth'
import Guest from '@Layout/guest'
import Redirect from '@Helper/redirect'

/**
 * Page index =>
 * Authentification
 * @constructor
 */
const Home = () => {

	useEffect(() => {
		const getError404 = getCookie('error404')
		if(getError404) {
			Notif({ id: 'error404', type: 'error', message: 'Cette page n’est pas disponible' })
			removeCookie('error404')
		}
	}, [])

	return <Auth />
}

Home.getLayout = (page: React.ReactElement) => {
	return (
		<Guest title="Groupomania" description="Inscrivez-vous ou connectez-vous sur Groupomania. Le réseau social pour les professionnels">
			{ page }
		</Guest>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { token } = checkServerToken(context)

	token && await Redirect(context, true, token)
	return {
		props: {}
	}
}

export default Home