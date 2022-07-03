interface IRequest {
	method: 'GET' | 'POST'
	url: string
	data?: any
	token?: string
	header?: {}
}

export default IRequest