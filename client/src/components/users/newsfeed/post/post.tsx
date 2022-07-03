import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { largeNotif } from '@Core/notifs/styles'
import { ControlledMenu, MenuItem } from '@szhsin/react-menu'
import { IComment, IPost } from '@Type/newsfeed'
import g from '@Asset/theme/global.module.scss'
import d from '@Users/dropdown/dropdown.module.scss'
import m from '@Core/modals/modal.module.scss'
import cl from './post.module.scss'
import { CommentIcon, LikedIcon, LikeIcon, ReplyIcon } from '@Core/icons/newsfeed'
import { AvatarPreloaded } from '@Core/avatar'
import { DotsIcon } from '@Core/icons/menu'
import { Notif } from '@Core/notifs'
import { capitalize, relativeDate } from '@Helper/utils'
import { deletePost, likePost } from '@Action/newsfeed.action'
import { getCookie } from '@Helper/cookie'
import { useMediaQuery } from 'react-responsive'
import { useMenuState } from '@szhsin/react-menu'
import { useComments } from '@Hook/useComment'
import useUser from '@Hook/useUser'
import usePost from '@Hook/usePost'
import useModal from '@Hook/useModal'
import Class from 'classnames'
import Tooltip from '@Core/tooltip'
import Loader from '@Core/loader'
import Modal from '@Core/modals'
import Composer from '@Users/newsfeed/composer'
import Comments from '@Users/newsfeed/comments'

/**
 * Composant représentant un post
 * @constructor
 */
