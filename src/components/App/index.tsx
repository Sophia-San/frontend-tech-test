import { BrowserRouter as Router } from "react-router-dom";

import { AppRoutes } from "../AppRoutes";

export const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};
