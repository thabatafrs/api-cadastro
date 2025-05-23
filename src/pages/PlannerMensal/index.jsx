import { useState, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode"; // Importação padrão

import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function PlannerMensal({ mes }) {
  const [semanasDoMes, setSemanasDoMes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [hoje] = useState(new Date());
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [diasSemanaSelecionados, setDiasSemanaSelecionados] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [mostrarPopupEditar, setMostrarPopupEditar] = useState(false);
  const [habitos, setHabitos] = useState([]);

  const inputNomeEvento = useRef();
  const inputHorarioEvento = useRef();
  const inputNomeHabito = useRef();

  async function createHabito() {
    const nome = inputNomeHabito.current.value.trim();

    if (!nome || !diasSemanaSelecionados) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const response = await api.post("/habito", {
        nome,
        dias: diasSemanaSelecionados,
      });

      console.log("Enviando hábito:", {
        nome,
        dias: diasSemanaSelecionados,
      });

      setHabitos((prevHabitos) => [...prevHabitos, response.data]);
      setMostrarPopup(false);
    } catch (error) {
      alert(
        "Erro ao cadastrar hábito: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  async function createEvento() {
    const nome = inputNomeEvento.current.value.trim();
    const horario = inputHorarioEvento.current.value.trim();

    if (!nome || !horario) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const response = await api.post("/eventos", {
        nome,
        horario,
        data: diaSelecionado.toISOString(),
      });

      setEventos((prevEventos) => [...prevEventos, response.data]);
      setMostrarPopup(false);
    } catch (error) {
      alert(
        "Erro ao cadastrar evento: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  async function editarEvento() {
    try {
      const response = await api.put(`/eventos/${eventoSelecionado.id}`, {
        nome: eventoSelecionado.nome,
        horario: eventoSelecionado.horario,
      });

      const eventoAtualizado = response.data;

      // Atualiza o estado dos eventos localmente
      setEventos((prevEventos) =>
        prevEventos.map((evento) =>
          evento.id === eventoAtualizado.id ? eventoAtualizado : evento
        )
      );
      setMostrarPopupEditar(false);
    } catch (error) {
      alert("Erro ao editar evento");
    }
  }

  async function excluirEvento() {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir este evento?"
    );
    if (!confirmacao) return;

    try {
      await api.delete(`/eventos/${eventoSelecionado.id}`);

      // Atualiza o estado removendo o evento excluído
      setEventos((prevEventos) =>
        prevEventos.filter((evento) => evento.id !== eventoSelecionado.id)
      );
      setMostrarPopupEditar(false);
    } catch (error) {
      alert("Erro ao excluir evento");
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    console.log("Token enviado:", token); // Verifique o token antes de enviar

    const decodedToken = jwt_decode(token);
    const userId = decodedToken.id;

    if (!userId) {
      console.error("User ID is undefined or missing");
      return;
    }

    async function fetchEventos() {
      try {
        const response = await api.get("/eventos", {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token JWT no cabeçalho
          },
        });
        console.log(response.data);
        setEventos(response.data); // Adicionar esta linha
      } catch (error) {
        console.error(
          "Erro ao buscar eventos:",
          error.response?.data || error.message
        );
      }
    }

    async function fetchHabitos() {
      try {
        const response = await api.get("/habito", {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token JWT no cabeçalho
          },
        });
        console.log(response.data);
        setHabitos(response.data);
      } catch (error) {
        console.error(
          "Erro ao buscar hábitos:",
          error.response?.data || error.message
        );
      }
    }

    fetchEventos();
    fetchHabitos();
  }, []);

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
          {diasDaSemana.map((dia, i) => (
            <div key={i} className="text-center font-semibold text-gray-700">
              {dia}
            </div>
          ))}
        </div>

        {/* Dias por semana */}
        {semanasDoMes.map((semana, i) => (
          <div key={i} className="grid grid-cols-7 gap-2 mb-2">
            {semana.map((dia, index) => {
              // Filtra os eventos desse dia
              const eventosDoDia = eventos.filter((evento) => {
                const dataEvento = new Date(evento.data);
                return (
                  dia &&
                  dataEvento.getDate() === dia.getDate() &&
                  dataEvento.getMonth() === dia.getMonth() &&
                  dataEvento.getFullYear() === dia.getFullYear()
                );
              });

              // Hábitos recorrentes do dia da semana (seg, ter, etc)
              const nomeDia = dia ? diasDaSemana[dia.getDay()] : "";
              const habitosDoDia = habitos.filter((habito) =>
                habito.dias.includes(nomeDia)
              );

              return (
                <div
                  key={index}
                  className={`border p-2 text-center rounded h-24 flex flex-col justify-between ${
                    dia &&
                    dia.getDate() === hoje.getDate() &&
                    dia.getMonth() === hoje.getMonth() &&
                    dia.getFullYear() === hoje.getFullYear()
                      ? "bg-green-100 font-bold"
                      : ""
                  }`}
                >
                  {/* Número do dia */}
                  <div className="flex justify-between items-center mb-1">
                    <span>{dia ? dia.getDate() : ""}</span>
                    {dia && (
                      <button
                        type="button"
                        className="bg-green-500 text-white rounded-sm h-5 w-5 flex items-center justify-center cursor-pointer text-sm"
                        onClick={() => abrirPopup(dia)}
                      >
                        +
                      </button>
                    )}
                  </div>

                  {/* Lista de eventos */}
                  <div className="overflow-auto text-xs">
                    {eventosDoDia.map((evento) => (
                      <div
                        key={evento.id}
                        className="bg-blue-100 rounded px-1 mb-1 truncate"
                        onClick={() => {
                          setEventoSelecionado(evento);
                          setMostrarPopupEditar(true);
                        }}
                      >
                        {evento.nome} ({evento.horario})
                      </div>
                    ))}

                    {habitosDoDia.map((habito) => (
                      <div
                        key={habito.id}
                        className="bg-yellow-100 rounded px-1 mb-1 truncate"
                      >
                        {habito.nome}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
                      ref={inputNomeHabito}
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

                  <button
                    className="bg-green-500 text-white px-4 py-2 mt-4 rounded w-full"
                    onClick={createHabito}
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
      {mostrarPopupEditar && eventoSelecionado && (
        <div className="fixed inset-0 bg-gray-100/75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Editar Evento</h2>

            <label className="block mb-2">Nome:</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              value={eventoSelecionado.nome}
              onChange={(e) =>
                setEventoSelecionado({
                  ...eventoSelecionado,
                  nome: e.target.value,
                })
              }
            />

            <label className="block mb-2">Horário:</label>
            <input
              type="time"
              className="w-full p-2 border rounded mb-4"
              value={eventoSelecionado.horario}
              onChange={(e) =>
                setEventoSelecionado({
                  ...eventoSelecionado,
                  horario: e.target.value,
                })
              }
            />

            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={editarEvento}
              >
                Salvar
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={excluirEvento}
              >
                Excluir
              </button>

              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setMostrarPopupEditar(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlannerMensal;
