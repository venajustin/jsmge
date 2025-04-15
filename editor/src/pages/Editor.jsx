import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";

// Import CodeMirror 5 styles
import "codemirror/lib/codemirror.css";

// Import JavaScript mode and useful addons
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
      <textarea ref={editorRef} defaultValue={`console.log('Hello, CodeMirror!');`} />
    </div>
  );
};

export default Editor;
