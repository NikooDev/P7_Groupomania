import React, { useCallback, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { IComment } from '@Type/newsfeed'
import g from '@Asset/theme/global.module.scss'
import cl from './comments.module.scss'
import { AvatarPreloaded } from '@Core/avatar'
import { capitalize, isEmpty, relativeDate } from '@Helper/utils'
import { deleteComment, updateComments } from '@Action/comment.action'
import Class from 'classnames'
import { useComments } from '@Hook/useComment'
import { EditIcon, TrashIcon } from '@Core/icons/newsfeed'
import useUser from '@Hook/useUser'
import Tooltip from '@Core/tooltip'

/**
 * Composant représentant un commentaire
 * @param comment
 * @constructor
 */
const Comment = (comment: IComment) => {
	const [update, setUpdate] = useState<boolean>(false),
		[updateComment, setUpdateComment] = useState<any>({ comment_text: '', comment_id: '' }),
		textareaUpdateCommentRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>,
		{ refetchComment } = useComments(),
		{ user } = useUser()

	/**
	 * Valeur initiale dans le textarea
	 * Focus du champs
	 */
	useEffect(() => {
		if(update) {
			if(textareaUpdateCommentRef) {
				textareaUpdateCommentRef.current.value = comment.comment_text
				textareaUpdateCommentRef.current.focus()
			}
		}
	}, [update, textareaUpdateCommentRef])

	/**
	 * Quand l'utilisateur clique sur "Modifier"
	 * @param event
	 */
	const handleSetUpdate = async (event: React.MouseEvent) => {
		event.preventDefault()
		setUpdate(true)
		textareaUpdateCommentRef.current && textareaUpdateCommentRef.current.focus()
	}

	/**
	 * Modification du state
	 * @param event
	 */
	const handleChange = (event: React.ChangeEvent) => {
		event.preventDefault()
		const target = event.target as HTMLTextAreaElement

		setUpdateComment({ ...updateComment, comment_text: target.value })
	}

	/**
	 * Soumission du formulaire
	 */
	const handleUpdateSubmit = useCallback(async () => {
		if(isEmpty(updateComment.comment_text)) return

		if(updateComment.comment_id.length !== 0) {
			const res = await updateComments(updateComment)
			if(!res) {
				console.log('Une ou plusieurs données n\'ont pas été reçus par le serveur')
				return
			}

			if(res.ok) {
				await refetchComment()
				setUpdateComment({ ...updateComment, comment_text: '' })
				setUpdate(false)
			}
		}
	}, [updateComment])

	/**
	 * Insertion de l'id du commentaire dans le state
	 * Quand la touche Enter est appuyé => handleSubmit()
	 * @param event
	 */
	const handleUpdateEnter = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		const key = event.key

		setUpdateComment({ ...updateComment, comment_id: comment.id })

		if(key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			await handleUpdateSubmit()
		}
	}

	/**
	 * Suppression du formulaire de modification
	 * @param event
	 */
	const handleUpdateCancel = (event?: React.MouseEvent) => {
		event && event.preventDefault()
		setUpdate(false)
	}

	/**
	 * Quand la touche Escape est appuyé => handleUpdateCancel()
	 */
	useEffect(() => {
		document.addEventListener('keydown', (event) => {
			const key = event.key

			if(key === 'Escape') {
				handleUpdateCancel()
			}
		})
	}, [])

	/**
	 * Suppression du commentaire
	 * @param event
	 */
	const handleDeleteComment = async (event: React.MouseEvent) => {
		event.preventDefault()
		const res = await deleteComment(comment.id)

		if(res.ok) {
			await refetchComment()
		}
	}

	return (
		<div className={Class(g.dFlex, g.aiFlexStart, g.mb5)}>
			<div className={Class(g.mr5, cl.comments__wrapper, update ? cl.comments__mr2 : null)}>
				<AvatarPreloaded avatar_url={comment.avatar_url} user_id={comment.user_id} classname={g.mr5} classnameAvatarDefault={g.mr5} classnameLoader={Class(g.pl5, g.pb5, g.pr5, g.pt5)} colorLoader="#605699" height={36} width={36} />
			</div>
			<div className={Class(g.brtr15, g.brtl15, g.brbr15, g.brbl15, cl.comments__content, update ? g.w100p : null)}>
				<span className={Class(g.dFlex, g.fwe600, update ? g.mb5 : null)}>
					{ capitalize(comment.firstname)+' '+capitalize(comment.name) }
					{ user && user.id === comment.user_id && user.role !== 'admin' && (<>
						<Tooltip content="Modifier">
							<button className={Class(g.ml5, g.pRelative)} onClick={(event) => handleSetUpdate(event)}>
								<EditIcon height={15} width={15} />
							</button>
						</Tooltip>
						<Tooltip content="Supprimer">
							<button className={Class(g.ml5, g.pRelative)} onClick={(event) => handleDeleteComment(event)}>
								<TrashIcon height={15} width={15} />
							</button>
						</Tooltip>
					</>)}
					{ user && user.role === 'admin' && (<>
						<Tooltip content="Modifier">
							<button className={Class(g.ml5, g.pRelative)} onClick={(event) => handleSetUpdate(event)}>
								<EditIcon height={15} width={15} />
							</button>
						</Tooltip>
						<Tooltip content="Supprimer">
							<button className={Class(g.ml5, g.pRelative)} onClick={(event) => handleDeleteComment(event)}>
								<TrashIcon height={15} width={15} />
							</button>
						</Tooltip>
					</>)}
				</span>
				{ !update ? <p>{ comment.comment_text }</p> : <>
					<div className={g.dFlex}>
						<form method="post" className={g.w100p}>
							<TextareaAutosize  onKeyDown={(event) => handleUpdateEnter(event)} onChange={(event) => handleChange(event)} name="comment_Updatetext" minRows={0} ref={textareaUpdateCommentRef} placeholder="Écrivez un commentaire" className={Class(g.w100p, g.mb5, g.brtr15, g.brbr15, g.brbl15, g.brtl15, update ? cl.update : null)} />
						</form>
					</div>
				</> }
				<div className={Class(g.fwe500, cl.comments__content__time)}>{ capitalize(relativeDate(comment.created_at) as string) } { update && <> • Appuyez sur Échap pour <a href="/" onClick={(event) => handleUpdateCancel(event)}>annuler les modifications</a></>}</div>
			</div>
		</div>
	)
}

export default Comment