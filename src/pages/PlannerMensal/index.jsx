import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function PlannerMensal({ mes }) {
  const [semanasDoMes, setSemanasDoMes] = useState([]);
  const [hoje] = useState(new Date());
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [diasSemanaSelecionados, setDiasSemanaSelecionados] = useState([]);

  const inputNomeEvento = useRef();
  const inputHorarioEvento = useRef();

  async function createEvento() {
    const nome = inputNomeEvento.current.value.trim();
    const horario = inputHorarioEvento.current.value.trim();

    if (!nome || !horario) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await api.post("/eventos", {
        nome,
        horario,
        data: diaSelecionado.toISOString(), // campo certo pro schema
      });
      alert("Evento cadastrado com sucesso!");
      setMostrarPopup(false);
    } catch (error) {
      alert(
        "Erro ao cadastrar usuário: " + error.response?.data?.message ||
          error.message
      );
    }
  }

  const [isHabito, setIsHabito] = useState(true);

  function abrirPopup(dia) {
    setDiaSelecionado(dia);
    setMostrarPopup(true);
  }

  const navigate = useNavigate();

  const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

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
                className={`border p-4 text-center rounded h-24 flex justify-between ${
                  dia &&
                  dia.getDate() === hoje.getDate() &&
                  dia.getMonth() === hoje.getMonth() &&
                  dia.getFullYear() === hoje.getFullYear()
                    ? "bg-green-100 font-bold"
                    : ""
                }`}
              >
                {dia ? dia.getDate() : ""}
                <button
                  type="button"
                  className="bg-green-500 text-white rounded-sm h-5 flex items-center cursor-pointer"
                  onClick={() => abrirPopup(dia)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {mostrarPopup && (
        <div className="fixed inset-0 bg-gray-100/75 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-96 text-center">
            {diaSelecionado && (
              <p className="text-gray-600 mb-3">
                Dia selecionado: {diaSelecionado.toLocaleDateString("pt-BR")}
              </p>
            )}
            <div className="flex justify-center gap-3  mb-5 ">
              <button
                className={`font-semibold uppercase ${
                  isHabito
                    ? "underline text-black"
                    : "text-gray-600 hover:underline"
                }`}
                onClick={() => setIsHabito(true)}
              >
                Hábito
              </button>
              <button
                className={`font-semibold uppercase ${
                  !isHabito
                    ? "underline text-black"
                    : "text-gray-600 hover:underline"
                }`}
                onClick={() => setIsHabito(false)}
              >
                Evento
              </button>
            </div>

            <div>
              {isHabito ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 ">
                    <label htmlFor="">Nome:</label>
                    <input
                      className="border p-2 rounded w-full"
                      placeholder=""
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label htmlFor="">Horário:</label>
                    <input
                      className="border p-2 rounded"
                      placeholder=""
                      type="time"
                    />
                  </div>

                  <div>
                    <label className="block text-left mb-1 font-semibold">
                      Repetir em:
                    </label>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      {diasDaSemana.map((dia, index) => (
                        <label key={index} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            value={dia}
                            checked={diasSemanaSelecionados.includes(dia)}
                            onChange={(e) => {
                              const { value, checked } = e.target;
                              if (checked) {
                                setDiasSemanaSelecionados([
                                  ...diasSemanaSelecionados,
                                  value,
                                ]);
                              } else {
                                setDiasSemanaSelecionados(
                                  diasSemanaSelecionados.filter(
                                    (d) => d !== value
                                  )
                                );
                              }
                            }}
                          />
                          {dia}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded w-full ">
                    salvar
                  </button>
                  <button
                    onClick={() => setMostrarPopup(false)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    cancelar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 ">
                    <label htmlFor="">Nome:</label>
                    <input
                      className="border p-2 rounded w-full"
                      placeholder=""
                      ref={inputNomeEvento}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label htmlFor="">Horário:</label>
                    <input
                      className="border p-2 rounded"
                      placeholder=""
                      type="time"
                      ref={inputHorarioEvento}
                    />
                  </div>

                  <button
                    className="bg-green-500 text-white px-4 py-2 mt-4 rounded w-full "
                    onClick={createEvento}
                  >
                    salvar
                  </button>
                  <button
                    onClick={() => setMostrarPopup(false)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlannerMensal;
