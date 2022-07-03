import React from 'react'
import { GetServerSideProps } from 'next'
import { checkServerToken } from '@Helper/checkToken'
import Users from '@Layout/users'
import Redirect from '@Helper/redirect'

const Messages = () => {
	return (
		<>

		</>
	)
}

Messages.getLayout = (page: React.ReactElement) => {
	return (
		<Users title="Groupomania" description="Inscrivez-vous ou connectez-vous sur Groupomania. Le réseau social pour les professionnels">
			{ page }
		</Users>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { token } = checkServerToken(context)

	!token && await Redirect(context, false)
	return {
		props: {}
	}
}

export default Messages