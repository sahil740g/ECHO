import Comment from "./comment";

function CommentList({ comments, postId }) {
    if (!comments) return null;

    return (
        <div className="space-y-4">
            {comments.map(comment => (
                <Comment key={comment.id} comment={comment} postId={postId} />
            ))}
        </div>
    );
}

export default CommentList;
