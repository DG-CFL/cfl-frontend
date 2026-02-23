import { getAnalytics } from "@/api/analytics";
import { useQuery } from "@tanstack/react-query";

export function useGetAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  })
}
