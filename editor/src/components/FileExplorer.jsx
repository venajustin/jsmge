// File Explorer Component goes here (NOT an entire webpage)
// Default import from https://dgreene1.github.io/react-accessible-treeview/docs/examples-MultiSelectDirectoryTree
import React from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import TreeView, { flattenTree } from "react-accessible-treeview";
import "../css/fileExplorer.css";
import { useEffect, useRef } from "react";
import { useState } from "react";
import ContextMenu from "./ContextMenu";
import { io } from "socket.io-client"


/*
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
*/

const buildTree = (paths) => {
  const root = { name: "testUsr", children: [], path: "" };

  paths.forEach((filePath) => {
    const parts = filePath.split(/[\\/]/); // Split path into parts
    console.log(parts)
   // if (parts.length && parts[0] === "usrcode") parts.shift();
    let current = root;
    let currentPath = ""; // Track relative path

    parts.forEach((part, index) => {
      if (index > 0 && index != 1) {
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
  console.log(root);
  return root;
};

function MultiSelectDirectoryTreeView({setActiveFile, setEditorContent, SERVER_URL}) {
  const [folder, setFolder] = useState({ name: "testUsr", children: [] })
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  //console.log("SERVER_URL:", SERVER_URL);
  const fetchFiles = () => {
    fetch(SERVER_URL + "/files")
      .then((response) => response.json())
      .then((data) => {
        const transformedFolder = buildTree(data);
        //console.log("Transformed Folder Structure:", transformedFolder);
        setFolder(transformedFolder);
      })
      .catch((error) => console.error("Error fetching files:", error));
  };
    
  function loadFiles(update) {
        const data = (update);
        const transformedFolder = buildTree(data);
        setFolder(transformedFolder);
  };

    const server_url_ref = useRef(SERVER_URL);
  useEffect(() => {
    // Call fetchFiles immediately
    fetchFiles();

    // establish socket connection to server 
    const socket = io(server_url_ref.current,
        {
            query: {
                clientType: "react-editor"
            }

        }
    );

    // TODO: remove this, and call it on socket responce
    // Set up an interval to call fetchFiles every second
    // const intervalId = setInterval(fetchFiles, 250);

    // setup socket callbacks for filesystem
    socket.on('files_update', loadFiles);

    // Cleanup the interval when the component unmounts
    // return () => clearInterval(intervalId);
    return () => {
        // clearInterval(intervalId);
        socket.off('files_update', loadFiles);
        socket.disconnect();
    };

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

  // Drag and Drop Event Handlers
  const handleDragStart = (event, element, isBranch) => {
    event.stopPropagation();
    setDraggedItem({
      path: element.path,
      name: element.name,
      isFolder: isBranch
    });

    // Set drag effect
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', element.path);

    // Add visual feedback
    event.target.style.opacity = '0.5';
  };

  const handleDragEnd = (event) => {
    event.target.style.opacity = '';
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (event, element, isBranch) => {
    event.preventDefault();
    event.stopPropagation();

    // Only allow dropping on folders
    if (isBranch) {
      event.dataTransfer.dropEffect = 'move';
      setDragOverItem(element.path);
    } else {
      event.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOverItem(null);
  };

  const handleDrop = (event, targetElement, targetIsBranch) => {
    event.preventDefault();
    event.stopPropagation();

    // Only allow dropping on folders
    if (!targetIsBranch) return;

    const draggedPath = event.dataTransfer.getData('text/plain');
    const targetPath = targetElement.path;

    // Prevent dropping on itself or into its own subdirectory
    if (draggedPath === targetPath || targetPath.startsWith(draggedPath + '/')) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    handleDragAndDrop(draggedPath, targetPath);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragAndDrop = (sourcePath, targetPath) => {
    if (!sourcePath || !draggedItem) return;

    // Extract the filename/foldername from the source path
    const sourcePathParts = sourcePath.split('/');
    const itemName = sourcePathParts[sourcePathParts.length - 1];

    // Construct the new path
    const newPath = targetPath ? `${targetPath}/${itemName}` : itemName;

    // Determine the endpoint based on whether it's a file or folder
    const endpoint = draggedItem.isFolder ? '/folder/move' : '/files/move';

    const requestBody = draggedItem.isFolder
      ? { oldPath: sourcePath, newPath: newPath }
      : { oldPath: sourcePath, newPath: newPath };

    fetch(SERVER_URL + endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Moved ${sourcePath} to ${newPath}`);
          fetchFiles(); // Refresh the file tree
        } else {
          console.error(`Failed to move ${sourcePath}`);
          response.text().then(text => console.error('Server response:', text));
        }
      })
      .catch((error) => {
        console.error('Error moving item:', error);
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

    fetch(SERVER_URL + "/files/" + contextMenu.file, {
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

  fetch(SERVER_URL + "/folder", {
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

    fetch(SERVER_URL + "/files/" + fullPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "" }),
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
  const handleNewFrame = () => {
    const frameName = window.prompt("Enter your Frame name");
    if(!frameName) return;
    fetch(SERVER_URL + "/frames/" + frameName,{
      method: "POST"
    })
    .then((res)=> {
      if(res.ok){
        console.log("created frame");
        fetchFiles();
      }
    })
    .catch((error) => console.error("Error creating file:", error))
      .finally(() =>
        setContextMenu({ visible: false, x: 0, y: 0, file: null })
      );

  }

  const handleNewResource = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*"; //could restrict uploads to just pictures and sounds
    input.onchange = (event) =>{
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
    
    fetch(SERVER_URL + "/resources", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Uploaded resource: ${file.name}`);
          fetchFiles(); // Refresh the file tree
        } else {
          console.error("Failed to upload resource");
          response.text().then((text) => console.error("Server response:", text));
        }
      })
      .catch((error) => console.error("Error uploading resource:", error));

      
    }
    input.click();
  }

  const handleNewFolder = () => {
  if (contextMenu.file === undefined || contextMenu.file === null) return;
  const foldername = window.prompt("Enter new folder name:");
  if (!foldername) return;

  // If contextMenu.file is empty string, create at root
  const fullPath =
    contextMenu.file === "" ? foldername : contextMenu.file + "/" + foldername;

  fetch(SERVER_URL + "/folder", {
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
    fetch(SERVER_URL +  `/files/${filename}`)
      .then((response) => response.text())
      .then((data) =>{
        console.log(data)
        setActiveFile(filename);
        setEditorContent(data);
      })
      .catch((error) => console.error("Error fetching file content:", error));
  };

  // Node renderer with drag and drop support
  const nodeRenderer = ({ element, isBranch, getNodeProps, level }) => {
    const nodeProps = getNodeProps();

    // Only add onClick for files
    if (!isBranch) {
      nodeProps.onClick = () => handleFileClick(element.path);
    }

    // Add drag and drop event handlers
    const dragDropProps = {
      draggable: true,
      onDragStart: (e) => handleDragStart(e, element, isBranch),
      onDragEnd: handleDragEnd,
      onDragOver: (e) => handleDragOver(e, element, isBranch),
      onDragLeave: handleDragLeave,
      onDrop: (e) => handleDrop(e, element, isBranch),
    };

    // Add visual feedback classes
    const isDraggedOver = dragOverItem === element.path && isBranch;
    const isDragging = draggedItem?.path === element.path;

    return (
      <div
        {...nodeProps}
        {...dragDropProps}
        style={{
          paddingLeft: 20 * (level - 1),
          backgroundColor: isDraggedOver ? 'rgba(124, 180, 184, 0.3)' : 'transparent',
          opacity: isDragging ? 0.5 : 1,
          transition: 'background-color 0.2s ease, opacity 0.2s ease'
        }}
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
          nodeRenderer={nodeRenderer}
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
        onNewFrame={handleNewFrame}
        onNewResource={handleNewResource}
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
