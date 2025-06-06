export default function CabecalhoSemana({ diasDaSemana }) {
  return (
    <div className="grid grid-cols-7 gap-2 mb-2">
      {diasDaSemana.map((dia, i) => (
        <div key={i} className="text-center font-semibold text-gray-700">
          {dia}
        </div>
      ))}
    </div>
  );
}
