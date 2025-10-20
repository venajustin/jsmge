import React, {useEffect, useRef, useState} from "react";
import '../css/editor.css';
import CodeEditor from "../components/codeEditor";
import FileExplorer from "../components/FileExplorer.jsx";
import GamePreview from "../components/GamePreview.jsx";
import PropertiesMenu from "../components/PropertiesMenu.jsx";


const Editor = ({appid}) => {


    let SERVER;

    // TODO: remove this feature, used for testing on local machine
    if (appid == 9999999) {
        console.log("APP_ID:" + appid); 
        SERVER = `http://127.0.0.1:3000`.trim()
    } else {

        //TODO make this const when you remove the conditional
        SERVER = `http://127.0.0.1/app/${appid}`.trim()
    }



    let code_width = useState(400)

    const handleMouseDown = (e) => {

        // transparent overlay for dragging over iframe
        const overlay = document.getElementById('drag-overlay');
        overlay.style.display = 'block';

        const startX = e.clientX;
        const resizableElement = document.getElementById('resize-pane'); // target element to resize
        const startWidth = resizableElement.offsetWidth;


        const onMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            resizableElement.style.width = `${startWidth + deltaX}px`;
        };

        const onMouseUp = () => {
            // hide overlay
            overlay.style.display = 'none'; // remove overlay

            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };
    const [activeFile, setActiveFile] = useState("");
const [editorContent, setEditorContent] = useState("");

  return (
    <div className="horiz-resize-container">
        <div id={"drag-overlay"} style={{display: 'none'}}></div>
        <div className="pane-first" id={"resize-pane"}>
            <div className="editor-container">
                <CodeEditor
                    activeFile={activeFile}
                    setActiveFile={setActiveFile}
                    editorContent={editorContent}
                    setEditorContent={setEditorContent}
                    SERVER_URL={SERVER}
                />
            </div>
        </div>
        <div id={"vert-size-bar"} onMouseDown={handleMouseDown}>

            <div id={"vert-size-handle"}>

            </div>
        </div>
        <div className="pane-container">
            <div className={"vertical-auto-container"}>


                <GamePreview
                SERVER_URL={SERVER}
                />

                <div className="lower-right-container">
                      <div className="file-browser-container">
                          <FileExplorer
                             setActiveFile={setActiveFile}
                             setEditorContent={setEditorContent}
                             SERVER_URL={SERVER}
                          />
                      </div>

                      <div className="properties-container">
                        <div className="properties-container">
                          <PropertiesMenu/>
                        </div>
                      </div>
                </div>

            </div>


        </div>
    </div>
    // <div style={{display: 'flex'}}>
    //     <CodeEditor style={{display: 'inline-block'}}/>
    //     <FileExplorer style={{display: 'inline-block'}}/>
    // </div>
);
};

export default Editor;
