import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import Planner from "../Planner";
import PlannerSemanal from "../PlannerSemanal";
import PrivateRoute from "../../components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/planner"
        element={
          <PrivateRoute>
            <Planner />
          </PrivateRoute>
        }
      />
      <Route
        path="/planner-semanal/:mes/:semana"
        element={
          <PrivateRoute>
            <PlannerSemanal />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
