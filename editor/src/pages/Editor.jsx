import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import '../css/editor.css';
import CodeEditor from "../components/codeEditor";


import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/selection/active-line";

const Editor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      CodeMirror.fromTextArea(editorRef.current, {
        mode: "javascript",
        theme: "default",
        lineNumbers: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
      });
    }
  }, []);

  return (
    <div>
      <h2>CodeMirror Web IDE</h2>
      <CodeEditor/>
    </div>
  );
};

export default Editor;
