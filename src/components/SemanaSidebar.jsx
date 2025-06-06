export default function SemanaSidebar({ semanasDoMes, navigate, nomesMeses, mes }) {
  return (
    <div className="flex flex-col mr-4 justify-center">
      {semanasDoMes.map((_, i) => (
        <button
          key={i}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm h-25 mt-2"
          onClick={() => navigate(`/planner-semanal/${nomesMeses[mes]}/${i + 1}`)}
        >
          sem {i + 1}
        </button>
      ))}
    </div>
  );
}
