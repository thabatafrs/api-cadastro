import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [isLogin, setIsLogin] = useState(true);

  const variants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <main className="flex min-h-screen bg-white gap-x-10 justify-center">
      <section className="w-[400px] flex items-center justify-center">
        <div className="bg-gray-100 rounded-xl p-12 w-full max-w-md shadow-lg">
          <img src="/logo.png" alt="" className="max-w-sm m-auto" />
          <div className="flex justify-around mb-6">
            <button
              className={`font-semibold uppercase ${
                isLogin
                  ? "underline text-black"
                  : "text-gray-600 hover:underline"
              }`}
              onClick={() => setIsLogin(true)}
            >
              entrar
            </button>
            <button
              className={`font-semibold uppercase ${
                !isLogin
                  ? "underline text-black"
                  : "text-gray-600 hover:underline"
              }`}
              onClick={() => setIsLogin(false)}
            >
              cadastrar
            </button>
          </div>
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <input
                  className="bg-white p-3 rounded shadow-sm"
                  type="email"
                  placeholder="Digite o email"
                />
                <input
                  className="bg-white p-3 rounded shadow-sm"
                  type="password"
                  placeholder="Digite a senha"
                />
                <button className="bg-green-500 hover:bg-green-600 transition text-white uppercase tracking-wide rounded-full px-6 py-3 mt-4">
                  entrar
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <input
                  className="bg-white p-3 rounded shadow-sm"
                  type="email"
                  placeholder="Digite o email"
                />
                <input
                  className="bg-white p-3 rounded shadow-sm"
                  type="password"
                  placeholder="Digite a senha"
                />
                <button className="bg-red-500 hover:bg-red-600 transition text-white uppercase tracking-wide rounded-full px-6 py-3 mt-4">
                  Iniciar jornada
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
      <section className="w-[400px] flex flex-col items-center justify-center text-center">
        <p className="text-lg text-gray-700 max-w-lg">
          Com o <span className="font-bold text-red-500">DayLog</span>,
          acompanhar seus hábitos, organizar tarefas e anotar pensamentos nunca
          foi tão fácil!
        </p>
        <img
          src="/foto-capa.png"
          alt="Ilustração"
          className="w-full max-w-sm mt-6 rounded"
        />
      </section>
    </main>
  );
  s;
}

export default Home;
