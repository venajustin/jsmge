import React, { useEffect, useRef } from "react";
import '../css/editor.css';
import CodeEditor from "../components/codeEditor";
import FileExplorer from "../components/FileExplorer.jsx";




const Editor = () => {

  return (
    <div style={{display: 'flex'}}>
      <CodeEditor style={{display: 'inline-block'}}/>
      <FileExplorer style={{display: 'inline-block'}}/>
    </div>
  );
};

export default Editor;
