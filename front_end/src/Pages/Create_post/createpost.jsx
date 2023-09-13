import { useState } from "react";
import "./create-post.css"

import { toast , ToastContainer   } from "react-toastify";


const CreatePost = () => {
   const [title ,setTitle] =  useState("");
    const [description ,setDescription] =  useState("");
    const [file ,setFile] =  useState(null);
    const [category ,setCategory] =  useState("");


    // form submit Handler

    const formSubmitHandler = (e) => {

        e.preventDefault();

        if (title.trim() === "")  return toast.error("Post Title is required");
        if (category.trim() === "")  return toast.error("Post Category is required");
        if (description.trim() === "")  return toast.error("Post Description is required");
        if (!file)  return toast.error("Post Image is required");
        
 
        console.log(title , description , file , category);
    };
  return (
    <section className="create-post">
        <ToastContainer />
      <h1 className="create-post-title">Create New Post</h1>



      <form onSubmit={formSubmitHandler} className="create-post-form">

        <input
          type="text"
          placeholder="Post Title"
          className="create-post-input"
            autoFocus={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
        />

        {/* to select the category */}

        <select 
        value={category}
        onChange={(e) => setCategory(e.target.value)} 
        className="create-post-input">
          <option disabled value="">
            Select A Category
          </option>

          <option value="Music">Music</option>
          <option value="Coffe">Coffe</option>
        </select>

        <textarea
          className="create-post-textarea"
          rows="5"
          placeholder="Post Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} 
        ></textarea>

        <input
          type="file"
          name="file"
          id="file"
          className="create-post-upload"
          onChange={(e) => setFile(e.target.files[0])} // files[0] mean one file bcs files is an array
        />

        <button 
        type="submit" 
        className="create-post-btn">
          Create Post
        </button>


      </form>
    </section>
  );
};

export default CreatePost;
