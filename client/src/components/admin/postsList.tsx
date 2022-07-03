import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { IPost } from '@Type/newsfeed'
import g from '@Asset/theme/global.module.scss'
import m from '@Users/newsfeed/stream.module.scss'
import cl from '@Admin/admin.module.scss'
import { capitalize } from '@Helper/utils'
import { DeleteIcon } from '@Core/icons/menu'
import { useInView } from 'react-intersection-observer'
import { deletePost } from '@Action/admin.action'
import usePost from '@Hook/usePost'
import Loader from '@Core/loader'
import Class from 'classnames'
import Modal from '@Core/modals'

interface IState {
	post_id: string | null
}

const PostsList = () => {
	const [show, setShow] = useState(false),
		[postId, setPostId] = useState<IState>({ post_id: null }),
		{ dataPost, status, isFetchingNextPage, fetchNextPage, refetchPost } = usePost(),
		{ ref, inView } = useInView()

	useEffect(() => {
		if(inView) fetchNextPage()
	}, [inView])

	const handleOpen = useCallback((event: React.MouseEvent, post_id: string) => {
		event.preventDefault()
		setPostId({ post_id: post_id })
		setShow(true)
	}, [])

	const handleClose = useCallback(() => setShow(false), [])

	const handleDeletePost = async () => {
		if(postId && postId.post_id) {
			const res = await deletePost(postId)
			if(res && res.ok) {
				await refetchPost()
				setPostId({ post_id: null })
			}
		}
	}

	return (
		<>
			<h2 className={Class(g.mb20, g.taCenter)}>Liste des publications</h2>
			<table border={1} className={Class(g.taCenter, cl.admin__table)}>
				<thead>
				<tr>
					<th className={Class(g.brtl15, g.w20p)}>Créateur</th>
					<th>Contenu</th>
					<th className={Class(g.brtr15, g.w10p)}>Actions</th>
				</tr>
				</thead>
				<tbody>
				{
					status === 'success' && dataPost && dataPost.pages.map(page => page && page.data.map((v: IPost, index: number) => (
						<tr key={index} className={g.fwe500}>
							<td data-label="Créateur"><Link href={'/'+v.username} passHref><a href={'/'+v.username}>{ capitalize(v.firstname)+' '+capitalize(v.name) }</a></Link></td>
							<td data-label="Contenu">
								<div className={Class(g.dFlex, g.fdColumn)}>
									<div className={cl.admin__table__content}>
										{ v.post_text }
									</div>
									{ v.photo_url && <div className={g.mt5}>
										<img src={process.env.NEXT_PUBLIC_PHOTO_PATH+'/'+v.user_id+'/'+v.photo_url} width={500} className={Class(g.mxAuto, g.brtr15, g.brbr15, g.brtl15, g.brbl15, cl.admin__table__photo)} alt={'photo '+v.photo_title} />
									</div> }
								</div>
							</td>
							<td data-label="Actions"><a href="/" onClick={(event) => handleOpen(event, v.id)} className={Class(g.dFlex, g.w15, g.jcCenter, cl.admin__table__actions)}><DeleteIcon height={20} width={20} /></a></td>
						</tr>
					)))
				}
				</tbody>
			</table>
			<Modal title="Supprimer une publication" onConfirmed={handleDeletePost} show={show} onClose={handleClose} cancelButtonText="Annuler" confirmButtonText="Confirmer" showCancelButton={true} showConfirmButton={true}>
				<p className={Class(g.fwe500, cl.post__actions__deleteMessage)}>Confirmation</p>
			</Modal>
			<div ref={ref} className={Class(g.dFlex, g.jcCenter, g.pRelative, g.zi50, g.mb10, g.mt50, m.masonry__mlm60)}>
				{ isFetchingNextPage &&
					<div className={Class(g.dFlex, g.pt5, g.pl5, g.pb5, g.pr5, g.pAbsolute, g.br100, g.b10, m.masonry__load)}>
						<Loader height={46} width={46} classname={g.dFlex} color="#605699" />
					</div>
				}
			</div>
		</>
	)
}

export default PostsList