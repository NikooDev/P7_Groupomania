import React, { createContext, useContext, useReducer } from 'react'
import { postInitialState, UpdatePostReducer } from '@Reducer/updatePost.reducer'
import { IUpdatePostContext, IUpdatePostAction } from '@Type/newsfeed'
import { IChildren } from '@Type/utils'

const UpdatePostContext = createContext<IUpdatePostContext>(postInitialState),
	UpdatePostDispatch = createContext<React.Dispatch<IUpdatePostAction>>(() => {})

/**
 * Contexte des paramètres de l'utilisateur
 * @param children
 * @constructor
 */
const UpdatePostProvider = ({ children }: IChildren) => {
	const [state, dispatch] = useReducer(UpdatePostReducer, postInitialState)

	return (
		<UpdatePostContext.Provider value={state}>
			<UpdatePostDispatch.Provider value={dispatch}>
				{ children }
			</UpdatePostDispatch.Provider>
		</UpdatePostContext.Provider>
	)
}

export const useUpdatePost = () => useContext(UpdatePostContext)
export const useUpdatePostDispatch = () => useContext(UpdatePostDispatch)
export default UpdatePostProvider