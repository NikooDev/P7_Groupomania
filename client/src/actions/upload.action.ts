import { checkClientToken } from '@Helper/checkToken'
import Request from '@Service/request'

/**
 * Upload avatar
 * @param file
 * @constructor
 */
export const AvatarAction = async (file: File | null) => {
	const token = checkClientToken(), formData = new FormData()

	try {
		if(file) {
			formData.append('file', file)
			const res = await Request({ method: 'POST', url: '/user/avatar/post', token: token, data: formData })
			if(!res) return

			return res.ok
		}
	} catch (e) {
		console.log(e)
	}
}

export const deleteAvatar = async () => {
	const token = checkClientToken()

	try {
		const res = await Request({ method: 'POST', url: '/user/avatar/delete', token: token })
		if (!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}