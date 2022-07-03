import React, { useEffect } from 'react'
import Masonry from 'react-masonry-css'
import { INewsfeedProps, IPost } from '@Type/newsfeed'
import g from '@Asset/theme/global.module.scss'
import cl from './stream.module.scss'
import { useInView } from 'react-intersection-observer'
import { useSettingsDispatch } from '@Context/settings.context'
import Loader from '@Core/loader'
import Class from 'classnames'
import Skeletons from '@Users/newsfeed/skeleton'
import Composer from '@Users/newsfeed/composer'
import usePost from '@Hook/usePost'
import Post from '@Users/newsfeed/post'
import Container from '@Core/container'
import useUser from '@Hook/useUser'

/**
 * Affichage des posts et du formulaire
 * @param props
 * @constructor
 */
const Stream = (props: INewsfeedProps) => {
	const dispatch = useSettingsDispatch(),
		{ dataPost, status, isFetchingNextPage, fetchNextPage } = usePost(),
		{ ref, inView } = useInView(),
		skelDisplay = [1, 2, 3, 4],
		{ user } = useUser()

	useEffect(() => {
		if(inView) fetchNextPage()
	}, [inView])

	useEffect(() => {
		props && props.breakpoint && dispatch({ type: 'BREAKPOINT', payload: props.breakpoint })
	}, [props, dispatch])

	/**
	 * Mode d'affichage des posts
	 */
	const displayPost = () => {
		if(dataPost) {
			switch (props.display) {
				case 'all':
					return dataPost.pages.map(page => page && page.data.map((post: IPost, index: number) => <Post { ...post } key={index} />))
				case 'photo':
					return dataPost.pages.map(page => page && page.data.filter((post: IPost) => post.with_picture).map((post: IPost, index: number) => <Post { ...post } key={index} />))
				case 'profile':
					return dataPost.pages.map(page => page && page.data.filter((post: IPost) => post.user_id === props.profile_id).map((post: IPost, index: number) => <Post { ...post } key={index} />))
			}
		}
	}

	/**
	 * Mode d'affichage du formulaire des posts
	 */
	const displayComposer = () => {
		const C = <div><Composer /></div>

		switch (props.display) {
			case 'all':
				return C
			case 'photo':
				return null
			case 'profile':
				return user && props.profile_id === user.id && C
		}
	}

	return (
		<section className={cl.masonry__stream}>
			<Container>
				<Masonry breakpointCols={props.display !== 'profile' ? { default: parseInt(props.breakpoint ? props.breakpoint : '2'), 770: 1, 1000: 2 } : 1} className={cl.masonry} columnClassName={cl.masonry__column}>
					{ displayComposer() }
					{ status === 'loading' ? skelDisplay.map((i) => <Skeletons key={i} />) : null }
					{ displayPost() }
				</Masonry>
				<div ref={ref} className={Class(g.dFlex, g.jcCenter, g.pRelative, g.zi50, g.mb10, g.mt50, props.display !== 'profile' && cl.masonry__mlm60)}>
					{ isFetchingNextPage &&
						<div className={Class(g.dFlex, g.pt5, g.pl5, g.pb5, g.pr5, g.pAbsolute, g.br100, g.b10, cl.masonry__load)}>
							<Loader height={46} width={46} classname={g.dFlex} color="#605699" />
						</div>
					}
				</div>
			</Container>
		</section>
	)
}

export default Stream