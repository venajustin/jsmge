import { useEffect, useRef, useState } from "react";

const codeEditor = () => {

  return (
    <>

        <div id="game-container">
            <iframe
            src="/app/1/gamewindow.html"
            allow="fullscreen"
            width="1024"
            height="768"
            ></iframe>
        </div>

    </>
  );
};

export default codeEditor;
