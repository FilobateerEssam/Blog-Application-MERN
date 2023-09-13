import PostList from "../../components/Posts/PostList";
import "./Home.css";

import { posts, categories } from "../../dummyData";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home">
      <div className="home-hero-header">
        <div className="home-hero-header-layout">
          <h1 className="home-title">Welcome to Blog App</h1>
        </div>
      </div>
      <div className="home-latest-post">Latest Posts</div>
      <div className="home-container">
        {/* post list  .slice(0, 3) Mean 3 Posts  */}
        <PostList posts={posts.slice(0, 3)} />

        {/* sidebar */}
        <Sidebar categories={categories} />
      </div>
      <div className="home-see-posts-link">

        <Link style={{ textDecoration: 'none' }} to="/posts" className="home-link">
          See All Posts
        </Link>

      </div>
    </section>
  );
};

export default Home;
