export interface ISettingsContext {
	breakpointCol: string | undefined
	darkmode: boolean
}

export interface ISettingsAction {
	type: 'BREAKPOINT' | 'DARKMODE'
	payload?: any
}