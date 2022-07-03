import { useInfiniteQuery } from 'react-query'
import { getPosts } from '@Action/newsfeed.action'

const usePost = () => {
	const {
		status,
		data,
		isFetchingNextPage,
		isRefetching,
		isFetching,
		refetch,
		fetchNextPage,
	} = useInfiniteQuery('posts', ({ pageParam = 1 }) => getPosts('/user/newsfeed/get/'+pageParam), {
		getNextPageParam: lastPage => {
			const nextPage = lastPage && lastPage.meta?.next_page_url ? lastPage.meta.next_page_url.split('/?page=').pop() : undefined
			return nextPage ?? undefined
		}
	})

	return {
		dataPost: data, status, isFetching, isRefetching, isFetchingNextPage, refetchPost: refetch, fetchNextPage
	}
}

export default usePost