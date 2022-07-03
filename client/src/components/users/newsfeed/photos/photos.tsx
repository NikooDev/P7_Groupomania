import React from 'react'
import { INewsfeedProps } from '@Type/newsfeed'
import cl from '@Users/newsfeed/stream.module.scss'
import Container from '@Core/container'
import Dynamic from 'next/dynamic'

const Stream = Dynamic(() => import('@Users/newsfeed/stream'))

const PhotosStream = (props: INewsfeedProps) => {
	return (
		<section className={cl.masonry__stream}>
			<Container>
				<Stream display="photo" breakpoint={props.breakpoint} />
			</Container>
		</section>
	)
}

export default PhotosStream