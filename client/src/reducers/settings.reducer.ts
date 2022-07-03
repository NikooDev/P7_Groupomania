import { ISettingsAction, ISettingsContext } from '@Type/setting'

const settingsInitialState = {
	breakpointCol: '',
	darkmode: false
}

const SettingReducer = (formInitialState: ISettingsContext, action: ISettingsAction) => {
	switch (action.type) {
		case 'BREAKPOINT':
			return {
				...formInitialState,
				breakpointCol: action.payload!
			}
		case 'DARKMODE':
			return {
				...formInitialState,
				darkmode: action.payload
			}
		default:
			throw new Error('Type d\'action non défini')
	}
}

export {
	settingsInitialState, SettingReducer
}