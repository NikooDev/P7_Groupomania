import React, { useCallback, useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { IComment } from '@Type/newsfeed'
import g from '@Asset/theme/global.module.scss'
import cl from './comments.module.scss'
import { Avatar } from '@Core/avatar'
import { isEmpty } from '@Helper/utils'
import { postComment } from '@Action/comment.action'
import { useComments } from '@Hook/useComment'
import usePost from '@Hook/usePost'
import useUser from '@Hook/useUser'
import Comment from '@Users/newsfeed/comments/comment'
import Class from 'classnames'

interface ICommentProps {
	textareaRef: React.MutableRefObject<HTMLTextAreaElement>
	post_id: string | undefined
}

/**
 * Affiche la liste des commentaires
 * @param props
 * @constructor
 */
const Comments = (props: ICommentProps) => {
	const [comment, setComment] = useState<any>({ comment_text: '', post_id: '' }),
		{ refetchPost } = usePost(),
		{ data, refetchComment } = useComments(),
		{ user } = useUser()

	useEffect(() => {
		props.textareaRef && props.textareaRef.current.focus()
	}, [props.textareaRef])

	/**
	 * Modification du state
	 * @param event
	 */
	const handleChange = (event: React.ChangeEvent) => {
		event.preventDefault()
		const target = event.target as HTMLTextAreaElement

		setComment({ ...comment, comment_text: target.value })
	}

	/**
	 * Soumission du formulaire de commentaire
	 */
	const handleSubmit = useCallback(async () => {
		if(isEmpty(comment.comment_text) && isEmpty(comment.post_id)) return

		const res = await postComment(comment)
		if(!res) {
			console.log('Une ou plusieurs données n\'ont pas été reçus par le serveur')
			return
		}

		if(res.ok) {
			setComment({ post_id: '', comment_text: '' })
			await refetchComment()
			await refetchPost()
		}
	}, [comment])

	/**
	 * Insertion de l'id du post dans le state
	 * Quand la touche Enter est appuyé => handleSubmit()
	 * @param event
	 */
	const handleEnter = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		const key = event.key

		setComment({ ...comment, post_id: props.post_id })

		if(key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			await handleSubmit()
		}
	}

	return (
		<div className={Class(g.dFlex, g.fdColumn, g.pl10, g.pr10, g.pb5, g.pt5, cl.comments)}>
			{ data && data.filter((e: IComment) => e.post_id === props.post_id).length !== 0 &&
				<div className={Class(g.mb5, g.mt5)}>
					{ data && data.length !== 0 && data.filter((e: IComment) => e.post_id === props.post_id).map((comment: IComment, index: number) =>
						<Comment key={index} { ...comment } />
					)}
				</div>
			}
			<form className={Class(g.dInherit, g.w100p)}>
				<Avatar avatar_url={user?.avatar?.avatar_url} user_id={user?.id} classname={g.mr5} classnameAvatarDefault={g.mr5} classnameLoader={Class(g.pl5, g.pb5, g.pr5, g.pt5)} colorLoader="#605699" height={36} width={36} />
				<TextareaAutosize  onKeyDown={(event) => handleEnter(event)} onChange={(event) => handleChange(event)} name="comment_text" value={comment.comment_text} minRows={0} autoFocus={true} ref={props.textareaRef} placeholder="Écrivez un commentaire" className={Class(g.w100p, g.brtr15, g.brbr15, g.brbl15, g.brtl15)} />
			</form>
		</div>
	)
}

export default Comments