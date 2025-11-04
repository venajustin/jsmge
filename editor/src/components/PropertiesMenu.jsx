import React, { useEffect, useRef, useState } from "react";
import "../css/propertiesMenu.css";
import * as Tweakpane from "tweakpane";

const PropertiesMenu = () => {
  const containerRef = useRef(null);
  const paneRef = useRef(null);
  const [sceneData, setSceneData] = useState(null);
  const [selectedObjectIndex, setSelectedObjectIndex] = useState(0);
  const [imageSources, setImageSources] = useState([]); // Changed from useRef to useState

  useEffect(() => {
    // Fetch the hardcoded JSON file from public folder
    fetch('/jsonTestObjects/output.json')
      .then(response => response.json())
      .then(data => {
        setSceneData(data);
      })
      .catch(error => console.error('Error loading object data:', error));

      
  }, []);

  // useEffect(() => {
  //   // establish socket connection to server 
  //   const socket = io(server_url_ref.current,
  //       {
  //           query: {
  //               clientType: "react-editor"
  //           }

  //       }
  //   );

  //   // TODO: remove this, and call it on socket responce
  //   // Set up an interval to call fetchFiles every second
  //   // const intervalId = setInterval(fetchFiles, 250);

  //   // setup socket callbacks for filesystem
  //   socket.on("edit:selected", (obj) => {
  //     console.log("selection broadcast:", obj);
  //   });

  //   // Cleanup the interval when the component unmounts
  //   // return () => clearInterval(intervalId);
  //   return () => {
  //       // clearInterval(intervalId);
  //       socket.off('edit:selected', obj);
  //       socket.disconnect();
  //   };

  // }, []);

  useEffect(() => {
    if (!sceneData || !sceneData._objects || !containerRef.current) return;

    const currentObject = sceneData._objects[selectedObjectIndex];
    if (!currentObject) return;

    // Extract image sources from animated_sprites (if exists)
    let sources = [];
    if (currentObject._animated_sprites &&
        currentObject._animated_sprites.length > 0 &&
        currentObject._animated_sprites[0]._image_sources) {
      sources = currentObject._animated_sprites[0]._image_sources.map(src => src.img);
    }
    setImageSources(sources); // Update state to trigger re-render

    // Create the Tweakpane
    const pane = new Tweakpane.Pane({
      title: `Properties - Object ${selectedObjectIndex + 1}`,
      container: containerRef.current
    });

    paneRef.current = pane;

    // Filter and process properties
    const processObject = (obj, paneInstance, path = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const fullPath = path ? `${path}.${key}` : key;

        // Skip arrays (except _objects which is handled separately)
        if (Array.isArray(value)) {
          return;
        }

        // Handle special underscore properties
        if (key === '_pos' || key === '_rot' || key === '_sca') {
          const folder = paneInstance.addFolder({ title: key.slice(1).toUpperCase() });
          folder.addBinding(value, 'x', { min: -1000, max: 1000, step: 1 });
          folder.addBinding(value, 'y', { min: -1000, max: 1000, step: 1 });
          folder.addBinding(value, 'z', { min: -1000, max: 1000, step: 1 });
          return;
        }

        if (key === '_speed') {
          paneInstance.addBinding(obj, key, {
            label: 'Speed',
            min: 0,
            max: 2,
            step: 0.01
          });
          return;
        }

        // Ignore all other underscore properties
        if (key.startsWith('_')) {
          return;
        }

        // Ignore ess_cn
        if (key === 'ess_cn') {
          return;
        }

        // Handle nested objects (create folders with dropdowns)
        if (typeof value === 'object' && value !== null) {
          const folder = paneInstance.addFolder({ title: key, expanded: false });
          processObject(value, folder, fullPath);
          return;
        }

        // Handle primitive values
        if (typeof value === 'number') {
          paneInstance.addBinding(obj, key, { label: key });
        } else if (typeof value === 'boolean') {
          paneInstance.addBinding(obj, key, { label: key });
        } else if (typeof value === 'string') {
          paneInstance.addBinding(obj, key, { label: key });
        }
      });
    };

    // Process the object
    processObject(currentObject, pane);

    // Listen for changes (for future POST/PUT implementation)
    pane.on('change', (event) => {
      console.log('Property changed:', event);
      console.log('Updated object:', currentObject);
      // TODO: Send PUT/POST request to backend here
    });

    // Cleanup
    return () => {
      pane.dispose();
    };
  }, [sceneData, selectedObjectIndex]);

  const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.add('drag-over');
};

