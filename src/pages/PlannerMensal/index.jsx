import { useState, useEffect } from "react";

function PlannerMensal({ mes }) {
  const [diasDoMes, setDiasDoMes] = useState([]);
  const [hoje] = useState(new Date());

  const obterDiasDoMes = (ano, mes) => {
    const dias = [];
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diaDaSemana = primeiroDia.getDay(); // 0 = domingo, 1 = segunda...

    // Adiciona divs vazias para os dias antes do início do mês
    for (let i = 0; i < diaDaSemana; i++) {
      dias.push(null); // espaço vazio
    }

    // Adiciona os dias reais do mês
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      dias.push(new Date(ano, mes, i));
    }

    return dias;
  };

  useEffect(() => {
    const ano = new Date().getFullYear();
    const dias = obterDiasDoMes(ano, mes);
    setDiasDoMes(dias);
  }, [mes]);

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Cabeçalho dos dias da semana */}
      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, i) => (
        <div key={i} className="text-center font-semibold text-gray-700">
          {dia}
        </div>
      ))}

      {/* Dias do mês */}
      {diasDoMes.map((dia, index) =>
        dia ? (
          <div
            key={index}
            className={`border p-4 text-center rounded h-25 ${
              dia.getDate() === hoje.getDate() &&
              dia.getMonth() === hoje.getMonth() &&
              dia.getFullYear() === hoje.getFullYear()
                ? "bg-green-100 font-bold"
                : ""
            }`}
          >
            {dia.getDate()}
          </div>
        ) : (
          <div key={index}></div> // espaço vazio antes do dia 1
        )
      )}
    </div>
  );
}

export default PlannerMensal;
