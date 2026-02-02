export const getPostsNewfeedKey = (page: string) =>  ["post", page];
export const getPostsNewfeedDetailKey = (postId: string, page: string) => ["post", page, postId];
export const getUserPostStatsKey = (userId: string) => ["post", "stats", userId];
export const getUserPostKey = (userId: string) => ["post", "user", userId];
