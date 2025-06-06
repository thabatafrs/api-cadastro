import React from "react";

export default function PopupAdicionar({
  mostrarPopup,
  setMostrarPopup,
  diaSelecionado,
  isHabito,
  setIsHabito,
  diasDaSemana,
  diasSemanaSelecionados,
  setDiasSemanaSelecionados,
  inputNomeHabito,
  createHabito,
  inputNomeEvento,
  inputHorarioEvento,
  createEvento,
}) {
  if (!mostrarPopup) return null;

  return (
    <div className="fixed inset-0 bg-gray-100/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-96 text-center">
        {diaSelecionado && (
          <p className="text-gray-600 mb-3">
            Dia selecionado: {diaSelecionado.toLocaleDateString("pt-BR")}
          </p>
        )}
        <div className="flex justify-center gap-3  mb-5 ">
          <button
            className={`font-semibold uppercase ${
              isHabito ? "underline text-black" : "text-gray-600 hover:underline"
            }`}
            onClick={() => setIsHabito(true)}
          >
            Hábito
          </button>
          <button
            className={`font-semibold uppercase ${
              !isHabito ? "underline text-black" : "text-gray-600 hover:underline"
            }`}
            onClick={() => setIsHabito(false)}
          >
            Evento
          </button>
        </div>

        <div>
          {isHabito ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 ">
                <label>Nome:</label>
                <input className="border p-2 rounded w-full" ref={inputNomeHabito} />
              </div>

              <div>
                <label className="block text-left mb-1 font-semibold">Repetir em:</label>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  {diasDaSemana.map((dia, index) => (
                    <label key={index} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={dia}
                        checked={diasSemanaSelecionados.includes(dia)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          if (checked) {
                            setDiasSemanaSelecionados([...diasSemanaSelecionados, value]);
                          } else {
                            setDiasSemanaSelecionados(diasSemanaSelecionados.filter((d) => d !== value));
                          }
                        }}
                      />
                      {dia}
                    </label>
                  ))}
                </div>
              </div>

              <button
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded w-full"
                onClick={createHabito}
              >
                salvar
              </button>
              <button
                onClick={() => setMostrarPopup(false)}
                className="text-sm text-red-500 hover:underline"
              >
                cancelar
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 ">
                <label>Nome:</label>
                <input className="border p-2 rounded w-full" ref={inputNomeEvento} />
              </div>

              <div className="flex items-center gap-3">
                <label>Horário:</label>
                <input
                  className="border p-2 rounded"
                  type="time"
                  ref={inputHorarioEvento}
                />
              </div>

              <button
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded w-full"
                onClick={createEvento}
              >
                salvar
              </button>
              <button
                onClick={() => setMostrarPopup(false)}
                className="text-sm text-red-500 hover:underline"
              >
                cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
