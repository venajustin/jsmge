import React, { useEffect, useRef } from "react";
import '../css/editor.css';
import CodeEditor from "../components/codeEditor";
import FileExplorer from "../components/FileExplorer.jsx";
import GamePreview from "../components/GamePreview.jsx";




const Editor = () => {

  return (
    <div className="horiz-resize-container">
        <div className="pane-container">
            <div className="editor-container">
                <CodeEditor/>
            </div>
        </div>
        <div className="pane-container">
            <div>
                  <div className="preview-container">
                        <GamePreview/>
                  </div>
                  <div className="lower-right-container">

                      <div className="file-browser-container">
                          <FileExplorer/>
                      </div>

                      <div className="properties-container">
                         <div style={{background_color: 'red'}}>
                             properties here
                         </div>
                      </div>
                  </div>

            </div>


        </div>
    </div>
    // <div style={{display: 'flex'}}>
    //     <CodeEditor style={{display: 'inline-block'}}/>
    //     <FileExplorer style={{display: 'inline-block'}}/>
    // </div>
);
};

export default Editor;
