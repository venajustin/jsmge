import React, { useEffect, useRef } from "react";
import '../css/editor.css';
import CodeEditor from "../components/codeEditor";
import FileExplorer from "../components/FileExplorer.jsx";
import GamePreview from "../components/GamePreview.jsx";




const Editor = () => {
  return (
    <div className="horiz-resize-container">
        {/* Left pane - takes remaining space */}
        <div className="left-pane">
            <div className="editor-container">
                <CodeEditor/>
            </div>
            <div className="lower-right-container">
                <div className="file-browser-container">
                    <FileExplorer/>
                </div>
                <div className="properties-container">
                   <div style={{backgroundColor: 'red'}}>
                       properties here
                   </div>
                </div>
            </div>
        </div>

        {/* Game preview - fixed to top right */}
        <div className="game-preview-container">
            <GamePreview/>
        </div>
    </div>
  );
};

export default Editor;
