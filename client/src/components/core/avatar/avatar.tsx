import React from 'react'
import { IAvatar } from '@Type/core'
import g from '@Asset/theme/global.module.scss'
import { AvatarDefault } from '@Core/icons/menu'
import useUser from '@Hook/useUser'
import Loader from '@Core/loader'
import Class from 'classnames'

/**
 * Affichage du loader jusqu'à la photo de profil
 * @constructor
 */
export const Avatar = ({
	avatar_url,
	user_id,
	colorLoader,
	classnameLoader,
	classnameAvatarDefault,
	classname,
	height,
	width }: IAvatar) => {
	const { loading, validating } = useUser(),
		avatar_path = process.env.NEXT_PUBLIC_AVATAR_PATH+user_id!+'/'+avatar_url

	return (
		<>
			{
				(loading && validating) ? <Loader height={height} width={height} strokeWidth={height > 80 ? 1 : 3} color={colorLoader} classname={Class(g.dFlex, classnameLoader)} /> :
					(!loading || !validating) && !avatar_url ? <AvatarDefault height={height} width={width} classname={Class(classnameAvatarDefault)} /> :
						<img src={avatar_path} height={height} width={width} className={Class(classname, g.br100)} alt="avatar" />
			}
		</>
	)
}

export const AvatarPreloaded = ({
	avatar_url,
	user_id,
	classnameAvatarDefault,
	classname,
	height,
	width }: IAvatar) => {
	const avatar_path = process.env.NEXT_PUBLIC_AVATAR_PATH+user_id!+'/'+avatar_url

	return (
		<>
			{
				!avatar_url ? <AvatarDefault height={height} width={width} classname={Class(classnameAvatarDefault)} /> :
					<img src={avatar_path} height={height} width={width} className={Class(classname, g.br100)} alt="avatar" />
			}
		</>
	)
}