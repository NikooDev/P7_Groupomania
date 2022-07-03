import io from 'socket.io-client'
import { Ws } from '@Config'

/**
 * Instance de socket.io
 */
const ws  = io(Ws.url, Ws.config)

export default ws