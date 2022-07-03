import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { IModal } from '@Type/core'
import g from '@Asset/theme/global.module.scss'
import cl from './modal.module.scss'
import { createPortal } from 'react-dom'
import withReactContent from 'sweetalert2-react-content'
import Class from 'classnames'

const ModalComponent = withReactContent(Swal)

/**
 * Gestionnaire de modales
 * @constructor
 */
const Modal = ({
	children,
	title,
	showConfirmButton,
	showCancelButton,
	cancelButtonText,
	confirmButtonText,
	allowOutsideClick,
	show,
	onClose,
	onInitialState,
	onConfirmed,
	classname }: IModal) => {
	const [container, setContainer] = useState<HTMLDivElement | null>(null)

	useEffect(() => {
		if(show) {
			ModalComponent.fire({
				title: title,
				showConfirmButton: showConfirmButton,
				showCancelButton: showCancelButton,
				focusConfirm: true,
				cancelButtonText: cancelButtonText,
				confirmButtonText: confirmButtonText,
				allowOutsideClick: allowOutsideClick,
				customClass: Class(classname),
				backdrop: true,
				showClass: { popup: cl.uploadSwal__showSwal },
				hideClass: { popup: cl.uploadSwal__hideSwal },
				html: <div className={g.pRelative} ref={(el) => setContainer(el)} />
			}).then((result) => {
				onClose && onClose()
				if(result.isConfirmed) {
					onConfirmed && onConfirmed()
					onInitialState && onInitialState()
				}
				if(result.dismiss === Swal.DismissReason.cancel) {
					onInitialState && onInitialState()
				}
			})
		}
	}, [show, onClose])

	return container ? createPortal(children, container) : null
}

export default Modal