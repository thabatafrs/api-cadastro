import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../AuthContent"; 
import { Link } from "react-router-dom";
import CabecalhoNav from "../../components/cabecalhoNav";

function PlannerSemanal() {
  const { mes, semana } = useParams();
  const { token } = useAuth(); 
  const [diasDaSemana, setDiasDaSemana] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [habitos, setHabitos] = useState([]);

  function Sair() {
    localStorage.removeItem("token");
    window.location.href = "/"; 
  }
  useEffect(() => {
    const mesNumero = converterMesParaNumero(mes);
    const dataBase = new Date(`2025-${mesNumero}-01`);
    const dias = getDiasDaSemana(dataBase, semana);
    setDiasDaSemana(dias);

    const fetchEventos = async () => {
      try {
        const response = await api.get("/eventos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEventos(response.data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      }
    };

    const fetchHabitos = async () => {
      try {
        const response = await api.get("/habito", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHabitos(response.data);
      } catch (err) {
        console.error("Erro ao buscar hábitos:", err);
      }
    };

    fetchEventos();
    fetchHabitos();
  }, [mes, semana, token]);

  return (
    <div className="container mx-auto px-6 py-8">
      <CabecalhoNav />

      <h1 className="text-2xl font-bold mb-4">Planner Semanal</h1>
      <p className="text-lg">
        Mês: {mes} | Semana: {semana}
      </p>

      <div className="grid grid-cols-4 gap-4 mt-6 w-full">
        {diasDaSemana.map((dia, index) => {
          const dataString = dia.toISOString().split("T")[0];
          const eventosDoDia = eventos.filter((e) =>
            e.data.startsWith(dataString)
          );

          return (
            <div
              key={index}
              className="bg-white border rounded shadow-md p-4 text-center"
            >
              <h2 className="font-bold text-lg mb-2">
                {dia.toLocaleDateString("pt-BR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </h2>

              <div className="text-left">
                <h3 className="font-semibold">Eventos:</h3>
                {eventosDoDia.length > 0 ? (
                  eventosDoDia.map((ev) => (
                    <div
                      key={ev.id}
                      className="text-sm bg-blue-100 rounded px-2 py-1 mb-1"
                    >
                      {ev.nome} ({ev.horario})
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Nenhum evento</p>
                )}

                <h3 className="font-semibold mt-2">Hábitos:</h3>
                {habitos.map((hab) => (
                  <div
                    key={hab.id}
                    className="text-sm bg-yellow-100 rounded px-2 py-1 mb-1"
                  >
                    {hab.nome}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function converterMesParaNumero(mes) {
  const nomes = [
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
  const index = nomes.findIndex((m) => m.toLowerCase() === mes.toLowerCase());
  return String(index + 1).padStart(2, "0");
}

function getDiasDaSemana(dataBase, numeroSemana) {
  const start = new Date(dataBase);
  start.setDate(1 + (numeroSemana - 1) * 7);
  const dias = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d.getMonth() === dataBase.getMonth()) {
      dias.push(d);
    }
  }
  return dias;
}

export default PlannerSemanal;
