import React from 'react';
import { useEffect } from 'react';
import '../index.css';
import { useParallax } from '../hooks/useParallax';

const Home = () => {
  useParallax();

    useEffect(() => {
        test_logged();

    }, []);

    const test_logged = async() => {
        // test if user is logged in and redirect to home page

        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        const response = await fetch("http://127.0.0.1:5000/protected", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (response.ok) {
            window.location.href = "/User";
        }
    }


  return (
    <>
      <>
      <link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet"></link>
      </>

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
            <a href="/login">
            <button className='custom-button'>
              Login
            </button>
            </a>
            <br></br>
            <a href="/register">
            <button className='custom-button'>
              Register
            </button>
            </a>
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
