import React, { useCallback, useState } from 'react'
import Swal from 'sweetalert2'
import { IUser } from '@Type/user'
import g from '@Asset/theme/global.module.scss'
import m from '@Core/modals/modal.module.scss'
import cl from './profile.module.scss'
import { Avatar } from '@Core/avatar'
import { Notif } from '@Core/notifs'
import { capitalize, isEmpty } from '@Helper/utils'
import { deleteUser, updateUser } from '@Action/user.action'
import { removeAllCookie } from '@Helper/cookie'
import { useRouter } from 'next/router'
import useUser from '@Hook/useUser'
import useModal from '@Hook/useModal'
import Container from '@Core/container'
import Class from 'classnames'
import Modal from '@Core/modals'
import UploadAvatar from '@Core/avatar/upload'
import Dynamic from 'next/dynamic'
import { deleteAvatar } from '@Action/upload.action'

const Stream = Dynamic(() => import('@Users/newsfeed/stream'))

/**
 * Composant principal de la page profil
 * @param props
 * @constructor
 */
const Profile = (props: IUser) => {
	const [showDelete, setShowDelete] = useState<boolean>(false),
		[showModalProfile, setShowModalProfile] = useState<boolean>(false),
		[updateProfile, setUpdateProfile] = useState({ name: '', firstname: '', email: '', confirm_delete: '' }),
		{ show, handleClose, handleOpen } = useModal(),
		{ user, mutate } = useUser(),
		router = useRouter()

	const handleShowModalProfile = useCallback(() => setShowModalProfile(true), [])
	const handleHideModalProfile = useCallback(() => setShowModalProfile(false), [])
	const handleShowDelete = useCallback((event: React.MouseEvent) => {
		event.preventDefault()
		setShowDelete(true)
	}, [])

	const handleUpdateAvatar = (event: React.MouseEvent) => {
		event.preventDefault()
		setShowModalProfile(false)
		handleOpen()
	}

	const handleChangeUpdateProfile = (event: React.ChangeEvent) => {
		event.preventDefault()
		const target = event.target as HTMLInputElement

		setUpdateProfile({ ...updateProfile, [target.name]: target.value })
	}

	/**
	 * Fermeture de la modale => Modifier le profil
	 * @param event
	 */
	const handleCancel = (event: React.MouseEvent) => {
		event.preventDefault()
		if(showDelete) {
			setShowDelete(false)
		} else {
			Swal.close()
		}
	}

	/**
	 * Submit => Mise à jour du profil
	 */
	const handleUpdateProfil = async (event: React.MouseEvent) => {
		event.preventDefault()

		if(isEmpty(updateProfile.name) && isEmpty(updateProfile.firstname) && isEmpty(updateProfile.email)) return

		const res = await updateUser(updateProfile)
		if(!res) return

		if(res.ok) {
			setUpdateProfile({ name: '', firstname: '', email: '', confirm_delete: '' })
			await router.replace(router.asPath)
			await mutate()
			Swal.close()
		}
	}

	/**
	 * Submit => Suppression du profil
	 */
	const handleDeleteProfil = async (event: React.MouseEvent) => {
		event.preventDefault()

		if(user && updateProfile.confirm_delete === user.email) {
			const res = await deleteUser(updateProfile)
			if(!res) return

			if(res.ok) {
				Swal.close()
				removeAllCookie()
				await router.replace('/')
			}
		} else {
			Notif({ id: 'deleteErrorEmail', type: 'error', message: 'Votre email ne correspond pas à votre compte' })
		}
	}

	const handleDeleteAvatar = async (event: React.MouseEvent) => {
		event.preventDefault()
		const res = await deleteAvatar()
		if(!res) return

		if(res.ok) {
			await mutate()
			await router.replace(router.asPath)
			Swal.close()
		}
	}

	return (
		<section>
			<div className={Class(g.dFlex, g.fdColumn, g.aiCenter, g.mb25, cl.profile)}>
				<div className={Class(g.dFlex, g.pl5, g.pb5, g.pr5, g.pt5, g.br100, cl.profile__avatar)}>
					<Avatar avatar_url={props.avatar?.avatar_url} user_id={props.id} colorLoader="#605699" height={160} width={160} />
				</div>
				<p className={Class(g.fwe600, g.mt10, cl.profile__fullname)}>{ capitalize(props.profile.firstname)+' '+capitalize(props.profile.name) }</p>
				{ user && user.id === props.id && <button onClick={handleShowModalProfile} className={Class(g.fwe600, g.mt5, g.brtl30, g.brtr30, g.brbr30, g.brbl30, m.confirm, cl.profile__update__button)} aria-label="Modifier le profil">Modifier le profil</button> }
			</div>
			<Container classname={Class(cl.profile__container__stream)}>
				<Stream display="profile" profile_id={props.id} />
			</Container>
			<Modal title="Modifier le profil" show={showModalProfile} classname={m.uploadSwal} onClose={handleHideModalProfile}>
				<form className={Class(g.dFlex, g.fdColumn, cl.profile__update)} autoComplete="off">
					{ !showDelete ? <>
						<div className={Class(g.pt10, g.pl10, g.pb10, g.pr10)}>
						<div className={Class(g.dFlex, g.aiCenter, g.jcSpaceBetween, g.pt5, g.pl5, g.pb5, g.pr5)}>
							<label htmlFor="name" className={Class(g.taRight, g.w30p)}>Nom</label>
							<input type="text" id="name" name="name" onChange={(event) => handleChangeUpdateProfile(event)}
										 className={Class(g.fwe500, g.w70p, g.ml10, g.brtr30, g.brtl30, g.brbr30, g.brbl30)} defaultValue={capitalize(props.profile.name)} />
						</div>
						<div className={Class(g.dFlex, g.aiCenter, g.jcSpaceBetween, g.pt5, g.pl5, g.pb5, g.pr5)}>
							<label htmlFor="firstname" className={Class(g.taRight, g.w30p)}>Prénom</label>
							<input type="text" id="firstname" name="firstname" onChange={(event) => handleChangeUpdateProfile(event)}
										 className={Class(g.fwe500, g.w70p, g.ml10, g.brtr30, g.brtl30, g.brbr30, g.brbl30)} defaultValue={capitalize(props.profile.firstname)} />
						</div>
						<div className={Class(g.dFlex, g.aiCenter, g.jcSpaceBetween, g.pt5, g.pl5, g.pb5, g.pr5)}>
							<label htmlFor="email" className={Class(g.taRight, g.w30p)}>Adresse e-mail</label>
							<input type="text" id="email" name="email" onChange={(event) => handleChangeUpdateProfile(event)}
										 className={Class(g.fwe500, g.w70p, g.ml10, g.brtr30, g.brtl30, g.brbr30, g.brbl30)} defaultValue={props.email} />
						</div>
					</div>
					<div className={m.divider} />
					<div className={Class(g.dFlex, g.aiCenter, g.mt10, g.pt10, g.pl15, g.pb10, g.pr15)}>
						<Avatar avatar_url={props.avatar?.avatar_url} classname={Class(g.pt5, g.pl5, g.pb5, g.pr5, cl.profile__avatar)} user_id={props.id} colorLoader="#605699" height={130} width={130} />
						<div className={Class(g.dFlex, g.aiFlexEnd, g.fdColumn)}>
							<button onClick={(event) => handleUpdateAvatar(event)} className={Class(g.fwe500, g.ml20, g.mb5, m.button, m.cancel)}>Modifier votre avatar</button>
							<button onClick={(event) => handleDeleteAvatar(event)} className={Class(g.fwe500, g.ml20, m.button, m.cancel)}>Supprimer votre avatar</button>
						</div>
					</div>
					<div className={m.divider} /></> : <></> }
					<div className={Class(g.mt20, g.mb10)}>
						{ !showDelete ? <button onClick={(event) => handleShowDelete(event)} className={Class(g.pl15, g.pr15, g.fwe500, m.button, cl.profile__delete, cl.btnDelete)}>Supprimez votre compte</button> : <></> }
						{
							showDelete &&
							<div className={Class(g.dFlex, g.fdColumn, cl.profile__delete__confirm)}>
								<p className={Class(g.mb10, g.fwe500, g.w90p, g.mxAuto)}>Veuillez saisir votre adresse e-mail pour confirmer la suppression de votre compte</p>
								<input type="text" placeholder="Adresse e-mail" name="confirm_delete"
											 onChange={(event) => handleChangeUpdateProfile(event)}
											 className={Class(g.w90p, g.fwe500, g.mxAuto, g.brtr30, g.brtl30, g.brbr30, g.brbl30)} />
							</div>
						}
					</div>
					<div className={m.divider} />
					<div className={Class(g.dFlex, g.zi10, g.fwWrap, g.aiCenter, g.jcCenter, g.pb10, g.mb10, m.action)}>
						<button type="button" onClick={(event) => handleCancel(event)} className={Class(g.mt5, g.mb5, m.button, m.cancel)}>Annuler</button>
						{ showDelete ? <button type="button" onClick={(event) => handleDeleteProfil(event)} className={Class(g.ml10, m.button, m.confirm, cl.profile__delete__btnConfirm)}>Supprimer mon compte</button> : <button type="button" onClick={(event) => handleUpdateProfil(event)} className={Class(g.ml10, m.button, m.confirm)}>Enregistrer</button> }
					</div>
				</form>
			</Modal>
			<UploadAvatar show={show} handleClose={handleClose} />
		</section>
	)
}

export default Profile