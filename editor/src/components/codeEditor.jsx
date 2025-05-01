import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

const codeEditor = () => {
  const editorRef = useRef();
  const [activeFile, setActiveFile] = useState("");
  const [files, setFiles] = useState({});

  useEffect(() => {
    fetch("/files")
      .then((response) => response.json())
      .then((data) => {
        console.log("Response JSON:", data);
        setFiles(data);
        const firstFile = Object.keys(data)[0];
        setActiveFile(firstFile);
      })
      .catch((error) => console.error("Error fetching files:", error));
  }, []);


  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    editor.getAction("editor.action.formatDocument").run();
  };
  return (
    <>
        <div style={{ width: "100%", display: "flex", gap: "8px", padding: "8px", backgroundColor: "#1e1e1e" }}>
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
        <div style={{flex: "1"}}>
            <Editor
                width="100%"
                height="100%"
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

    </>
  );
};

export default codeEditor;
