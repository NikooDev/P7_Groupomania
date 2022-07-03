import { useCallback, useState } from 'react'

const useModal = () => {
	const [show, setShow] = useState(false)

	const handleOpen = useCallback(() => setShow(true), [])
	const handleClose = useCallback(() => setShow(false), [])

	return {
		show, handleOpen, handleClose
	}
}

export default useModal