import React, { useEffect, useRef } from "react";
import '../css/editor.css';
import CodeEditor from "../components/codeEditor";




const Editor = () => {

  return (
    <div>
      <h2>Editor</h2>
      <CodeEditor/>
    </div>
  );
};

export default Editor;
