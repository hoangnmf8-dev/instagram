export const getPostCommentKey = (postId: string) => ["post", "comment", postId];
export const getRepliesCommentKey = (postId: string, commentId: string) => ["post", "comment", postId, commentId];