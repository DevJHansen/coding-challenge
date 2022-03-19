import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import NotFound from "./views/notFound/NotFound";
import Validate from "./views/validate/Validate";
import Sort from "./views/sort/Sort";
import Merge from "./views/merge/Merge";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route element={<Validate />} path="/" />
          <Route element={<Sort />} path="/sort" />
          <Route element={<Merge />} path="/merge" />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
