import { useEffect, useState } from "react";
import api from "../../services/api";
import jwt_decode from "jwt-decode";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import CabecalhoNav from "../../components/cabecalhoNav";

function Estatisticas() {
  const [habitos, setHabitos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [rankingTotalFeito, setRankingTotalFeito] = useState([]);
  const [rankingPercentual, setRankingPercentual] = useState([]);


  function calcularMaiorSequencia(registros) {
    if (registros.length === 0) return 0;

    // Ordena os registros pela data
    const datas = registros
      .map((r) => new Date(r.data).setHours(0, 0, 0, 0))
      .sort((a, b) => a - b);

    let maiorSequencia = 1;
    let sequenciaAtual = 1;

    for (let i = 1; i < datas.length; i++) {
      // Verifica se o dia atual é exatamente 1 dia depois do anterior
      if (datas[i] === datas[i - 1] + 86400000) {
        sequenciaAtual++;
      } else {
        sequenciaAtual = 1;
      }
      if (sequenciaAtual > maiorSequencia) {
        maiorSequencia = sequenciaAtual;
      }
    }

    return maiorSequencia;
  }

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User not authenticated");
        return;
      }

      const decodedToken = jwt_decode(token);
      const userId = decodedToken.id;

      if (!userId) {
        console.error("User ID is undefined or missing");
        return;
      }

      const responseHabitos = await api.get("/habito", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ano = new Date().getFullYear();
      const primeiroDia = new Date(ano, mesSelecionado, 1)
        .toISOString()
        .split("T")[0];
      const ultimoDia = new Date(ano, mesSelecionado + 1, 0)
        .toISOString()
        .split("T")[0];

      const responseRegistros = await api.get(
        `/habitoRegistro?dataInicio=${primeiroDia}&dataFim=${ultimoDia}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHabitos(responseHabitos.data);
      setRegistros(responseRegistros.data);
    }

    fetchData();
  }, [mesSelecionado]);

  useEffect(() => {
    const mapa = {};

    habitos.forEach((habito) => {
      mapa[habito.nome] = {
        totalFeito: 0,
        totalEsperado: 0,
        diasDaSemana: Array(7).fill(0),
      };

      const registrosHabito = registros.filter((r) => r.habitoId === habito.id);

      const maiorSequencia = calcularMaiorSequencia(registrosHabito);

      mapa[habito.nome].maiorSequencia = maiorSequencia;
    });

    const registrosUnicos = new Set();

    registros.forEach((registro) => {
      const data = new Date(registro.data);
      const dia = data.getDate();
      const mes = data.getMonth();
      const ano = data.getFullYear();
      const chave = `${registro.habitoId}-${ano}-${mes}-${dia}`;

      if (registrosUnicos.has(chave)) return;
      registrosUnicos.add(chave);

      const diaSemana = data.getDay();
      const habito = habitos.find((h) => h.id === registro.habitoId);
      if (habito) {
        mapa[habito.nome].totalFeito += 1;
        mapa[habito.nome].diasDaSemana[diaSemana] += 1;
      }

      console.log(`Hábito: ${habito.nome}, dias:`, habito.dias);
    });

    const ano = new Date().getFullYear();
    const mes = mesSelecionado;
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    habitos.forEach((habito) => {
      // Converte as strings para números
      const habitoDias = habito.dias.map((diaStr) => diasSemanaMap[diaStr]);

      let esperado = 0;

      for (let d = 1; d <= ultimoDia; d++) {
        const data = new Date(ano, mes, d);
        const dia = data.getDay(); // 0 a 6, domingo a sábado
        if (habitoDias.includes(dia)) {
          esperado++;
        }
      }

      mapa[habito.nome].totalEsperado = esperado;
    });

    const rankingPorTotalFeito = Object.entries(mapa)
      .map(([nome, dados]) => ({
        nome,
        totalFeito: dados.totalFeito,
      }))
      .sort((a, b) => b.totalFeito - a.totalFeito);

    const rankingPorPercentual = Object.entries(mapa)
      .map(([nome, dados]) => ({
        nome,
        percentual:
          dados.totalEsperado > 0 ? dados.totalFeito / dados.totalEsperado : 0,
      }))
      .sort((a, b) => b.percentual - a.percentual);

    // Pode salvar esses rankings no estado pra mostrar depois
    setRankingTotalFeito(rankingPorTotalFeito);
    setRankingPercentual(rankingPorPercentual);

    setEstatisticas(mapa);
  }, [habitos, registros, mesSelecionado]);

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const diasSemanaMap = {
    Dom: 0,
    Seg: 1,
    Ter: 2,
    Qua: 3,
    Qui: 4,
    Sex: 5,
    Sáb: 6,
  };

  // Cores para o gráfico de pizza
  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div className="container mx-auto py-8">
      <CabecalhoNav />
      <div className="flex flex-col justify-center gap-5 items-center m-5">
        <h2 className="text-2xl font-bold">Estatísticas de Hábitos</h2>
        <label htmlFor="mes" className="mr-2 font-medium">
          Selecionar mês:
        </label>
        <select
          id="mes"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(Number(e.target.value))}
          className="border p-1 rounded"
        >
          {meses.map((mes, index) => (
            <option key={index} value={index}>
              {mes}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8 p-4">
        <h3 className="text-lg font-semibold mb-4">Ranking por Total Feito</h3>
        <BarChart
          width={300}
          height={300}
          data={rankingTotalFeito}
          layout="vertical"
        >
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="nome" type="category" width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalFeito" fill="#82ca9d" />
        </BarChart>
      </div>

      {Object.entries(estatisticas).map(([nome, dados]) => {
        // Prepara dados para o gráfico de barras
        const dadosBarra = dados.diasDaSemana.map((qtd, i) => ({
          dia: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][i],
          quantidade: qtd,
        }));

        // Dados para o gráfico de pizza
        const dadosPizza = [
          { name: "Feitos", value: dados.totalFeito },
          { name: "Não feitos", value: dados.totalEsperado - dados.totalFeito },
        ];

        return (
          <motion.div
            key={nome}
            className="mb-8 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-2">{nome}</h3>
            <p>
              Feitos: {dados.totalFeito} / {dados.totalEsperado} (
              {dados.totalEsperado > 0
                ? Math.round((dados.totalFeito / dados.totalEsperado) * 100)
                : 0}
              % ) - Total dias no mês:{" "}
              {new Date(
                new Date().getFullYear(),
                mesSelecionado + 1,
                0
              ).getDate()}
            </p>

            <p>Maior sequência consecutiva: {dados.maiorSequencia || 0} dias</p>

            <div className="mt-4 flex flex-wrap gap-15 justify-start">
              {/* Gráfico de Barras */}
              <BarChart width={350} height={250} data={dadosBarra}>
                <XAxis dataKey="dia" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="#8884d8" />
              </BarChart>

              {/* Gráfico de Pizza */}
              <PieChart width={500} height={250}>
                <Pie
                  data={dadosPizza}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default Estatisticas;
