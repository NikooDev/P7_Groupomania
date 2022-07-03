import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { MenuItem } from '@szhsin/react-menu'
import g from '@Asset/theme/global.module.scss'
import m from '@Core/modals/modal.module.scss'
import cl from './dropdown.module.scss'
import { AvatarIcon, DarkModeIcon, LogoutIcon, TagIcon } from '@Core/icons/menu'
import { Avatar } from '@Core/avatar'
import { Notif } from '@Core/notifs'
import { LogoutAction } from '@Action/auth.action'
import { capitalize, isEmpty } from '@Helper/utils'
import { postUsername } from '@Action/user.action'
import useUser from '@Hook/useUser'
import useModal from '@Hook/useModal'
import Class from 'classnames'
import Modal from '@Core/modals'
import UploadAvatar from '@Core/avatar/upload'

/**
 * Dropdown => Settings
 * @constructor
 */
const SettingsMenu = () => {
	const { user, loading, mutate } = useUser(),
		{ show, handleClose, handleOpen } = useModal(),
		[showUpdateUsername, setShowUpdateUsername] = useState<boolean>(false),
		[usernameUrl, setUsername] = useState({ username: '' })

	const handleOpenUpdateUsername = useCallback(() => setShowUpdateUsername(true), [])
	const handleCloseUpdateUsername = useCallback(() => setShowUpdateUsername(false), [])

	/**
	 * Modification du state => Username
	 * @param event
	 */
	const handleUsernameChange = (event: React.ChangeEvent) => {
		event.preventDefault()
		const target = event.target as HTMLInputElement

		setUsername({ ...usernameUrl, username: target.value })
	}

	/**
	 * Fermeture de la modale => Url de profil
	 * @param event
	 */
	const handleCancel = (event: React.MouseEvent) => {
		event.preventDefault()
		Swal.close()
	}

	/**
	 * Soumission de l'url du profil (username)
	 * @param event
	 */
	const handleUsernameSubmit = async (event: React.MouseEvent) => {
		event.preventDefault()
		const alphanumeric = /^[a-zA-Z\d]+$/
		if(isEmpty(usernameUrl.username)) {
			Notif({ id: 'usernameEmpty', type: 'error', message: 'Un nom d\'utilisateur est requis' })
			return
		}

		if(usernameUrl.username === 'admin') {
			Notif({ id: 'usernameName', type: 'error', message: 'Veuillez choisir un autre nom d\'utilisateur' })
			return
		}

		if(!alphanumeric.test(usernameUrl.username)) {
			Notif({ id: 'usernameEmpty', type: 'error', message: 'Seul les caractères alphanumériques sont autorisés' })
			return
		}

		if(usernameUrl.username.length > 30 || usernameUrl.username.length < 4) {
			Notif({ id: 'usernameLength', type: 'error', message: 'Le nom d’utilisateur doit comporter entre 4 et 30 caractères' })
			return
		}

		const res = await postUsername(usernameUrl)
		if(!res) {
			console.log('Une ou plusieurs données n\'ont pas été reçus par le serveur')
			return
		}

		if(res.message === '23505') {
			Notif({ id: 'usernameUnique', type: 'error', message: 'Ce nom d’utilisateur n’est plus disponible' })
			return
		}
		if(res.ok) {
			setUsername({ ...usernameUrl, username: '' })
			Swal.close()
			await mutate()
		}
	}

	/**
	 * Déconnexion de l'utilisateur
	 */
	const handleLogout = async () => await LogoutAction()

	return (
		<div className={Class(g.dFlex, g.fdColumn, cl.settings)}>
			<div className={Class(g.pt10, g.pb10)}>
				<MenuItem className={Class(g.pl10, g.pr10, cl.settings__item)}>
					<Link href={user ? '/'+user && user.username : '/home'}>
						<a href={user ? '/'+user && user.username : '/home'} className={Class(g.dFlex, g.aiCenter)}>
							<Avatar avatar_url={user?.avatar && user.avatar.avatar_url} user_id={user?.id} colorLoader="#605699" height={70} width={70} />
							<div className={Class(g.dFlex, g.fdColumn, g.ml10)}>
								<span className={Class(g.fwe700, g.ovHidden, cl.settings__name)}>
									{ user ? capitalize(user.profile.firstname)+ ' '+capitalize(user.profile.name) : 'Chargement...' }
								</span>
								<span className={Class(g.fwe500, cl.settings__textSubLink)}>Voir votre profil</span>
							</div>
						</a>
					</Link>
				</MenuItem>
				<div className={cl.settings__divider} />
				<MenuItem onClick={handleOpen} className={Class(g.pl10, g.pr10, cl.settings__item)}>
					<span className={Class(g.dFlex, g.aiCenter, g.jcCenter, cl.settings__item__icon)}>
						<AvatarIcon height={30} width={30} />
					</span>
					<span className={Class(g.fwe600, g.ml5)}>Modifier votre avatar</span>
				</MenuItem>
				<UploadAvatar show={show} handleClose={handleClose} />
				<MenuItem className={Class(g.pl10, g.pr10, cl.settings__item)}>
					<span className={Class(g.dFlex, g.aiCenter, g.jcCenter, cl.settings__item__icon)}>
						<DarkModeIcon height={23} width={23} />
					</span>
					<span className={Class(g.fwe600, g.ml5)}>Mode sombre</span>
				</MenuItem>
				{
					user && !user.username_changed && !loading && <>
					<MenuItem onClick={handleOpenUpdateUsername} className={Class(g.pl10, g.pr10, cl.settings__item)}>
						<span className={Class(g.dFlex, g.aiCenter, g.jcCenter, cl.settings__item__icon)}>
							<TagIcon height={30} width={30} />
						</span>
						<span className={Class(g.fwe600, g.ml5)}>Modifier l'url de votre profil</span>
					</MenuItem>
					<Modal title="Modifier l'url de votre profil" classname={Class(m.uploadSwal)} show={showUpdateUsername} onClose={handleCloseUpdateUsername}>
						<div className={Class(g.dFlex, g.jcCenter, g.ml10, g.mr10, g.mt10, g.h30, g.pl10, g.brtl30, g.brtr30, g.brbr30, g.brbl30, cl.settings__updateUrl)}>
							<span className={Class(g.dFlex, g.aiCenter, g.mr5, g.w80p)}>groupomania.com/</span>
							<input type="text" placeholder="Nom d'utilisateur" name="username" maxLength={30} onChange={(event) => handleUsernameChange(event)} autoFocus className={Class(g.w100p, g.brtr30, g.brbr30, g.pl10, g.pr10, cl.settings__updateUrl)} />
						</div>
						<p className={Class(g.mb10, g.mt10, g.pl10, g.pr10, g.fwe600, cl.settings__updateUrl__remarque)}>Une fois l'url de votre profil enregistrée, vous ne pourrez plus la modifier</p>
						<div className={Class(g.dFlex, g.zi10, g.fwWrap, g.aiCenter, g.jcCenter, g.px0, g.mb10, m.action, cl.settings__updateUrl__action)}>
							<button type="button" onClick={(event) => handleCancel(event)} className={Class(g.mt5, g.mb5, m.button, m.cancel)}>Annuler</button>
							<button type="button" onClick={(event) => handleUsernameSubmit(event)} className={Class(g.ml10, m.button, m.confirm)}>Enregistrer</button>
						</div>
					</Modal>
					</>
				}
				<div className={cl.settings__divider} />
				<MenuItem onClick={handleLogout} className={Class(g.pl10, g.pr10, cl.settings__item)}>
					<span className={Class(g.dFlex, g.aiCenter, g.jcCenter, cl.settings__item__icon)}>
						<LogoutIcon height={23} width={23} />
					</span>
					<span className={Class(g.fwe600, g.ml5)}>Déconnexion</span>
				</MenuItem>
			</div>
		</div>
	)
}

export default SettingsMenu