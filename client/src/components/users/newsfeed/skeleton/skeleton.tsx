import React from 'react'
import g from '@Asset/theme/global.module.scss'
import Skeleton from 'react-loading-skeleton'
import Class from 'classnames'
import 'react-loading-skeleton/dist/skeleton.css'

/**
 * Affiche un squelette de chargement des posts
 * @constructor
 */
const Skeletons = () => {
	return (
		<div className={Class(g.pt10, g.pl10, g.pr10, g.pb5)}>
			<Skeleton circle width={46} height={46} className={Class(g.mb10)} />
			<Skeleton className={Class(g.mb10)} />
			<Skeleton height={100} className={Class(g.mb10)} />
		</div>
	)
}

export default Skeletons