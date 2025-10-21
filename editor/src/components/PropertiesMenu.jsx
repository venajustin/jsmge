import React, { useEffect, useRef, useState } from "react";
import "../css/propertiesMenu.css";
import * as Tweakpane from "tweakpane";

const PropertiesMenu = () => {
  const containerRef = useRef(null);
  const paneRef = useRef(null);
  // Holds scene data and sets selected object to index 0
  const [sceneData, setSceneData] = useState(null);
  const [selectedObjectIndex, setSelectedObjectIndex] = useState(0);

  useEffect(() => {
    // Fetch the hardcoded JSON file from public folder
    fetch('/jsonTestObjects/output.json')
      .then(response => response.json())
      .then(data => {
        setSceneData(data);
      })
      .catch(error => console.error('Error loading object data:', error));
  }, []);

  useEffect(() => {
    if (!sceneData || !sceneData._objects || !containerRef.current) return;

    const currentObject = sceneData._objects[selectedObjectIndex];
    if (!currentObject) return;

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
          // Create a folder for these vector properties
          // Can add customization for each field if necessary
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

      {/* Tweakpane Container */}
      <div ref={containerRef} className="properties-menu"></div>
    </div>
  );
};

export default PropertiesMenu;