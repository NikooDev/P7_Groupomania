import { GetServerSidePropsContext } from 'next/types'
import { App } from '@Config'

/**
 * Redirection serveur
 * @param context
 * @param guest
 * @param token
 * @constructor
 */
const Redirect = async (context: GetServerSidePropsContext, guest: boolean, token?: string) => {
	context.res.statusCode = 302

	if(guest && token) {
		context.res.setHeader('Location', '/home')
	} else {
		const pathnext = encodeURIComponent(App.host+context.resolvedUrl)
		context.res.setHeader('Location', '/?next='+pathnext)
	}
}

export default Redirect