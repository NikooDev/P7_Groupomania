import React, { createContext, useContext, useReducer } from 'react'
import { settingsInitialState, SettingReducer } from '@Reducer/settings.reducer'
import { ISettingsContext, ISettingsAction } from '@Type/setting'
import { IChildren } from '@Type/utils'

const SettingsContext = createContext<ISettingsContext>(settingsInitialState),
	SettingsDispatch = createContext<React.Dispatch<ISettingsAction>>(() => {})

/**
 * Contexte des paramètres de l'utilisateur
 * @param children
 * @constructor
 */
const SettingsProvider = ({ children }: IChildren) => {
	const [state, dispatch] = useReducer(SettingReducer, settingsInitialState)

	return (
		<SettingsContext.Provider value={state}>
			<SettingsDispatch.Provider value={dispatch}>
				{ children }
			</SettingsDispatch.Provider>
		</SettingsContext.Provider>
	)
}

export const useSettings = () => useContext(SettingsContext)
export const useSettingsDispatch = () => useContext(SettingsDispatch)
export default SettingsProvider