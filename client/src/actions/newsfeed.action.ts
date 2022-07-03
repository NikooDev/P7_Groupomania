import { IPostCreate } from '@Type/newsfeed'
import { checkClientToken } from '@Helper/checkToken'
import Request from '@Service/request'

/**
 * Création ou modification de posts
 * @param post
 * @param id
 * @param imgDeleted
 * @constructor
 */
export const PostAction = async (post: IPostCreate, id?: string, imgDeleted?: string) => {
	const token = checkClientToken()
	let postData = new FormData(), url

	url = '/user/newsfeed/post'

	post.post_text && postData.append('post_text', post.post_text.replace(/\n\s*\n\s*\n/g, '\n\n').trim())
	post.photo_title && postData.append('photo_title', post.photo_title)
	post.photo && postData.append('photo', post.photo)

	if(id && imgDeleted) {
		postData.append('id', id)
		postData.append('imgDeleted', imgDeleted)
		url = '/user/newsfeed/update/'+id
	}

	try {
		const res = await Request({ method: 'POST', url: url, token: token, data: postData })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

/**
 * Récupère la liste des posts => limit: 10
 * @param url
 */
export const getPosts = async (url: string) => {
	await new Promise(resolve => setTimeout(resolve, 500))
	const token = checkClientToken()

	try {
		const res = await Request({ method: 'GET', url: url, token: token })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

/**
 * Suppression d'un post
 * @param id
 */
export const deletePost = async (id: string) => {
	const token = checkClientToken()

	try {
		const res = await Request({ method: 'POST', url: '/user/newsfeed/delete/'+id, token: token })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}

/**
 * Enregistrement d'un like / dislike
 * @param post_id
 */
export const likePost = async (post_id: string) => {
	const token = checkClientToken(), toggleLike = { post_id: post_id }
	let header

	header = { 'Content-Type': 'application/json' }

	try {
		const res = await Request({ method: 'POST', url: '/user/newsfeed/like', token: token, header: header, data: JSON.stringify(toggleLike) })
		if(!res) return

		return res
	} catch (e) {
		console.log(e)
	}
}