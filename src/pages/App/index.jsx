import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import Planner from "../Planner";
import PlannerSemanal from "../PlannerSemanal";
import PrivateRoute from "../../components/PrivateRoute";
import Estatisticas from "../Estatisticas";

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
      <Route
        path="/estatisticas"
        element={
          <PrivateRoute>
            <Estatisticas />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
