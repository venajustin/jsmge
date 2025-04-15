
import { Editor } from '@monaco-editor/react';
import { useRef, useState } from "react";

const codeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus;
        editor.getAction('editor.action.formatDocument').run();
    };
    return (
        <Editor
            height="75vh"
            width="90vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={`function greet(name) {
                console.log("Hello, " + name + "!");
            }
            
            greet("John");`}
            

            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
        />
    )
}

export default codeEditor