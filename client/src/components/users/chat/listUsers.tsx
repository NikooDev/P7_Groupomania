import React from 'react'
import Link from 'next/link'
import g from '@Asset/theme/global.module.scss'
import cl from './listUsers.module.scss'
import { useQuery } from 'react-query'
import { listUsers } from '@Action/user.action'
import { Avatar } from '@Core/avatar'
import { capitalize } from '@Helper/utils'
import Tooltip from '@Core/tooltip'
import Class from 'classnames'

const ListUsers = () => {
	const { data, status } = useQuery('listUsers', () => listUsers(), { refetchInterval: 3600 })

	return (
		<aside className={Class(g.aiCenter, g.fdColumn, g.pFixed, g.r0, g.t40, g.h100p, g.w60, g.zi40, g.pt20, cl.listUsers)}>
			<ul>
			{
				status === 'success' && [...data].map((v, i) => (
					<li key={i} className={g.mb15}>
						{
							<Link href={'/'+v.username}>
								<Tooltip content={capitalize(v.firstname)+' '+capitalize(v.name)} placement="right">
									<a href={'/'+v.username} className={g.dFlex}>
										<Avatar avatar_url={v.avatar_url} user_id={v.id} colorLoader="#605699" classnameLoader={Class(g.pt5, g.pl5, g.pr5, g.pb5)} height={50} width={50} />
									</a>
								</Tooltip>
							</Link>
						}
					</li>
				))
			}
			</ul>
		</aside>
	)
}

export default ListUsers