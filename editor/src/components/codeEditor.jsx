import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";

const codeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [files, setFiles] = useState({
    "index.js": `function greet(name) {
      console.log("Hello, " + name + "!");
    }
    
    greet("John");`,
    "utils.js": `export function add(a, b) {
      return a + b;
    }`,
  });

  const [activeFile, setActiveFile] = useState("index.js");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    editor.getAction("editor.action.formatDocument").run();
  };
  return (
    <div>
        <div style={{ display: "flex", gap: "8px", padding: "8px", backgroundColor: "#1e1e1e" }}>
            {Object.keys(files).map((file) => (
                <button 
                    key={file}
                    onClick={() => setActiveFile(file)}
                    style={{
                        padding: "6px 12px",
                        backgrounColor: activeFile === file ? "#333" : "#555",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderBottom: activeFile === file ? "2px solid yellow" : "none"
                    }}
                    >
                        {file}
                    </button>
            ))}

            <button
                onClick={() => {
                    const newFileName = `file${Object.keys(files).length + 1}.js`;
                    setFiles({...files, [newFileName]: "// New file"});
                    setActiveFile(newFileName);
                }}
                style={{
                    padding: "6px 12px",
                    backgrounColor: "#007acc",
                    color:"white",
                    border:"none",
                    cursor: "pointer"
                }}
                >
                    + New File
                </button>

        </div>
      <Editor
        height="75vh"
        width="60vw"
        theme="vs-dark"
        defaultLanguage="javascript"
        // defaultValue={`function greet(name) {
        //         console.log("Hello, " + name + "!");
        //     }
            
        //     greet("John");`}
        onMount={onMount}
        value={files[activeFile]}
        onChange={(newValue) => {
            setFiles((prev) => ({
                ...prev,
                [activeFile]: newValue
            }));
        }}
      />
    </div>
  );
};

export default codeEditor;
