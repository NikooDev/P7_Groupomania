import React, { useCallback, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Swal from 'sweetalert2'
import Compressor from 'compressorjs'
import { v4 as uuid } from 'uuid'
import { largeNotif } from '@Core/notifs/styles'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { IPostCreate } from '@Type/newsfeed'
import g from '@Asset/theme/global.module.scss'
import m from '@Core/modals/modal.module.scss'
import cl from './composer.module.scss'
import { DeleteIcon, UploadIcon } from '@Core/icons/menu'
import { Avatar } from '@Core/avatar'
import { Notif } from '@Core/notifs'
import { PostAction } from '@Action/newsfeed.action'
import { isEmpty } from '@Helper/utils'
import { convertFile, getBase64FromUrl } from '@Helper/convertFile'
import { useComments } from '@Hook/useComment'
import useUser from '@Hook/useUser'
import usePost from '@Hook/usePost'
import Class from 'classnames'
import Tooltip from '@Core/tooltip'
import Loader from '@Core/loader'
import 'overlayscrollbars/css/OverlayScrollbars.css'

interface IComposerProps {
	updatePost?: boolean | undefined
	value?: any
}

/**
 * Formulaire de création / modification de posts
 * @param updatePost
 * @param value
 * @constructor
 */
const Composer = ({ updatePost, value }: IComposerProps) => {
	const [post, setPost] = useState<IPostCreate>({ user_id: '', post_text: '', photo: null, photo_title: undefined }),
		[extention, setExtention] = useState<string>(''),
		[loadingForm, setLoadingForm] = useState<boolean>(false),
		[loadingUpload, setLoadingUpload] = useState<boolean>(false),
		[updateChange, setUpdateChange] = useState<boolean>(false),
		[imgDeleted, setImgDeleted] = useState<'true' | 'false'>('false'),
		[updatePhotoChange, setUpdatePhotoChange] = useState<boolean>(false),
		[readerImg, setReaderImg] = useState<string | ArrayBuffer | null>(''),
		fileRef = useRef() as React.MutableRefObject<HTMLInputElement>,
		textareaRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>,
		{ user, loading } = useUser(),
		{ refetchComment } = useComments(),
		{ refetchPost } = usePost()

	/**
	 * Modification d'un post
	 * Récupèration des valeurs initiales
	 * Mise à jour du state
	 */
	const handleUpdateValue = useCallback(async () => {
		if(value && !updateChange) {
			let postFile
			textareaRef && textareaRef.current.focus()
			if(value.photo_url && !updatePhotoChange) {
				const file = await getBase64FromUrl(process.env.NEXT_PUBLIC_PHOTO_PATH+value.user_id+'/'+value.photo_url),
					ext = value.photo_url.split('.').pop(),
					filename = value.photo_url.split('.').shift()

				setUpdatePhotoChange(true)
				setImgDeleted('false')
				setReaderImg(file)
				convertFile(readerImg as string, filename, ext).then((newFile) => postFile = newFile)
			}
			value.user_id && setPost({ ...post, post_text: value.post_text ? value.post_text : undefined, user_id: value.user_id, photo: postFile ? postFile : null, photo_title: value.photo_title })
		}
	}, [value, textareaRef, updateChange, updatePhotoChange])

	/**
	 * Si modification du post => handleUpdateValue()
	 */
	useEffect(() => {
		updatePost && handleUpdateValue()
	}, [updatePost, handleUpdateValue])

	/**
	 * Insertion de l'id de l'utilisateur dans le state au montage du formulaire
	 */
	useEffect(() => {
		if(user && user.id) setPost({ ...post, user_id: user.id })
	}, [user])

	/**
	 * Simulation du click sur l'input file
	 * @param event
	 */
	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault()
		fileRef && fileRef.current.click()
	}

	/**
	 * Quand les inputs changent
	 * @param event
	 */
	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		const target = event.target as HTMLTextAreaElement
		setPost({ ...post, [target.name]: target.value })
	}

	/**
	 * Quand input file change
	 * @param event
	 */
	const handleFileChange = (event: React.ChangeEvent) => {
		event.preventDefault()
		const reader = new FileReader(), target = event.target as HTMLInputElement
		let files: any = target.files
		if(!files[0]) return
		setLoadingUpload(true)

		// Si le poid de la photo > à ~ 1.5Mo
		if(files[0].size > 1521808) {
			Notif({ id: 'uploadError', type: 'error', message: 'Votre photo est trop volumineuse' })
			setReaderImg('')
			setLoadingUpload(false)
			return
		}
		// Compression et stockage de la photo dans le state avec compressorjs
		new Compressor(files[0], {
			quality: .7,
			success (file: File | Blob) {
				setExtention(files[0].name.split('.').pop())
				setTimeout(() => {
					file && reader.readAsDataURL(file)
					reader.onload = (e) => setReaderImg(e.target?.result as string)
				}, 2000)
			}
		})
	}

	/**
	 * Si readerImg contient un fichier =>
	 * Conversion base64 vers blob
	 * Stockage du nouveau fichier dans le state
 	 */
	useEffect(() => {
		readerImg && convertFile(readerImg as string, uuid(), extention).then((newFile) => {
			setPost({ ...post, photo: newFile })
		})
	}, [readerImg])

	/**
	 * Lorsque la photo est chargée => suppression du spinner d'upload
	 */
	const handleImgLoad = () => setLoadingUpload(false)

	/**
	 * Suppression de la photo
	 * @param event
	 */
	const handleDeleteImgReader = (event: React.MouseEvent) => {
		event.preventDefault()
		setImgDeleted('true')
		setReaderImg('')
	}

	/**
	 * Remise à zéro du formulaire
	 */
	const handleResetForm = () => {
		setReaderImg('')
		setLoadingForm(false)
		setPost({ ...post, post_text: '', photo_title: '', photo: null })
	}

	/**
	 * Soumission du formulaire
	 * Si modification => envoie de l'id du post avec le state mis à jour avec handleUpdateValue()
	 * Si création => envoie du post
	 * @param event
	 */
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		post.post_text && setPost({ ...post, post_text: post.post_text.replace(/\n\s*\n\s*\n/g, '\n\n').trim() })

		if(isEmpty(post.post_text) && isEmpty(readerImg as string)) {
			Notif({ id: 'postError', type: 'error', customStyle: largeNotif, message: 'Vous devriez ajouter du texte ou une photo' })
			return
		}
		if(isEmpty(post.user_id)) {
			Notif({ id: 'postError', type: 'error', customStyle: largeNotif, message: 'Une erreur interne est survenue' })
			return
		}
		if(post.post_text && post.post_text.length > 1500) {
			Notif({ id: 'postError', type: 'error', customStyle: largeNotif, message: 'Le texte de la publication doit comporter 1500 caractères maximum' })
			return
		}

		setLoadingForm(true)
		const isPublished = updatePost && value.id ? await PostAction(post, value.id, imgDeleted) : await PostAction(post)
		if(!isPublished) {
			console.log('Une ou plusieurs données n\'ont pas été reçus par le serveur')
			setLoadingForm(false)
			return
		}

		if(isPublished.ok) {
			await refetchComment()
			await refetchPost()
			Notif({ id: 'postSuccess', type: 'success', message: !updatePost ? 'Votre publication a bien été créée' : 'Votre publication a bien été modifiée' })
			updatePost && setUpdateChange(true)
			updatePost && Swal.close()
			handleResetForm()
		}
	}

	return (
		<form method="post" encType="multipart/form-data" onSubmit={(event) => handleSubmit(event)} className={Class(g.dFlex, g.fdColumn, g.pt10, g.pRelative, cl.composer)}>
			{ loadingForm && <div className={Class(g.dFlex, g.jcCenter, g.aiCenter, g.pAbsolute, g.h100p, g.w100p, g.t0)}>
				<div className={Class(g.pAbsolute, g.t0, !updatePost ? [g.brtl15, g.brtr15, g.brbl15, g.brbr15] : [g.brbl15, g.brbr15], g.h100p, g.w100p, g.zi50, g.op5, cl.composer__overlay)} />
				<div className={Class(g.pAbsolute, g.zi50, g.op4, g.br100, g.pt20, g.pl20, g.pb20, g.pr20, cl.composer__overlay)} />
				<Loader height={55} width={55} strokeWidth={2} color="#fff" classname={Class(g.dFlex)} />
			</div> }
			<input type="file" accept="image/.jpg,.jpeg,.png" name="file" onChange={(event) => handleFileChange(event)} className={g.dNone} ref={fileRef} />
			<div className={Class(g.pRelative, g.h100p, cl.composer__wrapper)}>
				<div className={Class(g.dFlex, g.aiCenter, g.mb10, cl.composer__avatar)}>
					<Avatar avatar_url={user?.avatar?.avatar_url} user_id={user?.id} classname={g.ml10} classnameAvatarDefault={Class(g.ml10)} classnameLoader={Class(g.pl5, g.pb5, g.pr5, g.pt5)} colorLoader="#605699" height={46} width={46} />
					<span className={Class(g.fwe600, g.ml5, cl.composer__title)}>{ updatePost ? 'Modifiez' : 'Créez' } votre publication</span>
				</div>
				<OverlayScrollbarsComponent className={Class(g.w100p, g.h100p, cl.composer__scrollbar)}>
					<TextareaAutosize minRows={2} ref={textareaRef} value={post.post_text} maxLength={1500} onChange={(event) => handleChange(event)} name="post_text" placeholder={updatePost ? 'Ajouter du texte' : 'Quoi de neuf...'} className={Class(g.pl10, g.pr20, g.ovHidden, g.w100p, cl.composer__textarea)} />
				</OverlayScrollbarsComponent>
			</div>
			{ readerImg && <div className={Class(g.w100p, g.mt10, g.mxAuto, g.ovHidden, cl.composer__upload)}>
				<OverlayScrollbarsComponent className={cl.composer__upload__scrollbar} options={{ updateOnLoad: ['div'] }}>
					<div>
						<div className={Class(g.dFlex, g.aiCenter, g.w100p, g.pl5, g.pr5, g.h25, g.t0, g.zi10, g.pAbsolute, cl.composer__upload__description)}>
							<input type="text" defaultValue={post.photo_title} autoComplete="off" onChange={(event) => handleChange(event)} name="photo_title" placeholder="Ajouter une description" maxLength={50} className={Class(g.w100p, g.fwe500)} alt="photo-title" />
						</div>
						<div className={Class(g.dFlex, g.pAbsolute, g.zi10, g.t35, g.l10, cl.composer__upload__actions)}>
							<button aria-label="Supprimer la photo" onClick={(event) => handleDeleteImgReader(event)}>
								<DeleteIcon height={30} width={30} />
							</button>
						</div>
						<img src={readerImg as string} className={Class(g.dFlex, g.w100p, g.h100p)} onLoad={handleImgLoad} alt="photo" />
					</div>
				</OverlayScrollbarsComponent>
			</div> }
			<div className={cl.composer__divider} />
			<div className={Class(g.dFlex, g.aiCenter, g.h45, g.pt5, cl.composer__actions)}>
				<div className={Class(g.mrAuto, g.pl15)}>
					{ loadingUpload ? <Loader height={30} width={30} color="#605699" classname={g.dFlex} /> :
						<Tooltip content="Importer une photo" placement="bottom-start" offset={[-20, 10]}>
							<a href="/" onClick={(event) => handleClick(event)} className={g.dFlex}>
								<UploadIcon height={25} width={25} />
							</a>
						</Tooltip> }
				</div>
				<div className={Class(g.dFlex, g.pr15)}>
					{ updatePost && <button type="button" onClick={() => Swal.close()} className={Class(g.mr10, m.button, m.cancel)}>Annuler</button> }
					<button type="submit" disabled={loading} className={Class(g.dFlex, g.aiCenter, g.jcCenter, g.pl10, g.pr10, g.h25, cl.composer__actions__submit, loadingForm && !updatePost ? cl.load : g.w70, loadingForm && updatePost && cl.updateLoad)}>{ loadingForm ? 'Publication...' : updatePost && updatePost ? 'Modifier' : 'Publier' }</button>
				</div>
			</div>
		</form>
	)
}

export default Composer