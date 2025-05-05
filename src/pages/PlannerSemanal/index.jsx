import React from "react";

function PlannerSemanal() {
  const diasDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <nav className="flex gap-7 mb-6">
        <a href="">Home</a>
        <a href="">Estatísticas</a>
        <a href="">Hábitos</a>
      </nav>

      <div className="flex flex-col justify-center gap-5 items-center m-5">
        <h1 className="text-2xl font-bold">Planner Semanal</h1>
        <div className="grid grid-cols-7 gap-4 p-4">
          {diasDaSemana.map((dia, index) => (
            <div
              key={index}
              className="bg-white border rounded shadow-md p-4 text-center"
            >
              <h2 className="font-bold text-lg mb-2">{dia}</h2>
              {/* Aqui você pode adicionar tarefas, hábitos, etc. */}
              <p className="text-gray-400">Nenhum evento</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlannerSemanal;
