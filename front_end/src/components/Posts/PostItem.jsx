import { Link } from "react-router-dom";
import "./posts.css"
const PostItem = ({post}) => {
    return ( 
        <div className="post-item">
            <div className="post-item-image-wrapper">
                <img src={post.image} alt="" className="post-item-image" />
            </div>
            <div className="post-item-info-wrapper">
                <div className="post-item-info">
                    <div className="post-item-author">
                        <strong>Author:</strong> 
                        <Link style={{ textDecoration: 'none' }} className="post-item-username" to={"/profile/1"}>{post.user.username}</Link>
                    </div>
                    <div className="post-item-date">
                        {new Date(post.createdAt).toDateString()}
                    </div>
                </div>
                <div className="post-item-details">
                    <h4 className="post-item-title">{post.title}</h4>
                    <Link style={{ textDecoration: 'none' }} className="post-item-category" to={`/posts/categories/${post.category}`}>{post.category}</Link>
                </div>
                <p className="post-item-description">
                    {post.description}
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                    Quae alias illum eligendi quasi cupiditate enim ut nemo, 
                    nisi obcaecati vero eum id sint officia nobis sequi ratione quaerat distinctio 
                    ipsam?
                    Quae alias illum eligendi quasi cupiditate enim ut nemo, 
                    nisi obcaecati vero eum id sint officia nobis sequi ratione quaerat distinctio 
                    ipsam?
                </p>
                <Link style={{ textDecoration: 'none' }} className="post-item-link" to={`/posts/details/${post._id}`}>
                    Read More....
                </Link>
            </div>
        </div>
     );
}
 
export default PostItem ;