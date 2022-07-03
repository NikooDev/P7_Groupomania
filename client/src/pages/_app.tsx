import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import AppPropsWithLayout from '@Type/app'
import Head from 'next/head'
import '@Asset/app.scss'

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
	const getLayout = Component.getLayout ?? ((page) => page)

	return (
		<>
			<Head>
				<meta charSet="UTF-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<link rel="apple-touch-icon" sizes="114x114" href="/static/ico/apple-touch-icon.png"/>
				<link rel="icon" type="image/png" sizes="32x32" href="/static/ico/favicon-32x32.png"/>
				<link rel="icon" type="image/png" sizes="16x16" href="/static/ico/favicon-16x16.png"/>
				<link rel="icon" href="/static/ico/favicon.ico"/>
			</Head>
			<QueryClientProvider client={queryClient}>
				{ getLayout(<Component {...pageProps} />) }
			</QueryClientProvider>
		</>
	)
}

export default App