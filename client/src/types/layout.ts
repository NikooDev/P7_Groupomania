import { IChildren } from '@Type/utils'

/**
 * Interface des layouts
 */
interface ILayout {
	children: IChildren['children']
	title: string
	description: string
}

export default ILayout