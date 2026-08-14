import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState(false);
  const [login, result] = useMutation(LOGIN, {
    onCompleted: () => {
      setUsername("");
      setPassword("");
      navigate("/");
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    }
  }, [result.data]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login({ variables: { username, password } });
    } catch (error) {
      setFailure(true);
    }
  };
  return (
    <div>
      {failure && <div>login failed</div>}
      <form onSubmit={submit}>
        <div>
          <label htmlFor="username">username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
