import { useState } from "react";
import YearPixels from "../../components/yearPixels";
import CabecalhoNav from "../../components/cabecalhoNav";

function YearPixelsPage() {
  const hoje = new Date();
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());
  const [dados, setDados] = useState({});

  return (
    <div className="container mx-auto py-8">
      <CabecalhoNav />

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Year in Pixels</h1>

        <select
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
          className="p-2"
        >
          {[2023, 2024, 2025, 2026].map((ano) => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>

      <YearPixels
        ano={anoSelecionado}
        dados={dados}
        setDados={setDados}
      />
    </div>
  );
}

export default YearPixelsPage;
