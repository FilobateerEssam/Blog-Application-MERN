import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/header/Header";
import Home from "./Pages/home/Home"
import Login from "./Pages/Forms/Login"
import Register from "./Pages/Forms/Register"
import AdminDashboard from "./Pages/Admin/AdminDashboard"
import PostPage from "./Pages/Posts/PostPage"
import CreatePost from "./Pages/Create_post/createpost"
import Footer from "./components/footer/Footer";

function App() {
  return (
    <BrowserRouter>


    {/* will be always visible */}
      <Header /> 


      {/* include routes here  will be visible based on the path Routes mean have many Route */}
      <Routes>

        {/* Route mean that Each Componet Will Route To it if path="/" will process the Component
            Link move you to the path
        */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/posts" element={<PostPage />} />
        <Route path="/posts/create-post" element={<CreatePost />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;
