import React from 'react';
import '../index.css';

const Home = () => {
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
        <button className='custom-button'>
          Login
        </button>
        <br></br>
        <button className='custom-button'>
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
    </div>
            </>
  );
};

export default Home;
