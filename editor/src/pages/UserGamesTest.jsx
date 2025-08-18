import React, {useEffect, useRef, useState} from "react";
import '../css/userGames.css';
import UserGames from "../components/UserGames";
import Home from "./Home.jsx";

const UserGamesTest = () => {
  return (
    <div className={"user-games-container"}>
      <UserGames/>
    </div>
  );
};

export default UserGamesTest;