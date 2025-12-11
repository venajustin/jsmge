import React from "react";
import "../css/fileExplorer.css";

const ContextMenu = ({ x, y, visible, file, isFolder, onDelete, onNewFile, onNewFolder, onNewFrame, onNewResource, onNewScene, onSetScene, addScene}) => {
  if (!visible) return null;

  return (
    <div
      className="context-menu"
      style={{
        top: y,
        left: x,
        position: "absolute",
        zIndex: 1000,
        background: "white",
        border: "1px solid #ccc",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        padding: "5px",
        borderRadius: "3px",
      }}
    >
      <p style={{ margin: 0, padding: "5px 10px", fontWeight: "bold" }}>{file}</p>
      {isFolder && (
        <><button
          onClick={onNewFile}
          style={{
            background: "none",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          New File
        </button>
        <button
          onClick={onNewFrame}
          style={{
            background: "none",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          New Frame
        </button>
        <button
          onClick={onNewResource}
          style={{
            background: "none",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          New Resource
        </button>
        <button
          onClick={onNewFolder}
          style={{
            background: "none",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
            New Folder
          </button>
           <button
          onClick={onNewScene}
          style={{
            background: "none",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
            New Scene
          </button>


          </>
      )}
      <button
        onClick={onDelete}
        style={{
          background: "none",
          border: "none",
          padding: "5px 10px",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        Delete
      </button>
      <button
          onClick={onSetScene}
          style={{
            background: "none",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
            Set Scene
          </button>

        <button
          onClick={addScene}
          style={{
            background: "none",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
            AddToScene
          </button>
    </div>
  );
};

export default ContextMenu;
