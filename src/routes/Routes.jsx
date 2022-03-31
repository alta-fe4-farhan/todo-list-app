import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hompage from "../pages/Hompage";
import Completed from "../pages/Completed";
import Detail from "../pages/Detail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hompage />} />
        <Route path="/taskcompleted" element={<Completed />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
