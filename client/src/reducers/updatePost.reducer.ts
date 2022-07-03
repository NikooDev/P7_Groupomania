import { IUpdatePostAction, IUpdatePostContext } from '@Type/newsfeed'

const postInitialState = {
	updatePost: null,
}

const UpdatePostReducer = (formInitialState: IUpdatePostContext, action: IUpdatePostAction) => {
	switch (action.type) {
		case 'UPDATE_POST':
			return {
				...formInitialState,
				updatePost: action.payload!
			}
		case 'RESET_UPDATE_POST':
			return {
				...formInitialState,
				updatePost: null
			}
		default:
			throw new Error('Type d\'action non défini')
	}
}

export {
	postInitialState, UpdatePostReducer
}