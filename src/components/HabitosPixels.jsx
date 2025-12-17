import { useEffect, useState } from "react";
import api from "../services/api";

function HabitosYearPixels() {
    const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const hoje = new Date();

  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [habitos, setHabitos] = useState([]);
  const [mapaRegistros, setMapaRegistros] = useState({});

  const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const diasDoMes = Array.from(
    { length: new Date(ano, mes + 1, 0).getDate() },
    (_, i) => new Date(ano, mes, i + 1)
  );

  // 🔁 alterna o hábito no dia clicado
  async function toggleHabito(habitoId, dataISO) {
    try {
      const response = await api.post("/habitoRegistro", {
        habitoId,
        data: dataISO,
      });

      const registro = response.data;

      setMapaRegistros((prev) => {
        const novoMapa = { ...prev };
        const setDia = new Set(novoMapa[dataISO] || []);

        if (registro) {
          setDia.add(habitoId);
        } else {
          setDia.delete(habitoId);
        }

        novoMapa[dataISO] = setDia;
        return novoMapa;
      });
    } catch (error) {
      console.error("Erro ao alternar hábito:", error);
    }
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        const resHabitos = await api.get("/habito");
        setHabitos(resHabitos.data);

        const dataInicio = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
        const ultimoDia = new Date(ano, mes + 1, 0).getDate();
        const dataFim = `${ano}-${String(mes + 1).padStart(
          2,
          "0"
        )}-${String(ultimoDia).padStart(2, "0")}`;

        const resRegistros = await api.get(
          `/habitoRegistro?dataInicio=${dataInicio}&dataFim=${dataFim}`
        );

        const mapa = {};
        resRegistros.data.forEach((r) => {
          const data = r.data.split("T")[0];
          if (!mapa[data]) mapa[data] = new Set();
          mapa[data].add(r.habitoId);
        });

        setMapaRegistros(mapa);
      } catch (error) {
        console.error("Erro ao carregar hábitos:", error);
      }
    }

    carregarDados();
  }, [ano, mes]);

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex gap-4 items-center mb-6">
        <select
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {nomesMeses.map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {[2024, 2025, 2026].map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Hábitos em blocos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {habitos.map((habito) => (
          <div
            key={habito.id}
            className="border rounded-lg p-4 shadow-sm"
          >
<div className="flex items-center gap-2 mb-4">
  <span className="font-medium">{habito.nome}</span>

  <div className="flex gap-1">
    {habito.dias.map((dia) => (
      <span
        key={dia}
        className="px-2 py-0.5 text-xs rounded bg-gray-200"
      >
        {dia}
      </span>
    ))}
  </div>
</div>

            <div className="grid grid-cols-7 gap-1">
                
{diasDoMes.map((dia) => {
  const dataISO = dia.toISOString().split("T")[0];
  const nomeDia = diasDaSemana[dia.getDay()];

  const diaHabilitado = habito.dias?.includes(nomeDia);
  const concluido =
    mapaRegistros[dataISO]?.has(habito.id) || false;

  // estilo quando o dia NÃO faz parte do hábito
  if (!diaHabilitado) {
    return (
      <div
        key={dataISO}
        className="w-6 h-6 rounded bg-gray-100 text-gray-400 flex items-center justify-center text-[10px]"
        title={`${nomeDia} (não faz parte do hábito)`}
      >
        {dia.getDate()}
      </div>
    );
  }

  // dia habilitado (normal)
  return (
    <div
      key={dataISO}
      title={`${nomeDia} • ${dia.getDate()}/${mes + 1}`}
      onClick={() => toggleHabito(habito.id, dataISO)}
      className={`w-6 h-6 flex items-center justify-center text-[10px] font-medium rounded cursor-pointer transition
        ${
          concluido
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-white-500 text-gray-700 hover:bg-gray-400"
        }`}
    >
      {dia.getDate()}
    </div>
  );
})}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HabitosYearPixels;
