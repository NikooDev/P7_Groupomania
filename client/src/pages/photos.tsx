import React from 'react'
import { GetServerSideProps } from 'next'
import { INewsfeedProps } from '@Type/newsfeed'
import { checkBreakPoint, checkServerToken } from '@Helper/checkToken'
import Users from '@Layout/users'
import Redirect from '@Helper/redirect'
import Dynamic from 'next/dynamic'

const PhotosStream = Dynamic(() => import('@Users/newsfeed/photos'))

const Photos = (props: INewsfeedProps) => {
	return <PhotosStream { ...props } />
}

Photos.getLayout = (page: React.ReactElement) => {
	return (
		<Users title="Groupomania" description="Inscrivez-vous ou connectez-vous sur Groupomania. Le réseau social pour les professionnels">
			{ page }
		</Users>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { token } = checkServerToken(context)
	const { breakpoint } = checkBreakPoint(context)

	!token && await Redirect(context, false)
	if(!breakpoint) { return { props: { breakpoint: '2' } } }
	return {
		props: { breakpoint: breakpoint || null }
	}
}

export default Photos