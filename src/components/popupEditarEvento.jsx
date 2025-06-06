import React from "react";

export default function PopupEditarEvento({
  mostrarPopupEditar,
  setMostrarPopupEditar,
  eventoSelecionado,
  setEventoSelecionado,
  editarEvento,
  excluirEvento,
}) {
  if (!mostrarPopupEditar || !eventoSelecionado) return null;

  return (
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
  );
}
