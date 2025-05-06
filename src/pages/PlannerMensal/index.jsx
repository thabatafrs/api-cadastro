import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PlannerMensal({ mes }) {
  const [semanasDoMes, setSemanasDoMes] = useState([]);
  const [hoje] = useState(new Date());

  const navigate = useNavigate();

  const nomesMeses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const obterSemanasDoMes = (ano, mes) => {
    const semanas = [];
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diaDaSemana = primeiroDia.getDay();

    const dias = [];

    for (let i = 0; i < diaDaSemana; i++) {
      dias.push(null); // espaço vazio antes do dia 1
    }

    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      dias.push(new Date(ano, mes, i));
    }

    // Agrupar em semanas
    for (let i = 0; i < dias.length; i += 7) {
      semanas.push(dias.slice(i, i + 7));
    }

    return semanas;
  };

  useEffect(() => {
    const ano = new Date().getFullYear();
    const semanas = obterSemanasDoMes(ano, mes);
    setSemanasDoMes(semanas);
  }, [mes]);

  return (
    <div className="flex">
      {/* Coluna lateral dinâmica das semanas */}
      <div className="flex flex-col mr-4 justify-center">
        {semanasDoMes.map((_, i) => (
          <button
            key={i}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm h-25 mt-2"
            onClick={() =>
              navigate(`/planner-semanal/${nomesMeses[mes]}/${i + 1}`)
            }
          >
            sem {i + 1}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {/* Cabeçalho */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, i) => (
            <div key={i} className="text-center font-semibold text-gray-700">
              {dia}
            </div>
          ))}
        </div>

        {/* Dias por semana */}
        {semanasDoMes.map((semana, i) => (
          <div key={i} className="grid grid-cols-7 gap-2 mb-2">
            {semana.map((dia, index) => (
              <div
                key={index}
                className={`border p-4 text-center rounded h-24 ${
                  dia &&
                  dia.getDate() === hoje.getDate() &&
                  dia.getMonth() === hoje.getMonth() &&
                  dia.getFullYear() === hoje.getFullYear()
                    ? "bg-green-100 font-bold"
                    : ""
                }`}
              >
                {dia ? dia.getDate() : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlannerMensal;
