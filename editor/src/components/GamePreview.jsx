import { useEffect, useRef, useState } from "react";

const codeEditor = ({SERVER_URL, socket}) => {
    //console.log(SERVER_URL);

    const handlePlayButton = () => {
        console.log("emitting play button press event");
        fetch(`${SERVER_URL}/test-play`, {
            method: 'POST', // Specify the HTTP method
        })
    }
    const handleEditButton = () => {
        console.log("emitting edit button press event");
        fetch(`${SERVER_URL}/test-edit`, {
            method: 'POST', // Specify the HTTP method
        })

    }


  return (
      <div className={"game-controls-and-preview"}>
          <div className={"controls"}>
              <span onClick={handlePlayButton} className={"control-button"} id={"play-button"}>
                  <img height={"20px"} width={"auto"} src={"/play.svg"} alt={"Play"}/>
              </span>
              <span onClick={handleEditButton} className={"control-button"} id={"pause-button"}>
                  <img height={"20px"} width={"auto"} src={"/pause.svg"} alt={"Pause"}/>
              </span>
          </div>
          <div className="preview-container">
              <iframe
                  id={"game-iframe"}
                  //src="/app/1/gamewindow.html"

                  // for dev without flask running: comment out above and uncomment below
                  src = {SERVER_URL+ "/gamewindow.html"}

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