const Post = (post: IPost) => {
	const [loadLike, setLoadLike] = useState<boolean>(false),
		[updateShow, setUpdateShow] = useState<boolean>(false),
		[showComment, setShowComment] = useState<boolean>(false),
		[countComments, setCountComments] = useState<number>(),
		[ menuProps, toggleMenu ] = useMenuState({ transition: true }),
		{ data, status, refetchComment } = useComments(),
		{ show, handleClose, handleOpen } = useModal(),
		{ user, loading } = useUser(),
		{ refetchPost } = usePost(),
		textareaCommentRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>,
		btnMenuRef = useRef(null),
		breakpoint = getCookie('breakpointCols'),
		isIcon = useMediaQuery({ query: '(max-width: 1420px)' })

	/**
	 * Ouverture et fermeture de la modale de modification du post
	 */
	const handleUpdateOpen = useCallback(() => setUpdateShow(true), [])
	const handleUpdateClose = useCallback(() => setUpdateShow(false), [])

	/**
	 * Récupération et affichage des commentaires
	 */
	const handleOpenComment = async (event: React.MouseEvent) => {
		event.preventDefault()
		const target = event.currentTarget as HTMLAnchorElement
		scroll({
			top: target.offsetTop - 73,
			behavior: 'smooth'
		})
		setShowComment(true)
		await refetchPost()
		await refetchComment()
	}

	/**
	 * Envoi du like / dislike
	 * @param event
	 */
	const handleToggleLike = async (event: React.MouseEvent) => {
		event.preventDefault()
		setLoadLike(true)
		await likePost(post.id)
		await refetchPost()
		setLoadLike(false)
	}

	/**
	 * Suppression d'un post
	 * @param id
	 */
	const handleDeletePost = async (id: string) => {
		const res = await deletePost(id)
		if(!res) {
			console.log('Une ou plusieurs données n\'ont pas été reçus par le serveur')
			return
		}

		if(res.ok) {
			setShowComment(false)
			await refetchComment()
			await refetchPost()
			Notif({ id: 'successDeletePost', type: 'success', customStyle: largeNotif, message: res.message })
		}
	}

	/**
	 * Somme des commentaires par post
	 */
	useEffect(() => {
		if(status === 'success') {
			const count = [...data.filter((e: IComment) => e.post_id === post.id)].length
			setCountComments(count)
		}
	}, [status, data, post])

	return (
		<div className={Class(g.pt10, cl.post)}>
			<div className={Class(g.dFlex, g.aiCenter, g.ml10, g.mr10, g.mb10, cl.post__header)}>
				<Link href={post ? '/'+post.username : '/home'}>
					<a href={post ? '/'+post.username : '/home'} className={Class(g.dFlex, cl.post__avatar)}>
						<AvatarPreloaded avatar_url={post.avatar_url} user_id={post.user_id} colorLoader="#605699" classnameLoader={Class(g.pt5, g.pl5, g.pb5, g.pr5)} height={46} width={46} />
					</a>
				</Link>
				<div className={Class(g.dFlex, g.fdColumn, g.ml5, cl.post__infos)}>
					<Link href={post ? '/'+post.username : '/home'}>
						<a href={post ? '/'+post.username : '/home'} className={Class(g.dFlex)}>
							<span className={Class(g.fwe600)}>{ capitalize(post.firstname)+' '+capitalize(post.name) }</span>
						</a>
					</Link>
					<span className={cl.post__infos__time}>{ capitalize(relativeDate(post.created_at) as string) }</span>
				</div>
				<div className={Class(g.mlAuto, g.mr5)}>
					<Tooltip content="Actions" placement="top" offset={[0, 10]}>
						<button ref={btnMenuRef} onClick={() => toggleMenu(true)} className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.br100, g.pt5, g.pl5, g.pr5, g.pb5, cl.post__actions, menuProps.state === 'open' ? cl.post__actions__active : null)}>
							<DotsIcon height={25} width={25} />
						</button>
					</Tooltip>
					<ControlledMenu {...menuProps}  onClose={() => toggleMenu(false)} anchorRef={btnMenuRef} arrow={true} offsetY={4} offsetX={15} align="end" menuClassName={Class(g.brtl15, g.brtr15, g.brbl15, g.brbr15, g.pt10, g.pb10, g.pl0, g.pr0, d.dropdown, cl.post__dropdown)}>
						<ul className={cl.post__actions__items}>
							{ loading && <Loader height={20} width={20} color="#605699" /> }
							{
								user && user.id === post.user_id || user && user.role === 'admin' ? (<>
									<MenuItem onClick={handleUpdateOpen} className={Class(g.dFlex, g.pl10, g.pt0, g.pb0, g.pr10, g.fwe600)}>Modifier la publication</MenuItem>
									<MenuItem onClick={handleOpen} className={Class(g.dFlex, g.pl10, g.pt0, g.pb0, g.pr10, g.fwe600)}>Supprimer</MenuItem>
								</>) : (
									<MenuItem className={Class(g.dFlex, g.pl10, g.pt0, g.pb0, g.pr10, g.fwe600)}>Signaler</MenuItem>
								)
							}
						</ul>
					</ControlledMenu>
					<Modal title="Modifier" show={updateShow} onClose={handleUpdateClose} classname={m.uploadSwal} cancelButtonText="Annuler" showCancelButton={false}>
						<Composer updatePost={true} value={post} />
					</Modal>
					<Modal title="Supprimer" allowOutsideClick show={show} onClose={handleClose} classname={m.uploadSwal} onConfirmed={() => handleDeletePost(post.id)} cancelButtonText="Annuler" confirmButtonText="Supprimer" showCancelButton={true} showConfirmButton={true}>
						<p className={Class(g.fwe500, cl.post__actions__deleteMessage)}>Voulez-vous vraiment supprimer cette publication ?</p>
					</Modal>
				</div>
			</div>
			<div className={Class(g.pl10, g.pr10, cl.post__text)}>
				{ post.post_text }
			</div>
			{ post.photo_url &&
				<div className={Class(g.dFlex, g.pRelative, g.mt10, g.ovHidden, cl.post__photo)}>
					<img src={process.env.NEXT_PUBLIC_PHOTO_PATH+'/'+post.user_id+'/'+post.photo_url} className={Class(g.mxAuto, cl.post__photo)} alt={'photo '+post.photo_title} />
					{ post.photo_title && <span className={Class(g.dFlex, g.aiCenter, g.pAbsolute, g.b0, g.h30, g.w100p, g.fwe500, g.pl10, cl.post__photo__title)}>{ post.photo_title }</span> }
				</div>
			}
			<div className={cl.post__divider} />
			<div className={Class(g.dFlex, g.jcSpaceAround, g.aiCenter, g.pb5, g.pl5, g.pr5, cl.post__feedback)}>
				<a href="/" onClick={(event) => handleToggleLike(event)} className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.pt5, g.pl5, g.pb5, g.pr5, g.w100p, g.fwe600, user && post.users_liked?.includes(user.id) ? cl.post__feedback__filled : null /* Avec conditions cl.post__feedback__filled, cl.post__feedback__svgLoad*/)}>
					{ loading || loadLike ? <Loader height={22} width={22} classname={Class(g.dFlex, isIcon || breakpoint === '3' ? null : g.mr5)} strokeWidth={4} color="#605699" /> : user && post.users_liked?.includes(user.id) ? <LikedIcon height={22} width={22} classname={Class(cl.svgLike, isIcon || breakpoint === '3' ? null : g.mr5)} /> : <LikeIcon height={22} width={22} classname={Class(cl.svgLike, isIcon || breakpoint === '3' ? null : g.mr5)} /> }
					{ isIcon || breakpoint === '3' ? '' : 'J\'aime' }{ post.users_liked?.length === 0 ? '' : <span className={g.ml5}>{ post.users_liked?.length }</span> }
				</a>
				<a href="/" onClick={(event) => handleOpenComment(event)} className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.pt5, g.pl5, g.pb5, g.pr5, g.w100p, g.fwe600)}>
					<CommentIcon height={22} width={22} classname={Class(isIcon || breakpoint === '3' ? null : g.mr5)} />
					{ isIcon || breakpoint === '3' ? '' : 'Commenter' }{ countComments === 0 ? '' : <span className={g.ml5}>{ countComments }</span> }
				</a>
				<a href="#" className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.pt5, g.pl5, g.pb5, g.pr5, g.w100p, g.fwe600)}>
					<ReplyIcon height={22} width={22} classname={Class(isIcon || breakpoint === '3' ? null : g.mr5)} />
					{ isIcon || breakpoint === '3' ? '' : 'Partager' }
				</a>
			</div>
			<div className={Class(cl.post__comments)}>
				{ status === 'success' && showComment && <Comments textareaRef={textareaCommentRef} post_id={post.id} /> }
			</div>
		</div>
	)
}

export default Post