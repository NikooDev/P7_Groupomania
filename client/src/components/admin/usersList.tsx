import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import g from '@Asset/theme/global.module.scss'
import cl from './admin.module.scss'
import { useQuery } from 'react-query'
import { listUsers } from '@Action/user.action'
import { capitalize } from '@Helper/utils'
import { deleteUser } from '@Action/admin.action'
import { Avatar } from '@Core/avatar'
import { DeleteIcon } from '@Core/icons/menu'
import Class from 'classnames'
import Modal from '@Core/modals'

interface IState {
	user_id: string | null
}

const UsersList = () => {
	const [show, setShow] = useState(false),
		[userId, setUserId] = useState<IState>({ user_id: null }),
		{ data, status, refetch } = useQuery('listUsers', () => listUsers())

	const handleOpen = useCallback((event: React.MouseEvent, user_id: string) => {
		event.preventDefault()
		setUserId({ user_id: user_id })
		setShow(true)
	}, [])

	const handleClose = useCallback(() => setShow(false), [])

	const handleDeleteUser = async () => {
		if(userId && userId.user_id) {
			const res = await deleteUser(userId)
			if(res && res.ok) {
				await refetch()
				setUserId({ user_id: null })
			}
		}
	}

	return (
		<>
			<h2 className={Class(g.mb20, g.taCenter)}>Liste des utilisateurs</h2>
			<table border={1} className={Class(g.taCenter, cl.admin__table)}>
				<thead>
					<tr>
						<th className={g.brtl15}>Avatar</th>
						<th>Profil</th>
						<th>Nom complet</th>
						<th>Rôle</th>
						<th className={g.brtr15}>Actions</th>
					</tr>
				</thead>
				<tbody>
			{
				status === 'success' && [...data].map((v, index) => (
					<tr key={index} className={g.fwe500}>
						<td data-label="Avatar"><Avatar avatar_url={v.avatar_url} user_id={v.id} colorLoader="#605699" classname={Class(g.dFlex, g.mt5, g.mb5, g.mxAuto)} classnameLoader={Class(g.dFlex, g.mt5, g.mb5, g.mxAuto, g.pt5, g.pl5, g.pr5, g.pb5)} height={50} width={50} /></td>
						<td data-label="Profil"><Link href={'/'+v.username} passHref><a href={'/'+v.username}>Voir le profil</a></Link></td>
						<td data-label="Prénom / Nom" className={cl.admin__table__fullname}>{ capitalize(v.firstname)+' '+capitalize(v.name) }</td>
						<td data-label="Rôle">{ capitalize(v.role) }</td>
						<td data-label="Actions">{ v.role !== 'admin' && <a href="/" onClick={(event) => handleOpen(event, v.id)} className={Class(g.dFlex, g.w15, g.jcCenter, cl.admin__table__actions)}><DeleteIcon height={20} width={20} /></a> }</td>
					</tr>
				))
			}
				</tbody>
			</table>
			<Modal title="Supprimer un utilisateur" onConfirmed={handleDeleteUser} show={show} onClose={handleClose} cancelButtonText="Annuler" confirmButtonText="Confirmer" showCancelButton={true} showConfirmButton={true}>
				<p className={Class(g.fwe500, cl.post__actions__deleteMessage)}>Confirmation</p>
			</Modal>
		</>
	)
}

export default UsersList