const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove('drag-over');
};

// Helper function to add an image source to the list
const addImageSource = (imagePath) => {
  // Check: Does the path exist? Is it not already in our list?
  if (imagePath && !imageSources.includes(imagePath)) {

    // Create a new array with existing sources + the new path (immutability)
    const newSources = [...imageSources, imagePath];
    setImageSources(newSources);

    // Update the scene data JSON
    updateAnimatedSprite(newSources);
    console.log('Image added to sources:', imagePath);
    console.log('All sources:', newSources);
  }
};

const handleDrop = (e) => {
  // Prevent Default Browser Behavior
  // Stop the browser from opening/downloading the dropped file
  e.preventDefault();
  // Stop the event from bubbling up to parent elements
  e.stopPropagation();
  // Remove the visual highlight from the drop zone
  e.currentTarget.classList.remove('drag-over');

  console.log('Drop event triggered');

  // Check if  Local Computer File(s)
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {

    // Get first file from the dropped files
    const file = e.dataTransfer.files[0];

    // Extract the filename
    const fileName = file.name;

    // Log file information for debugging and backend team reference
    console.log('Local file dropped:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Add the filename to image sources
    addImageSource(fileName);
    return;
  }

  // Handle Internal Directory FileExplorer Drag
  const imagePath = e.dataTransfer.getData('text/plain');
  console.log('Data transfer text:', imagePath);

  // Add the FileExplorer path to image sources
  addImageSource(imagePath);
};

  const handleDeleteImage = (index) => {
    const newSources = imageSources.filter((_, i) => i !== index);
    setImageSources(newSources);
    updateAnimatedSprite(newSources);
  };

  const updateAnimatedSprite = (sources) => {
    if (!sceneData) return;

    const currentObject = sceneData._objects[selectedObjectIndex];

    // Initialize _animated_sprites if it doesn't exist
    if (!currentObject._animated_sprites) {
      currentObject._animated_sprites = [];
    }

    // Create or update the first animated sprite
    if (currentObject._animated_sprites.length === 0) {
      currentObject._animated_sprites.push({
        _pos: { x: 0, y: 0, z: 0 },
        _rot: { x: 0, y: 0, z: 0 },
        _sca: { x: 1, y: 1, z: 1 },
        _parent: { ess_cn: "UD" },
        _children: [],
        _animated_sprites: [],
        _colliders: [],
        _image_sources: [],
        _frames: [],
        _index: 0,
        _animations: [[]],
        _playing: false,
        _selected_animation: 0,
        _speed: 0.15,
        ess_cn: "AnimatedSprite"
      });
    }

    // Update image sources
    currentObject._animated_sprites[0]._image_sources = sources.map(img => ({
      img: img,
      w: 256,
      h: 256,
      count: 1
    }));

    console.log('Updated animated sprite:', currentObject._animated_sprites[0]);
    // TODO: Send PUT/POST request to backend here
  };

  if (!sceneData || !sceneData._objects) {
    return <div ref={containerRef} className="properties-menu">Loading...</div>;
  }

  return (
    <div className="properties-menu-wrapper">
      {/* Tab Navigation */}
      <div className="object-tabs">
        {sceneData._objects.map((obj, index) => (
          <button
            key={index}
            className={`object-tab ${selectedObjectIndex === index ? 'active' : ''}`}
            onClick={() => setSelectedObjectIndex(index)}
          >
            {obj.ess_cn || `Object ${index + 1}`}
          </button>
        ))}
      </div>

      {/* Image Sources Section */}
      <div className="image-sources-section">
        <h3>Image Sources</h3>
        <div
          className="image-drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imageSources.length === 0 ? (
            <p className="drop-zone-placeholder">Drag and drop images here</p>
          ) : (
            <ul className="image-list">
              {imageSources.map((imgPath, index) => (
                <li key={index} className="image-item">
                  <span className="image-path">{imgPath}</span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteImage(index)}
                    title="Delete image"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Tweakpane Container */}
      <div ref={containerRef} className="properties-menu"></div>
    </div>
  );
};

export default PropertiesMenu;