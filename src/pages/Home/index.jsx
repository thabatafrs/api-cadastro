function Home() {
  return (
    <main className="container mx-auto p-15 flex gap-4 flex-row">
      <section className="w-[50%]">
        <div className="bg-gray-200">
          <h1 className="text-3xl text-center p-7">DayLog</h1>
          <div className="flex justify-around mt-2">
            <button>entrar</button>
            <button>cadastrar</button>
          </div>
          <form action="" className="flex flex-col m-10">
            <input type="email" placeholder="Digite o email" />
            <input type="password" placeholder="Digite a senha" />
            <button>iniciar jornada</button>
          </form>
        </div>
      </section>
      <section className="w-[50%]"> 
        <p>
          Com o DayLog, acompanhar seus hábitos, organizar tarefas e anotar
          pensamentos nunca foi tão fácil
        </p>
        <p>aqui vai a imagem</p>
      </section>
    </main>
  );
}

export default Home;
