import CommentItem from './CommentItem';

function Comment({ user, commentData }) {
  return (
    <div className="comment_box">
      {commentData && commentData.length > 0
        ? commentData.map((item, index) => (
            <CommentItem key={index} item={item} user={user} index={index} />
          ))
        : ''}
    </div>
  );
}

export default Comment;
