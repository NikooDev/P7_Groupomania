import { ManagerOptions, SocketOptions } from 'socket.io-client'

/**
 * Interface de configuration
 */

export interface IApp {
	host: string
	api: string
	key: string
	mode: string
}

export interface ISocket {
	url: string | Partial<ManagerOptions & SocketOptions>
	config?: Partial<ManagerOptions & SocketOptions>
}