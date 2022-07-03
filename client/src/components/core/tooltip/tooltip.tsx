import React, { forwardRef } from 'react'
import Tippy, { TippyProps } from '@tippyjs/react'
import cl from './tooltip.module.scss'

type AnchorProps = React.HTMLProps<HTMLSpanElement>

/**
 * Transfert de ref du composant Tippy vers un span
 */
const Tooltip = forwardRef<HTMLSpanElement, AnchorProps & TippyProps>((
	props,
	ref: React.LegacyRef<HTMLSpanElement>) => {
	return (
		<Tippy content={props.content} hideOnClick={props.hideOnClick} trigger={props.trigger} placement={props.placement} offset={props.offset} arrow={false} className={cl.tooltip} animation="shift-toward" appendTo="parent">
			<span {...props} ref={ref}>{ props.children }</span>
		</Tippy>
	)
})

export default Tooltip