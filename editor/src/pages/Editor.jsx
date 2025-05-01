import React, { useEffect, useRef } from "react";
import '../css/editor.css';
import CodeEditor from "../components/codeEditor";
import FileExplorer from "../components/FileExplorer.jsx";




const Editor = () => {

  return (
    <div>
      <h2>Editor</h2>
      <CodeEditor/>
      <h2>File Selector</h2>
      <FileExplorer/>
      {/* Insert FileExplorer component here */}
    </div>
  );
};

export default Editor;
