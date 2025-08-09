import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

const codeEditor = ({ activeFile, setActiveFile, editorContent, setEditorContent }) => {
  const editorRef = useRef();
  //const [activeFile, setActiveFile] = useState("");
  const [files, setFiles] = useState({});
  const [openFiles, setOpenFiles] = useState([]); // Array of filenames
    const [fileContents, setFileContents] = useState({}); // { filename: content }

//   useEffect(() => {
//     fetch("/files")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Response JSON:", data);
//         setFiles(data);
//         const firstFile = Object.keys(data)[0];
//         setActiveFile(firstFile);
//       })
//       .catch((error) => console.error("Error fetching files:", error));
//   }, []);
useEffect(() => {
  if (activeFile) {
    setOpenFiles((prev) =>
      prev.includes(activeFile) ? prev : [...prev, activeFile]
    );
    setFileContents((prev) => ({
      ...prev,
      [activeFile]: editorContent,
    }));
  }
}, [activeFile, editorContent]);

const handleTabClick = (file) => {
  setActiveFile(file);
  setEditorContent(fileContents[file] || "");
};
const handleCloseTab = (file) => {
  setOpenFiles((prev) => prev.filter((f) => f !== file));
  // Optionally, switch to another open file if the closed one was active
  if (activeFile === file) {
    const remaining = openFiles.filter((f) => f !== file);
    setActiveFile(remaining.length ? remaining[remaining.length - 1] : "");
    setEditorContent(remaining.length ? fileContents[remaining[remaining.length - 1]] || "" : "");
  }
};

const handleEditorChange = (newValue) => {
  setEditorContent(newValue);
  setFileContents((prev) => ({
    ...prev,
    [activeFile]: newValue,
  }));
};

const handleSave = async () => {
  // Save all open files
  const savePromises = openFiles.map((file) =>
    fetch("http://127.0.0.1:3000/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file, content: fileContents[file] || "" }),
    })
  );
  await Promise.all(savePromises);
  alert("All open files were saved!");

}

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    editor.getAction("editor.action.formatDocument").run();
  };
  return (
    <>
        <div style={{ width: "100%", display: "flex", gap: "8px", padding: "8px", backgroundColor: "#1e1e1e" }}>
      {openFiles.map((file) => (
        <div key={file} style={{ display: "flex", alignItems: "center" }}>
    <button
      onClick={() => handleTabClick(file)}
      style={{
        padding: "6px 12px",
        backgroundColor: activeFile === file ? "#333" : "#555",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderBottom: activeFile === file ? "2px solid yellow" : "none"
      }}
    >
      {file}
    </button>
    <button
      onClick={() => handleCloseTab(file)}
      style={{
        marginLeft: 4,
        background: "transparent",
        color: "#ccc",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold"
      }}
      title="Close"
    >
      ×
    </button>
  </div>
        
      ))}
      <button
        onClick={handleSave}
        style={{
          marginLeft: "auto",
          padding: "6px 18px",
          backgroundColor: "#007acc",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          borderRadius: "4px"
        }}
      >
        Save
      </button>

            {/* <button
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
                </button> */}

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
                //onMount={onMount}
                // value={files[activeFile]}
                // onChange={(newValue) => {
                //     setFiles((prev) => ({
                //         ...prev,
                //         [activeFile]: newValue
                //     }));
                // }}
                value={editorContent}
                onChange={(newValue) => setEditorContent(newValue)}

              />
        </div>

    </>
  );
};

export default codeEditor;
