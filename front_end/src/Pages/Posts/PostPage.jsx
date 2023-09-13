import "./post-page.css";

import PostList from "../../components/Posts/PostList";
import Sidebar from "../../components/sidebar/Sidebar";

import {posts , categories} from "../../dummyData";
import Pagination from "../../components/pagination/Pagination";
import { useEffect } from "react";

const PostsPage = () => {

    {/* when user click on the post page, 
    it was open from down but it should scroll to the top of the page 
        so we use useEffect to scroll to the top of the page to UserFriendly Design
*/}

    {/* that happened because React is Single Page all Website is html struceture 
    we use the same component for the home page and the post page 
    so we need to scroll to the top of the page when user click on the post page */}


     useEffect( () => {
         window.scrollTo(0,0)
     }, [] )
  return (
    <>
      <section className="posts-page">

        <PostList posts={posts} />
        <Sidebar categories={categories} />

      </section>
      <Pagination />

    </>
  );
};

export default PostsPage;
