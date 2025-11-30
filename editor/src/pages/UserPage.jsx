
import React, {useEffect, useRef, useState} from "react";
import '../css/userGames.css';
import UserGames from "../components/UserGames";
import Home from "./Home.jsx";
import TitleBar from "../components/TitleBar.jsx";

const UserGamesTest = () => {


  return (
      <div>
        <TitleBar/>
        <div className={"user-games-container"}>
          <UserGames/>
        </div>
      </div>
  );
};

export default UserGamesTest;
