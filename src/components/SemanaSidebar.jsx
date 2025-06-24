export default function SemanaSidebar({ semanasDoMes, navigate, nomesMeses, mes }) {
  return (
    <div className="flex flex-col justify-evenly">
      {semanasDoMes.map((_, i) => (
        <button
          key={i}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-xs sm:text-sm h-10 mx-1"
          onClick={() => navigate(`/planner-semanal/${nomesMeses[mes]}/${i + 1}`)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
