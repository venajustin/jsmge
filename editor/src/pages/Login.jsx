import { useParallax } from '../hooks/useParallax';
import '../index.css';
const Login = () => {
  useParallax()

  const handleLogin = async(e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                body : formData,
            });
            const data = await response.json();
            if(response.ok){
                localStorage.setItem("token", data.token);
                console.log("Token saved:", data.token);


                alert("Login successful");
                window.location.href = "/";
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("error during login:", error);
            alert("An error occured. Please try again");
        
        }

  }

return (
  <>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet"></link>
    </head>
    <div className="home-container">
      <div className="title-group">
        <h2 className='titleWhite'>Welcome to</h2>
        <h1 className='projTitle'>
          <span className='colorBlue'>J</span>
          <span className='colorBlue'>S</span>
          <span className='colorRed'>M</span>
          <span className='colorYellow'>G</span>
          <span className='colorYellow'>E</span>
        </h1>
      </div>
      <div className="card home-container">
        <form
          className="login-form"
          onSubmit={handleLogin}
        >
          <div style={{marginBottom: "10px"}}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="custom-input"
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="custom-input"
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <button className='custom-button' type="submit">
              Login
            </button>
          </div>
        </form>
        <br/>
        <button className='custom-button'>
          Register
        </button>
      </div>
    </div>
  </>
);
    
};

export default Login;