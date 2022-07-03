import React from 'react'
import { IChildren } from '@Type/utils'
import cl from './container.module.scss'
import Class from 'classnames'

/**
 * Container responsive
 * @param children
 * @param classname
 * @constructor
 */
const Container = ({ children, classname }: IChildren) => {
	return (
		<div className={Class(cl.container, classname)}>
			{ children }
		</div>
	)
}

export default Container