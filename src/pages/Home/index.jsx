import { useEffect, useState, useRef } from "react";
import "./style.css";
import api from "../../services/api";

function Home() {
  const [users, setUsers] = useState([]);

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  async function getUsers() {
    const usersFromApi = await api.get("/usuarios");
    setUsers(usersFromApi.data);
  }

  async function createUsers() {
    await api.post("/usuarios", {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    });

    getUsers();
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`);

    getUsers();
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form>
        <h1>Cadastro</h1>
        <input
          name="nome"
          placeholder="Nome"
          type="text"
          ref={inputName}
        ></input>
        <input
          name="idade"
          placeholder="Idade"
          type="number"
          ref={inputAge}
        ></input>
        <input
          name="email"
          placeholder="Email"
          type="email"
          ref={inputEmail}
        ></input>
        <button type="button" onClick={createUsers}>
          Cadastrar
        </button>
      </form>

      {users.map((user) => (
        <div className="card" key={user.id}>
          <div>
            <p>Nome: {user.name}</p>
            <p>Idade: {user.age}</p>
            <p>Email: {user.email}</p>
          </div>
          <button onClick={() => deleteUsers(user.id)}>Lixeira</button>
        </div>
      ))}
    </div>
  );
}

export default Home;
