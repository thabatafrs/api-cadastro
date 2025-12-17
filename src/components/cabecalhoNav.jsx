import { Link } from "react-router-dom";

export default function CabecalhoNav() {
      function Sair() {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redireciona para a página de login
  }
    return (          <nav className="flex justify-center sm:justify-start gap-7 mb-6">
        <Link to="/planner">Planner</Link>
        <Link to="/estatisticas">Estatísticas</Link>
        <Link to="/year-pixels">Year in Pixels</Link>
        <Link to="/habitos">Hábitos</Link>

        <a className="text-red-700" onClick={Sair} href="">
          Sair
        </a>
      </nav>)

}