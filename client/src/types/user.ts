import { DateTime } from 'luxon'

interface IProfile {
	firstname: string
	name: string
	status: string
	darkmode: boolean
	cover_url: string
	updated_at: DateTime
}

interface IAvatar {
	id: string
	avatar_url: string
}

export interface IUser {
	id: string
	email: string
	username: string
	role: 'user' | 'admin'
	profile: IProfile
	avatar: IAvatar
	username_changed: boolean
	created_at: DateTime
}

export interface IUpdateUser {
	name: string | null
	firstname: string | null
	email: string | null
	confirm_delete: string | null
}

export interface IProfileProps {
	result: IUser
	token: string
}