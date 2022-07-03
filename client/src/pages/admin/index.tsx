import React, { useCallback, useState } from 'react'
import { GetServerSideProps } from 'next'
import g from '@Asset/theme/global.module.scss'
import cl from '@Admin/admin.module.scss'
import { checkServerToken } from '@Helper/checkToken'
import { checkAdmin } from '@Action/admin.action'
import Users from '@Layout/users'
import Class from 'classnames'
import Dynamic from 'next/dynamic'
import Container from '@Core/container'

const UsersList = Dynamic(() => import('@Admin/usersList'))
const PostsList = Dynamic(() => import('@Admin/postsList'))

/**
 * Page admin =>
 * Gestion du réseau social
 * @constructor
 */
const Dashboard = () => {
	const [showPosts, setShowPosts] = useState<boolean>(false)

	const handleMenuChange = useCallback((event: React.FormEvent) => {
		const target = event.target as HTMLSelectElement
		switch (target.value) {
			case 'users':
				setShowPosts(false)
				break
			case 'posts':
				setShowPosts(true)
				break
			default:
				setShowPosts(false)
		}
	}, [])

	return (
		<section className={cl.admin}>
			<Container>
				<div className={Class(g.dFlex, g.aiCenter, cl.admin__pl35)}>
					<h1 className={Class(g.fwe600, cl.admin__title)}>Administration</h1>
					<select onChange={(event) => handleMenuChange(event)} className={Class(g.pl10, g.pr10, g.brbr30, g.brbl30, g.brtr30, g.brtl30, g.h25, g.fwe500, cl.admin__select)}>
						<option value="users">Utilisateurs</option>
						<option value="posts">Publications</option>
					</select>
				</div>
				<div className={Class(g.mt20, cl.admin__pl35)}>
					{ !showPosts ? <UsersList /> : <PostsList /> }
				</div>
			</Container>
		</section>
	)
}

Dashboard.getLayout = (page: React.ReactElement) => {
	return (
		<Users title="Groupomania" description="Inscrivez-vous ou connectez-vous sur Groupomania. Le réseau social pour les professionnels">
			{ page }
		</Users>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { token } = checkServerToken(context)

	if(token) {
		const result = await checkAdmin('/user/admin/check', token)

		if(result && !result.admin) {
			return { redirect: { destination: '/home' }, props: {} }
		} else return { props: {} }
	} else {
		context.res.setHeader('set-cookie', 'error404=1')
		return { redirect: { destination: '/' }, props: {} }
	}
}

export default Dashboard