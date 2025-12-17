import { useEffect, useState } from "react";
import api from "../../services/api";
import HabitosPixels from "../../components/HabitosPixels";
import CabecalhoNav from "../../components/cabecalhoNav";

function HabitosPixelsPage() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());

  const [habitos, setHabitos] = useState([]);
  const [registros, setRegistros] = useState({});

  useEffect(() => {
    async function fetchDados() {
      const resHabitos = await api.get("/habito");

      const inicio = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
      const fim = `${ano}-${String(mes + 1).padStart(2, "0")}-${new Date(
        ano,
        mes + 1,
        0
      ).getDate()}`;

      const resRegistros = await api.get(
        `/habitoRegistro?dataInicio=${inicio}&dataFim=${fim}`
      );

      const mapa = {};
      resRegistros.data.forEach((r) => {
        const dia = r.data.split("T")[0];
        if (!mapa[r.habitoId]) mapa[r.habitoId] = new Set();
        mapa[r.habitoId].add(dia);
      });

      setHabitos(resHabitos.data);
      setRegistros(mapa);
    }

    fetchDados();
  }, [mes, ano]);

  return (
        <div className="container mx-auto py-8">
<CabecalhoNav />
    <div className="p-4">
      <h1 className="text-xl font-medium mb-4">Hábitos</h1>

      <HabitosPixels
        habitos={habitos}
        registros={registros}
        mes={mes}
        ano={ano}
      />
    </div>
    </div>
  );
}

export default HabitosPixelsPage;
