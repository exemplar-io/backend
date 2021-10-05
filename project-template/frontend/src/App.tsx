import { ChangeEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { loginApi } from './api/login';

function App() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [jwt, setJwt] = useState('');

  const onLogin = async () => {
    const res = await loginApi(username, password);
    setJwt(res);
  };

  useEffect(() => {
    if (jwt) console.log('jwt', jwt);
  }, [jwt]);

  const onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        {jwt ? (
          <div>
            <p>Logged in!</p>
          </div>
        ) : (
          <div className="form">
            <div className="input-container">
              <input
                type="text"
                id="username"
                name="username"
                className="input"
                onChange={onUsernameChange}
                defaultValue="admin"
              />
              <input
                type="password"
                id="password"
                name="password"
                className="input"
                defaultValue="password"
                onChange={onPasswordChange}
              />
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <button className="submit" onClick={onLogin}>
              Login
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
