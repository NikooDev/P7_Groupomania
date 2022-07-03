import Document, { Html, Main, Head, NextScript } from 'next/document'
import React from 'react'

class HTML extends Document {
	render() {
		return (
			<Html lang="fr">
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default HTML