import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { v4 as uuid } from 'uuid'
import { Cropper } from 'react-cropper'
import g from '@Asset/theme/global.module.scss'
import cl from '@Core/modals/modal.module.scss'
import { IModalControl } from '@Type/core'
import { AvatarAction } from '@Action/upload.action'
import { convertFile } from '@Helper/convertFile'
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive'
import useUser from '@Hook/useUser'
import Modal from '@Core/modals/modal'
import Class from 'classnames'
import Loader from '@Core/loader'
import usePost from '@Hook/usePost'

/**
 * Upload de l'avatar
 * @constructor
 */
const UploadAvatar = ({ show, handleClose }: IModalControl) => {
	const [loadingCrop, setLoadingCrop] = useState<boolean>(false),
		[crop, setCrop] = useState({ file: '', dataUrl: '', ext: '' }),
		[cropper, setCropper] = useState<any>(),
		[loading, setLoading] = useState<boolean>(true),
		[readerImg, setReaderImg] = useState<string | ArrayBuffer>(''),
		[change, setChange] = useState<boolean>(false),
		[error, setError] = useState<string>(''),
		[zoom, setZoom] = useState<number>(0.6),
		fileRef = useRef() as React.MutableRefObject<HTMLInputElement>,
		cropperRef = useRef<HTMLImageElement>(null),
		router = useRouter(),
		{ refetchPost } = usePost(),
		{ mutate } = useUser()

	const isMobile = useMediaQuery({ query: `(max-width: 35.625em)` })

	const handleClick = () => fileRef && fileRef.current.click()

	const handleInitialState = () => setTimeout(() => handleInitial(), 350)

	const handleInitial = () => {
		setReaderImg('')
		setCrop({ file: '', dataUrl: '', ext: '' })
		setLoading(true)
		setLoadingCrop(false)
		setChange(false)
		setError('')
		setZoom(0.6)
	}

	const handleZoom = (event: React.ChangeEvent) => {
		const target = event.target as HTMLInputElement
		setZoom(Number(target.value))
	}

	const handleChange = (event: React.ChangeEvent) => {
		event.preventDefault()
		const reader = new FileReader(), target = event.target as HTMLInputElement
		let files: any = target.files

		if(files[0]) {
			if(files[0].size > 1521808) {
				setError('Votre photo est trop volumineuse')
				setChange(false)
				return
			}
			setChange(true)
			setTimeout(() => {
				setLoading(false)
				reader.readAsDataURL(files[0])
				setCrop({ ...crop, file: files[0].name, ext: files[0].name.split('.').pop() })
				reader.onload = (e) => setReaderImg(e.target?.result as string)
			}, 2000)
		}
	}

	const handleBack = (event: React.MouseEvent) => {
		event.preventDefault()
		handleInitial()
	}

	const handleCancel = (event: React.MouseEvent) => {
		event.preventDefault()
		Swal.clickCancel()
	}

	const handleSubmit = (event: React.MouseEvent) => {
		event.preventDefault()
		if(typeof cropper !== 'undefined') {
			setCrop({ ...crop, dataUrl: cropper.getCroppedCanvas().toDataURL() })
			setLoadingCrop(true)
			setTimeout(() => {
				router.replace(router.asPath)
				Swal.clickConfirm()
				refetchPost()
			}, 500)
		}
	}

	useEffect(() => {
		if(crop.dataUrl.length > 0) {
			convertFile(crop.dataUrl, uuid(), crop.ext).then(async (newFile) => {
				const avatarUpdated = await AvatarAction(newFile)
				avatarUpdated && await mutate()
			})
		}
	}, [crop, mutate])

	return (
		<Modal title="Modifier votre avatar" classname={Class(cl.uploadSwal, cl.large)} show={show} onClose={handleClose} onInitialState={handleInitialState} allowOutsideClick={false} showCancelButton={false}>
			<form method="post" encType="multipart/form-data" className={Class(g.mt5, g.mb5, g.ovHidden)}>
				{ !change && (<>
					<button type="button" onClick={handleClick} className={Class(cl.confirm, 'swal2-styled')} autoFocus>Importer une photo</button>
					<p className={Class(g.mt5, g.fwe500, cl.errorMsg)}>{ error }</p>
				</>)}
				{ change && (<>
					<div className={Class(g.dFlex, g.aiCenter, g.fdColumn, g.jcCenter, g.ovHidden)} style={isMobile ? { height: '100%', width: '100%' } : { height: '500px', width: '500px' }}>
						{ loading ? (<Loader height={100} width={100} color="#605699" classname={cl.uploadSwal__loader} />) : (<>
							{ loadingCrop && (
								<div style={{ backgroundColor: 'rgba(255, 255, 255, .5)', position: 'fixed', display: 'flex', height: '500px', width: '500px', zIndex: 999 }}>
									<div className={Class(g.dFlex, g.aiCenter, g.fdColumn, g.jcCenter, g.ovHidden)} style={{ height: '500px', width: '500px' }}>
										<Loader height={100} width={100} color="#605699" classname={cl.uploadSwal__loader__uploaded} />
									</div>
								</div>) }
							<Cropper
								background={false} responsive={true} viewMode={3} rotatable={false} zoomOnWheel={false}
								minCropBoxWidth={isMobile ? 350 : 300} minCropBoxHeight={isMobile ? 350 : 300} minContainerHeight={isMobile ? 350 : 500} minContainerWidth={isMobile ? 350 : 300}
								minCanvasWidth={isMobile ? 350 : 300} minCanvasHeight={isMobile ? 350 : 300} checkOrientation={false} toggleDragModeOnDblclick={false}
								autoCropArea={1} dragMode="move" movable={true} cropBoxMovable={false} cropBoxResizable={false}
								initialAspectRatio={1} center={false} guides={false} src={readerImg as string} zoomTo={zoom}
								style={isMobile ? { height: '370px', width: '370px' } : { height: '500px', width: '500px' }} onInitialized={(instance) => setCropper(instance)} ref={cropperRef} />
						</>)}
					</div>
				</>)}
				<input type="file" ref={fileRef} onChange={(event) => handleChange(event)} accept="image/.jpg,.jpeg,.png" name="file" className={g.dNone} />
				{ change ? <div className={Class(g.ovHidden, g.mt5)} style={{ height: '2rem' }}>
					{ change && !loading &&<input type="range" step={0.01} min={0.6} max={2} defaultValue={zoom} onChange={(event) => handleZoom(event)} className={Class(g.brtl30, g.brtr30, g.brbl30, g.brbr30)} style={{ width: '60%', backgroundColor: '#c3c8ce', height: '4px' }} /> }
				</div> : <></> }
				<div className={cl.divider} />
				<div className={Class(g.dFlex, g.zi10, g.fwWrap, g.aiCenter, g.jcCenter, g.px0, cl.action)}>
					{ change && <button type="button" onClick={(event) => handleBack(event)} className={Class(cl.button, cl.cancel, cl.back)}>Retour</button> }
					<button type="button" onClick={(event) => handleCancel(event)} className={Class(g.mt5, g.mb5, cl.button, cl.cancel)}>Annuler</button>
					{ change && <button type="button" autoFocus onClick={(event) => handleSubmit(event)} className={Class(g.ml10, cl.button, cl.confirm)}>Enregistrer</button> }
				</div>
			</form>
		</Modal>
	)
}

export default UploadAvatar