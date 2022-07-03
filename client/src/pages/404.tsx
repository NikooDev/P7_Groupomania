import React from 'react'
import g from '@Asset/theme/global.module.scss'
import Users from '@Layout/users'
import Class from 'classnames'
import Container from '@Core/container'

const Error404 = () => {
	return (
		<div className={Class(g.dFlex, g.fdColumn, g.jcCenter, g.aiCenter, g.taCenter, g.w100p, 'error404')}>
			<Container>
				<h1 data-text="GROUPOMANIA" className={Class(g.fwe900, g.pRelative, g.mb30, 'title404')}>GROUPOMANIA</h1>
				<h2>Cette page n’est pas disponible</h2>
				<p className={g.fwe500}>Le lien que vous avez suivi est peut-être rompu, ou la page a été supprimée.</p>
				<img src="/static/svg/error404.svg" alt="error404" className={g.mt20} height={450} width={450} />
			</Container>
		</div>
	)
}

Error404.getLayout = (page: React.ReactElement) => {
	return (
		<Users title="Page introuvable • Groupomania" description="">
		{ page }
		</Users>
	)
}

export default Error404