import { useEffect, useRef, useState } from "react";

const codeEditor = () => {

  return (
      <div className={"game-controls-and-preview"}>
          <div className={"controls"}>
              <span className={"control-button"} id={"play-button"}>
                  <img height={"20px"} width={"auto"} src={"/play.svg"} alt={"Play"}/>
              </span>
              <span className={"control-button"} id={"pause-button"}>
                  <img height={"20px"} width={"auto"} src={"/pause.svg"} alt={"Pause"}/>
              </span>
          </div>
          <div className="preview-container">
              <iframe
                  id={"game-iframe"}
                  //src="/app/1/gamewindow.html"

                  // for dev without flask running: comment out above and uncomment below
                   src = "http://127.0.0.1:3000/gamewindow.html"

                  allow="fullscreen"
                  width="100%"
                  height="100%"
                  style={{overflow: "hidden"}}
              ></iframe>

          </div>
      </div>

  );
};

export default codeEditor;
