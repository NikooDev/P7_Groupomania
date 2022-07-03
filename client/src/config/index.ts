import config from 'next.config'
import { IApp, ISocket } from '@Type/config'

/**
 * Configuration globale
 */
export const App: IApp = {
	host: config.dev ? 'http://127.0.0.1:3000' : 'http://127.0.0.1:3000', // URL publique à modifier
	api: config.dev ? 'http://127.0.0.1:3333' : 'http://127.0.0.1:3333', // URL API publique à modifier
	key: 'ae4wd433da61585693c5zda82c5e1eb9',
	mode: config.dev ? 'development' : 'production'
}

/**
 * Configuration de Socket.io
 */
export const Ws: ISocket = {
	url: App.api,
	config: {
		path: '/ws',
		autoConnect: false,
		reconnection: true,
		secure: true,
		transports: ['websocket', 'polling']
	}
}