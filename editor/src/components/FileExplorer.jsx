// File Explorer Component goes here (NOT an entire webpage)
// Default import from https://dgreene1.github.io/react-accessible-treeview/docs/examples-MultiSelectDirectoryTree
import React from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import TreeView, { flattenTree } from "react-accessible-treeview";
import "../css/fileExplorer.css";
import { useEffect } from "react";
import { useState } from "react";
import ContextMenu from "./ContextMenu";
import { io } from "socket.io-client"


const testFolder = "http://127.0.0.1:3000/files"
const folder = {
  name: "",
  children: [
    {
      name: "This is a test file",
      children: [{ name: "indexTester.js" }, { name: "stylesTester.css" }],
    },
    {
      name: "This is my second folder",
      children: [
        {
          name: "react-accessible-treeview",
          children: [{ name: "index.js" }],
        },
        { name: "react", children: [{ name: "index.js" }] },
      ],
    },
    {
      name: ".npmignore",
    },
    {
      name: "package.json",
    },
    {
      name: "webpack.config.js",
    },
  ],
};

const buildTree = (paths) => {
  const root = { name: "testUsr", children: [], path: "" };

  paths.forEach((filePath) => {
    const parts = filePath.split(/[\\/]/); // Split path into parts
    let current = root;
    let currentPath = ""; // Track relative path

    parts.forEach((part, index) => {
      if (index > 0) {
        currentPath += (currentPath ? "/" : "") + part;
      }

      let child = current.children.find((child) => child.name === part);

      if (!child) {
        child = {
          name: part,
          children: [],
          type: index === parts.length - 1 ? "file" : "directory",
          path: index === 0 ? "" : currentPath,
        };
        current.children.push(child);
      }

      current = child; // Go deeper
    });
  });

  return root;
};



function MultiSelectDirectoryTreeView({setActiveFile, setEditorContent}) {
  const [folder, setFolder] = useState({ name: "testUsr", children: [] })
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });

  const fetchFiles = () => {
    fetch("http://127.0.0.1:3000/files")
      .then((response) => response.json())
      .then((data) => {
        const transformedFolder = buildTree(data);
        //console.log("Transformed Folder Structure:", transformedFolder);
        setFolder(transformedFolder); 
      })
      .catch((error) => console.error("Error fetching files:", error));
  };

  useEffect(() => {
    // Call fetchFiles immediately
    fetchFiles();

    // Set up an interval to call fetchFiles every second
    const intervalId = setInterval(fetchFiles, 250);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  const handleContextMenu = (event, file, isFolder) => {
    event.preventDefault();
    console.log(file);
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      file,
      isFolder,
    });
  };

  const handleClickOutside = () => {
    setContextMenu({ visible: false, x: 0, y: 0, file: null });
  };
  const handleDelete = () => {
    if (!contextMenu.file) return;

    if (contextMenu.isFolder) {
    handleDeleteFolder();
    return;
  }
    

    fetch(`http://127.0.0.1:3000/files?filename=${encodeURIComponent(contextMenu.file)}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log(`${contextMenu.file} deleted successfully`);
          fetchFiles(); 
        } else {
          console.error(`Failed to delete ${contextMenu.file}`);
        }
      })
      .catch((error) => console.error("Error deleting file:", error))
      .finally(() => setContextMenu({ visible: false, x: 0, y: 0, file: null }));
  };

  const handleDeleteFolder = () => {
  if (!contextMenu.file) return;

  fetch("http://127.0.0.1:3000/folder", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ foldername: contextMenu.file }),
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Folder ${contextMenu.file} deleted successfully`);
        fetchFiles();
      } else {
        console.error(`Failed to delete folder ${contextMenu.file}`);
      }
    })
    .catch((error) => console.error("Error deleting folder:", error))
    .finally(() => setContextMenu({ visible: false, x: 0, y: 0, file: null }));
};

  const handleNewFile = () => {
    if (contextMenu.file === undefined || contextMenu.file === null) return;
    const filename = window.prompt("Enter new file name:");
    if (!filename) return;

    // If contextMenu.file is empty string, create at root
    const fullPath =
      contextMenu.file === "" ? filename : contextMenu.file + "/" + filename;

    fetch("http://127.0.0.1:3000/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: fullPath, content: "" }),
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Created file: ${fullPath}`);
          fetchFiles();
        } else {
          console.error("Failed to create file");
        }
      })
      .catch((error) => console.error("Error creating file:", error))
      .finally(() =>
        setContextMenu({ visible: false, x: 0, y: 0, file: null })
      );
  };

  const handleNewFolder = () => {
  if (contextMenu.file === undefined || contextMenu.file === null) return;
  const foldername = window.prompt("Enter new folder name:");
  if (!foldername) return;

  // If contextMenu.file is empty string, create at root
  const fullPath =
    contextMenu.file === "" ? foldername : contextMenu.file + "/" + foldername;

  fetch("http://127.0.0.1:3000/folder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ foldername: fullPath }),
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Created folder: ${fullPath}`);
        fetchFiles();
      } else {
        console.error("Failed to create folder");
      }
    })
    .catch((error) => console.error("Error creating folder:", error))
    .finally(() =>
      setContextMenu({ visible: false, x: 0, y: 0, file: null })
    );
};

  const handleFileClick = (filename) => {
    fetch(`http://127.0.0.1:3000/file?filename=${encodeURIComponent(filename)}`)
      .then((response) => response.json())
      .then((data) =>{
        console.log(data)
        setActiveFile(data.filename);
        setEditorContent(data.content);
      })
      .catch((error) => console.error("Error fetching file content:", error));
  };

  const data = flattenTree(folder).map(node => {
    function findPath(tree, name) {
      if (tree.name === name) return tree.path;
      if (!tree.children) return null;
      for (let child of tree.children) {
        const result = findPath(child, name);
        if (result) return result;
      }
      return null;
    }
    return { ...node, path: findPath(folder, node.name) };
  });
  return (
    <div onClick={handleClickOutside}>
      <div className="ide">
        <TreeView
          data={data}
          aria-label="directory tree"
          togglableSelect
          clickAction="EXCLUSIVE_SELECT"
          multiSelect
          nodeRenderer={({ element, isBranch, getNodeProps, level }) => {
            const nodeProps = getNodeProps();
            // Only add onClick for files
            if (!isBranch) {
              nodeProps.onClick = () => handleFileClick(element.path);
            }
            return (
              <div
                {...nodeProps}
                style={{ paddingLeft: 20 * (level - 1) }}
                onContextMenu={(event) => handleContextMenu(event, element.path, isBranch)}
              >
                {isBranch ? (
                  <FolderIcon isOpen={element.isExpanded} />
                ) : (
                  <FileIcon filename={element.name} />
                )}
                {element.name}
              </div>
            );
          }}
        />
      </div>
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        file={contextMenu.file}
        isFolder={contextMenu.isFolder}
        onDelete={handleDelete}
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
      />
    </div>
  );
}

const FolderIcon = ({ isOpen }) =>
  isOpen ? (
    <FaRegFolderOpen color="e8a87c" className="icon" />
  ) : (
    <FaRegFolder color="e8a87c" className="icon" />
  );

const FileIcon = ({ filename }) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "js":
      return <DiJavascript color="yellow" className="icon" />;
    case "css":
      return <DiCss3 color="turquoise" className="icon" />;
    case "json":
      return <FaList color="yellow" className="icon" />;
    case "npmignore":
      return <DiNpm color="red" className="icon" />;
    default:
      return null;
  }
};
export default MultiSelectDirectoryTreeView;