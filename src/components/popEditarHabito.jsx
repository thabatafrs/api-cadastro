import React from "react";

export default function PopupEditarHabito({
  mostrarPopupEditarHab,
  setMostrarPopupEditarHab,
  habitoSelecionado,
  setHabitoSelecionado,
  diasDaSemana,
  diasSemanaSelecionados,
  setDiasSemanaSelecionados,
  editHabito,
  excluirHabito,
}) {
  if (!mostrarPopupEditarHab || !habitoSelecionado) return null;

  return (
    <div className="fixed inset-0 bg-gray-100/75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Editar Hábito</h2>

        <label className="block mb-2">Nome:</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          value={habitoSelecionado.nome}
          onChange={(e) =>
            setHabitoSelecionado({
              ...habitoSelecionado,
              nome: e.target.value,
            })
          }
        />

        <label className="block mb-2">Dias:</label>
        {diasDaSemana.map((dia, index) => (
          <label key={index} className="flex items-center gap-1">
            <input
              type="checkbox"
              value={dia}
              checked={diasSemanaSelecionados.includes(dia)}
              onChange={(e) => {
                const { value, checked } = e.target;
                if (checked) {
                  setDiasSemanaSelecionados((prev) => [...prev, value]);
                } else {
                  setDiasSemanaSelecionados((prev) =>
                    prev.filter((d) => d !== value)
                  );
                }
              }}
            />
            {dia}
          </label>
        ))}

        <div className="flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={editHabito}
          >
            Salvar
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={excluirHabito}
          >
            Excluir
          </button>

          <button
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={() => setMostrarPopupEditarHab(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
