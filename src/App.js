import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Home from "./components/Home/home";
import "./assets/styles/global.scss";
import progress from "./components/chakraUI/progressFullScreen";

function App() {
  return (
    <BrowserRouter>
        <div className="App inter-font">
      <Routes>
          <Route
            exact
            path="/"
            element={
              <Suspense fallback={progress}>
                <Home />
              </Suspense>
            }
          />
      </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
