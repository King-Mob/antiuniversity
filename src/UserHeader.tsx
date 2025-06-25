//import { Link } from "react-router";
import { useState } from "react";
import { type user } from "./types";
import { postLogin } from "./requests";

function UserHeader({ user, setUser }: { user: user | undefined; setUser: (user: user | undefined) => void }) {
    const [login, setLogin] = useState(false);
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
                JSON.stringify({ name: username, access_token: loginResponse.access_token })
            );
        }
    }

    function logOut() {
        setUser(undefined);
        localStorage.removeItem("antiuniversity.login.details");
    }

    return (
        <div>
            {user ? (
                <>
                    <p>Logged in as {user.name}</p>
                    <button onClick={logOut}>Log out</button>
                </>
            ) : login ? (
                <>
                    <p>username: antiuniversity.test.new</p>
                    <p>password: letstestourfeatures</p>
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    ></input>
                    <input
                        type="text"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    <button disabled={username.length < 1 || password.length < 1} onClick={tryLogin}>
                        {" "}
                        Login
                    </button>
                </>
            ) : (
                <>
                    {/*
                <Link to="/register">
                        <button>Register</button>
                    </Link>
                */}
                    <button onClick={() => setLogin(true)}>Log in</button>
                </>
            )}
        </div>
    );
}

export default UserHeader;
