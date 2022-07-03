import React from 'react'
import { ILoader } from '@Type/core'
import cl from './loader.module.scss'
import Class from 'classnames'

/**
 * Affiche un spinner
 * @param height
 * @param width
 * @param color
 * @param strokeWidth
 * @param classname
 * @constructor
 */
const Loader: React.FC<ILoader> = ({
	height,
	width,
	color,
	strokeWidth = 3,
	classname }) => {
	return (
		<span className={cl.loader}>
			<svg viewBox="25 25 50 50" height={height} width={width} className={Class(classname)}>
				<circle className="path" cx="50" cy="50" r="20" fill="none" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10"/>
			</svg>
		</span>
	)
}

export default Loader