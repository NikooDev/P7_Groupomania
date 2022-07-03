import { CSSProperties } from 'react'

export const toasterStyle: CSSProperties = {
	top: '5.1rem'
}

export const largeNotif: CSSProperties = {
	padding: '.85rem 1rem'
}

export const toastbarAnimIn = 'fadeInRight .3s cubic-bezier(0.65, 0, 0.35, 1) both'
export const toastbarAnimOut = 'fadeOutRight .3s cubic-bezier(0.65, 0, 0.35, 1) both'

/**
 * Styles d'alerte globale
 */
export const alertGlobalStyle: CSSProperties = {
	fontFamily: 'Raleway, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
	wordBreak: 'break-word',
	maxWidth: '40rem',
}

/**
 * Styles pour AlertInfo()
 */
export const alertInfoStyle: CSSProperties = {
	...alertGlobalStyle,
	backgroundColor: '#6c758a',
	fontWeight: 500,
	color: '#fff'
}

/**
 * Styles pour AlertSuccess()
 */
export const alertSuccessStyle: CSSProperties = {
	...alertGlobalStyle,
	backgroundColor: '#5ab14c',
	fontWeight: 600,
	color: '#fff'
}

/**
 * Styles pour AlertError()
 */
export const alertErrorStyle: CSSProperties = {
	...alertGlobalStyle,
	backgroundColor: '#f06060',
	fontWeight: 600,
	color: '#fff'
}

export const alertUserStyle: CSSProperties = {
	...alertGlobalStyle
}