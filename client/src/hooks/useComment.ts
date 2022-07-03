import { useQuery } from 'react-query'
import { getComments } from '@Action/comment.action'

export const useComments = () => {
	const {
		status,
		data,
		isFetching,
		refetch,
	} = useQuery('comments', () => getComments('/user/comment/get'))

	return {
		data, status, isFetching, refetchComment: refetch
	}
}