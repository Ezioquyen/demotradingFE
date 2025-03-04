import React, {useState} from 'react';

function LoginSignup({onLoginSuccess}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gọi API login (ví dụ POST http://localhost:8080/api/auth/login)
            // Tạm mô phỏng:
            const response = {
                id: 1,
                username: username
            };
            // Thông thường:
            const res = await fetch(process.env.REACT_APP_API_BASE_URL + '/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            const data = await res.json();

            if (data.token) {
                onLoginSuccess({id: data.id, username: data.username});
            }

            onLoginSuccess(response);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-page">
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">
                    {isSignup ? 'Sign Up' : 'Login'}
                </button>
            </form>
            <button onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Go to Login' : 'Go to Sign Up'}
            </button>
        </div>
    );
}

export default LoginSignup;
