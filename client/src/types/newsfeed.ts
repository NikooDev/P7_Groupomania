export interface IPostCreate {
	user_id: string
	post_text?: string
	photo?: File | null
	photo_title?: string
}

export interface IPost {
	id: string
	user_id: string
	post_text: string
	firstname: string
	username: string
	name: string
	photo_url: string
	photo_title: string
	avatar_url: string
	with_picture: boolean
	users_liked: string[] | null
	created_at: string
	updated_at: string
}

export interface ICommentCreate {
	comment_text: string
	post_id: string
}

export interface IComment {
	id: string
	post_id: string
	user_id: string
	comment_text: string
	firstname: string
	name: string
	role: 'admin' | 'user'
	avatar_url: string
	created_at: string
	updated_at: string
}

export interface INewsfeedProps {
	breakpoint?: string
	profile_id?: string
	display: 'all' | 'profile' | 'photo'
}

export interface IUpdatePostContext {
	updatePost: IPostCreate | null
}

export interface IUpdatePostAction {
	type: 'UPDATE_POST' | 'RESET_UPDATE_POST'
	payload?: any
}