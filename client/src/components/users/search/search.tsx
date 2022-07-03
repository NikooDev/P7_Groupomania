import React, { useCallback, useRef, useState } from 'react'
import g from '@Asset/theme/global.module.scss'
import cl from './search.module.scss'
import { SearchIcon } from '@Core/icons/menu'
import Class from 'classnames'
import useOutside from '@Hook/useOutside'

/**
 * Formulaire de recherche
 * @constructor
 */
const Search = () => {
	const [showSearch, setShowSearch] = useState<boolean>(false),
		searchRef = useRef() as React.MutableRefObject<HTMLDivElement>

	useOutside(searchRef, () => setShowSearch(false))

	const handleShowSearch = useCallback(() => setShowSearch(showSearch => !showSearch), [])

	return (<div className={Class(g.brtl30, g.brbl30, g.brtr30, g.brbr30, cl.search)} ref={searchRef}>
		<button onClick={handleShowSearch} className={Class(g.aiCenter, g.jcCenter, cl.searchMobile, g.br100)}>
			<SearchIcon height={23} width={23} />
		</button>
		<div className={Class(g.h25, g.pl10, g.pr10, cl.search__wrapper, showSearch ? cl.show : null)}>
			<form method="get" className={Class(g.dFlex, g.w100p)}>
				<span className={Class(g.dFlex, g.aiCenter, g.pr5)}>
					<SearchIcon height={17} width={17} />
				</span>
				<input type="text" placeholder="Rechercher sur Groupomania" className={Class(g.dFlex, g.w100p, g.fwe500)} />
			</form>
		</div>
	</div>)
}

export default Search