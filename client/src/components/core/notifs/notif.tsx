import React, { CSSProperties } from 'react'
import { alertErrorStyle, alertInfoStyle, alertSuccessStyle, alertUserStyle } from '@Core/notifs/styles'
import { INotif } from '@Type/core'
import { ErrorIcon, InfoIcon, SuccessIcon } from '@Core/icons/alert'
import { toast } from 'react-hot-toast'
import { isEmpty } from '@Helper/utils'

/**
 * Notification globale
 * Success | Info | Error
 * @constructor
 */
export const Notif = ({
	id,
	type,
	message,
	customStyle,
	duration = 4000,
	position }: INotif) => {
	let icon: JSX.Element | undefined,
		style: CSSProperties

	if(isEmpty(message)) throw new Error('Le message d\'une notification de type "'+type+'" est vide')

	switch (type) {
		case 'info':
			style = alertInfoStyle
			icon = <InfoIcon height={25} width={25} />
			break
		case 'success':
			style = alertSuccessStyle
			icon = <SuccessIcon height={25} width={25} />
			break
		case 'error':
			style = alertErrorStyle
			icon = <ErrorIcon height={25} width={25} />
			break
		default:
			throw new Error('Type de notification non défini')
	}

	return toast(message, { id: id, duration: duration, position: position, icon: icon, style: { ...style, ...customStyle } })
}

/**
 * Notification personnalisée
 * Intégration d'un avatar
 * @constructor
 */
export const NotifAvatar = ({
	id,
	message,
	duration = 3000,
	position,
	avatar_url }: INotif) => {
	return toast(() => (
		<div>
			{ avatar_url } { message }
		</div>
	), { id: id, duration: duration, position: position, style: alertUserStyle })
}