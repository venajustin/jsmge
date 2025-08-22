
import '../index.css';
const Login = () => {
return (
  <>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet"></link>
    </head>
    <div className="home-container">
      <h2 className='titleWhite'>Welcome to</h2>
      <h1 className='projTitle'>
        <span className='colorBlue'>J</span>
        <span className='colorBlue'>S</span>
        <span className='colorRed'>M</span>
        <span className='colorYellow'>G</span>
        <span className='colorYellow'>E</span>
      </h1>
      <div className="card home-container">
        <form
          className="login-form"
          onSubmit={e => {
            e.preventDefault();
            //logic
            
            alert("Login submitted!");
          }}
        >
          <div style={{ marginBottom: "10px" }}>
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
          <button className='custom-button' type="submit">
            Login
          </button>
        </form>
        <br />
        <button className='custom-button'>
          Register
        </button>
      </div>
    </div>
  </>
);
    
};

export default Login;