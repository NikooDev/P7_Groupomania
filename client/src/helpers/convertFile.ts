import { App } from '@Config'

export const convertFile = async (dataUrl: string, fileName: string, ext: string) => {
	const result = await fetch(dataUrl),
		newFile = await result.blob(),
		name = fileName+'.'+ext,
		extType = ext.split('.').pop()

	return new File([newFile], name.toLowerCase(),{ type: 'image/'+extType })
}

export const getBase64FromUrl = async (url: string): Promise<string | ArrayBuffer | null> => {
	const data = await fetch(url, { mode: 'cors', headers: { 'Accept': 'application/json','Access-Control-Allow-Origin': App.api } })
	const blob = await data.blob()
	return new Promise((resolve) => {
		const reader = new FileReader()
		reader.readAsDataURL(blob)
		reader.onloadend = () => {
			const base64data = reader.result
			resolve(base64data)
		}
	})
}