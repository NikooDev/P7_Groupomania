const getLocalIdent = require('./lib/getLocalIdent'), dev = process.env.NODE_ENV !== 'production'

/**
 * Next.config.js
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	dev: dev,
	distDir: 'build',
	webpack: (config) => {
		const rules = config.module.rules.find((rule) => typeof rule.oneOf === 'object').oneOf.filter((rule) => Array.isArray(rule.use))
		Object.values(rules[1]?.use).map((rule, _) => {
			if(rule.loader.includes('css-loader') && !rule.loader.includes('postcss-loader')) {
				if(!dev) {
					delete rule.options.modules.getLocalIdent
					rule.options = {
						...rule.options,
						modules: {
							...rule.options.modules,
							exportLocalsConvention: 'camelCase',
							getLocalIdent: getLocalIdent
						}
					}
				} else {
					rule.options = {
						...rule.options,
						modules: {
							...rule.options.modules,
							exportLocalsConvention: 'camelCase'
						}
					}
				}
			}
		})
		return config
	}
}
module.exports = nextConfig