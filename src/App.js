import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

// Components
import LoginForm from "./fragments/loginform";
import ToDo from "./pages/ToDo";
import TopNavBar from "./fragments/navbar";
import ListMenu from "./pages/ListMenu";

import { UserContext } from "./context/user";

function App() {
  const { isSignedIn } = useContext(UserContext);
  return (
    <>
      <TopNavBar />
      <Routes>
        {isSignedIn ? (
          <>
            <Route path="/" element={<ListMenu />} />
            <Route path="/:listName" element={<ToDo />} />
          </>
        ) : (
          <Route path="/" element={<LoginForm />} />
        )}
      </Routes>
    </>
  );
}

export default App;
