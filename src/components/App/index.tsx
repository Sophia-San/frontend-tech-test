import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "../Header";
import { Content } from "../Content";

export const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Content />} />
      </Routes>
    </Router>
  );
};
