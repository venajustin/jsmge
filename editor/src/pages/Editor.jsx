import React, { useEffect, useRef } from "react";
import '../css/editor.css';
import CodeEditor from "../components/codeEditor";
import FileExplorer from "../components/FileExplorer.jsx";
import GamePreview from "../components/GamePreview.jsx";




const Editor = () => {
  return (
    <div className="horiz-resize-container">
        {/* Left pane - just the code editor */}
        <div className="left-pane">
            <div className="editor-container">
                <CodeEditor/>
            </div>
        </div>

        {/* Right pane - game preview on top, file browser/properties below */}
        <div className="right-pane">
            {/* Game preview - fixed to top right */}
            <div className="game-preview-container">
                <GamePreview/>
            </div>

            {/* File browser and properties below game preview */}
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
    </div>
  );
};

export default Editor;
