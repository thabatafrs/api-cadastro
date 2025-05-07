import { useState } from "react";
import PlannerMensal from "../PlannerMensal";
import "./style.css";

function Planner() {
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());

  function Sair() {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redireciona para a página de login
  }

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

  return (
    <div className="container mx-auto px-6 py-8">
      <nav className="flex gap-7 mb-6">
        <a href="">Home</a>
        <a href="">Estatísticas</a>
        <a href="">Hábitos</a>
        <a className="text-red-700" onClick={Sair} href="">
          Sair
        </a>
      </nav>

      <div className="flex justify-center gap-5 items-center m-5">
        <h1 className="text-2xl font-bold">Planner Mensal</h1>
        {/* Select de mês */}
        <select
          className=" p-2"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(Number(e.target.value))}
        >
          {nomesMeses.map((nome, index) => (
            <option key={index} value={index}>
              {nome}
            </option>
          ))}
        </select>
      </div>

      {/* Passa o mês como prop */}
      <PlannerMensal mes={mesSelecionado} />
    </div>
  );
}

export default Planner;
