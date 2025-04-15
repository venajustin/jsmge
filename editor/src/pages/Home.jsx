import React from 'react';
import '../index.css';

const Home = () => {
  return (
    <>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet"></link>
    </head>
      <h2 class='titleWhite'>Welcome to</h2>
      <h1 class='projTitle'>
        <span class='colorBlue'>J</span>
        <span class='colorBlue'>S</span>
        <span class='colorRed'>M</span>
        <span class='colorYellow'>G</span>
        <span class='colorYellow'>E</span>

      </h1>
      <div className="card">
        <button class='custom-button'>
          Login
        </button>
        <br></br>
        <button class='custom-button'>
          Register
        </button>
      </div>
      {/* <p className="read-the-docs">
        Click here for our workbook
      </p>
      <h2>Active Containers</h2>
      <div style={{ border: '5px solid black', maxWidth: '600px', padding: '10px' }} id="machine-list">
          <div dangerouslySetInnerHTML={{ __html: containers }} />
      </div> */}
    </>
  );
};

export default Home;
