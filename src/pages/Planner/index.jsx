import { useState } from "react";
import PlannerMensal from "../PlannerMensal";
import "./style.css";
import { Link } from "react-router-dom";

function Planner() {
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

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
    <div className="container mx-auto py-8">
      <nav className="flex justify-center sm:justify-start gap-7 mb-6">
        <Link to="/">Home</Link>
        <Link to="/estatisticas">Estatísticas</Link>
        <Link to="/year-pixels">Year in Pixels</Link>        
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
        <select
          className="p-2"
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
        >
          {[2023, 2024, 2025, 2026].map((ano) => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>

      {/* Passa o mês como prop */}
      <PlannerMensal mes={mesSelecionado} ano={anoSelecionado} />
    </div>
  );
}

export default Planner;
