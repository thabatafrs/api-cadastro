import { useEffect, useState } from "react";
import api from "../services/api";

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function YearPixels({ ano }) {
  const [dados, setDados] = useState({});
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [nota, setNota] = useState(3);
  const [highlight, setHighlight] = useState("");
  const [mostrarPopup, setMostrarPopup] = useState(false);

  // ---------- helpers ----------
  const diasNoMes = (mes) => new Date(ano, mes + 1, 0).getDate();

  const corPorNota = (nota) => {
    switch (nota) {
      case 1: return "bg-red-400";
      case 2: return "bg-orange-400";
      case 3: return "bg-yellow-400";
      case 4: return "bg-green-300";
      case 5: return "bg-green-500";
      default: return "bg-gray-100";
    }
  };

  // ---------- carregar do backend ----------
  useEffect(() => {
    async function fetchPixels() {
      try {
        const res = await api.get(`/year-pixels?ano=${ano}`);
        const mapa = {};

        res.data.forEach((p) => {
          const dia = p.data.split("T")[0];
          mapa[dia] = {
            nota: p.nota,
            highlight: p.highlight,
          };
        });

        setDados(mapa);
      } catch (err) {
        console.error("Erro ao carregar YearPixels", err);
      }
    }

    fetchPixels();
  }, [ano]);

  // ---------- abrir popup ----------
  function abrirDia(dataISO) {
    const registro = dados[dataISO];

    setDiaSelecionado(dataISO);
    setNota(registro?.nota || 3);
    setHighlight(registro?.highlight || "");
    setMostrarPopup(true);
  }

  // ---------- salvar ----------
  async function salvar() {
    try {
      await api.post("/year-pixels", {
        data: diaSelecionado,
        nota,
        highlight,
      });

      setDados((prev) => ({
        ...prev,
        [diaSelecionado]: { nota, highlight },
      }));

      setMostrarPopup(false);
    } catch (err) {
      console.error("Erro ao salvar", err);
    }
  }

  async function limparRegistro() {
  const confirmar = window.confirm("Deseja apagar o registro deste dia?");
  if (!confirmar) return;

  try {
    await api.delete("/year-pixels", {
      data: { data: diaSelecionado },
    });

    setDados((prev) => {
      const copia = { ...prev };
      delete copia[diaSelecionado];
      return copia;
    });

    setMostrarPopup(false);
  } catch (err) {
    console.error("Erro ao limpar registro", err);
  }
}


  // ---------- render ----------
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[60px_repeat(12,1fr)] gap-1 text-xs">
        {/* header meses */}
        <div></div>
        {meses.map((m) => (
          <div key={m} className="text-center font-medium">{m}</div>
        ))}

        {/* linhas dias */}
        {Array.from({ length: 31 }).map((_, diaIndex) => (
          <div key={diaIndex} className="contents">
            <div className="text-right pr-1">{diaIndex + 1}</div>

            {meses.map((_, mesIndex) => {
              const totalDias = diasNoMes(mesIndex);
              if (diaIndex + 1 > totalDias) {
                return <div key={mesIndex}></div>;
              }

const data = `${ano}-${String(mesIndex + 1).padStart(2, "0")}-${String(
  diaIndex + 1
).padStart(2, "0")}`;


              const registro = dados[data];

              return (
                <div
                  key={mesIndex}
                  title={registro?.highlight || ""}
                  onClick={() => abrirDia(data)}
                  className={`h-5 w-full cursor-pointer rounded border border-black
                    ${registro ? corPorNota(registro.nota) : "bg-gray-100"}
                  `}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* ---------- POPUP ---------- */}
      {mostrarPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-80 space-y-3">
<h2 className="font-medium">
  {(() => {
    const [y, m, d] = diaSelecionado.split("-");
    return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
  })()}
</h2>


            {/* nota */}
            <div>
              <label className="text-sm">Nota do dia</label>
              <select
                value={nota}
                onChange={(e) => setNota(Number(e.target.value))}
                className="border p-1 w-full rounded"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* highlight */}
            <div>
              <label className="text-sm">Highlight do dia</label>
              <input
                type="text"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="Ex: treino bom, dia puxado..."
                maxLength={80}
                className="border p-2 w-full rounded"
              />
            </div>

            {/* ações */}
            <div className="flex justify-end gap-2 pt-2">
                  <button
    onClick={limparRegistro}
    className="text-sm text-red-600 hover:underline"
  >
    Limpar registro
  </button>
              <button
                onClick={() => setMostrarPopup(false)}
                className="text-sm px-3 py-1"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                className="bg-green-500 text-white text-sm px-3 py-1 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YearPixels;
