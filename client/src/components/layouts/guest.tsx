import React from 'react'
import { Toaster } from 'react-hot-toast'
import ILayout from '@Type/layout'
import Head from 'next/head'
import FormProvider from '@Context/form.context'

/**
 * Layout Guest => Non connecté
 * @param title
 * @param description
 * @param children
 * @constructor
 */
const Guest: React.FC<ILayout> = ({
	title,
	description,
	children }) => {
	return (
		<>
			<Head>
				<title>{ title }</title>
				<meta name="description" content={ description } />
			</Head>
			<Toaster />
			<FormProvider>
				<main role="main">
					{ children }
				</main>
			</FormProvider>
		</>
	)
}

export default Guest