import { Link } from "react-router";
import { useState } from "react";
import { type user } from "./types";
import { postLogin, getUsernameAvailable, postRegister, joinRoom } from "./requests";

function UserHeader({ user, setUser }: { user: user | undefined; setUser: (user: user | undefined) => void }) {
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const [registrationLoading, setRegistrationLoading] = useState(false);
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function tryLogin() {
        const loginResponse = await postLogin(username, password);
        if (loginResponse.access_token) {
            setUser({
                name: username,
                access_token: loginResponse.access_token,
            });
            localStorage.setItem(
                "antiuniversity.login.details",
                JSON.stringify({
                    name: username,
                    access_token: loginResponse.access_token,
                })
            );
            setError("");
        } else {
            setError("Login failed");
        }
    }

    async function tryRegister() {
        setRegistrationLoading(true);
        const usernameAvailable = await getUsernameAvailable(username);
        if (!usernameAvailable.available) {
            setRegistrationLoading(false);
            setError(usernameAvailable.error);
        } else {
            const registration = await postRegister(username, password);
            if (registration.access_token) {
                setUser({
                    name: username,
                    access_token: registration.access_token,
                });
                localStorage.setItem(
                    "antiuniversity.login.details",
                    JSON.stringify({
                        name: username,
                        access_token: registration.access_token,
                    })
                );
                joinRoom(username, registration.access_token);
            }
        }
    }

    function logOut() {
        setUser(undefined);
        setLogin(false);
        setRegister(false);
        localStorage.removeItem("antiuniversity.login.details");
    }

    return (
        <>
            <h1 id="title">Antiuniversity Festival 2025: 13th-19th October</h1>
            <div id="navbar">
                <Link to="/">
                    <p>Programme</p>
                </Link>
                <Link to="/about">
                    <p>About</p>
                </Link>
                <Link to="/instructions">
                    <p>Instructions</p>
                </Link>
                <Link to="/venues">
                    <p>Venues</p>
                </Link>
                <Link to="/contact">
                    <p>Contact</p>
                </Link>
            </div>
            {user ? (
                <>
                    <p>
                        Logged in as <Link to={`/user/${user.name}`}>{user.name}</Link>
                    </p>
                    <button onClick={logOut}>Log out</button>
                </>
            ) : register ? (
                registrationLoading ? (
                    <>
                        <p>Registration in progress...</p>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        ></input>
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></input>
                        <br />
                        <button disabled={username.length < 1 || password.length < 1} onClick={tryRegister}>
                            {" "}
                            Register
                        </button>
                    </>
                )
            ) : login ? (
                <>
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    ></input>
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    <br />
                    <button disabled={username.length < 1 || password.length < 1} onClick={tryLogin}>
                        {" "}
                        Login
                    </button>
                </>
            ) : (
                <div id="user-button-container">
                    <button onClick={() => setRegister(true)}>Register</button>
                    <button onClick={() => setLogin(true)}>Log in</button>
                </div>
            )}
            {error && <p>{error}</p>}
        </>
    );
}

export default UserHeader;
