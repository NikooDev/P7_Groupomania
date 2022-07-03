import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { IProfileProps } from '@Type/user'
import { useRouter } from 'next/router'
import { checkServerToken } from '@Helper/checkToken'
import { getProfile } from '@Action/user.action'
import { capitalize } from '@Helper/utils'
import Users from '@Layout/users'
import Dynamic from 'next/dynamic'

const Profile = Dynamic(() => import('@Users/profile/profile'))

const User = (props: IProfileProps) => {
	const router = useRouter()

	useEffect(() => {
		if(props.result?.profile === null) {
			router.push('/404', router.asPath, { shallow: true })
		}
	}, [props])

	return (props.result.profile === null ? <></> :
		<>
			<Profile { ...props.result } />
		</>
	)
}

User.getLayout = (page: React.ReactElement) => {
	const { props } = page, fullname = props.result && props.result.profile && capitalize(props.result.profile.firstname)+' '+capitalize(props.result.profile.name)
	let title = fullname ? fullname+' • Groupomania' : 'Page introuvable • Groupomania'

	if(!props.result) title = 'Erreur réseau • Groupomania'

	return (
		<Users title={title} description="Inscrivez-vous ou connectez-vous sur Groupomania. Le réseau social pour les professionnels">
			{ page }
		</Users>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { token } = checkServerToken(context)

	if(token) {
		const param = context.query.users, result = await getProfile('/user/get/' + param, token)
		return { props: { result: result ? result : null, token } }
	} else {
		context.res.setHeader('set-cookie', 'error404=1')
		return { redirect: { destination: '/' }, props: { token: token } }
	}
}

export default User