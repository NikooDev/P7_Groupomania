import React, { CSSProperties } from 'react'
import { ToastPosition } from 'react-hot-toast'
import { Placement } from 'tippy.js'

export interface IIcon {
	height: number
	width: number
	classname?: string
}

export interface ILoader {
	height: IIcon['height']
	width: IIcon['width']
	color: string
	strokeWidth?: number
	classname?: IIcon['classname']
}

export interface INotif {
	id?: string
	type?: 'info' | 'success' | 'error'
	message: string
	customStyle?: CSSProperties
	duration?: number
	avatar_url?: string
	position?: ToastPosition
}

export interface IModal {
	children: React.ReactNode
	title: string
	showConfirmButton?: boolean
	showCancelButton?: boolean
	cancelButtonText?: string
	confirmButtonText?: string
	allowOutsideClick?: boolean
	show: boolean
	onClose?: () => void
	onInitialState?: () => void
	onConfirmed?: () => void
	classname?: string
}

export interface IModalControl {
	show: boolean
	handleClose: () => void
}

export interface ITooltipRender {
	'data-placement': Placement
	'data-reference-hidden'?: string | undefined
	'data-escaped'?: string | undefined
}

export interface IAvatar {
	avatar_url: string | undefined
	user_id: string | undefined
	isLoading?: boolean
	colorLoader: string
	classnameAvatarDefault?: string
	classnameLoader?: string
	classname?: string
	height: number
	width: number
}