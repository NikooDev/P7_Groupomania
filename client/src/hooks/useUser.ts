import useSWR from 'swr'
import { getUser } from '@Action/user.action'

/**
 * Hook SWR =>
 * Mise en cache et distribution des données utilisateur
 */
const useUser = () => {
	const { data, mutate, isValidating } = useSWR('/user/get', (url) => getUser(url), { revalidateOnFocus: false }),
		loading = !data,
		user = data

	return {
		user, mutate, loading, validating: isValidating
	}
}

export default useUser