import React, { useEffect, useRef, useState } from "react";
import "../css/propertiesMenu.css";
import * as Tweakpane from "tweakpane";

const PropertiesMenu = () => {
  const containerRef = useRef(null);
  const paneRef = useRef(null);
  const [objectData, setObjectData] = useState(null);

  useEffect(() => {
    // Fetch the hardcoded JSON file from public folder
    fetch('/jsonTestObjects/output.json')
      .then(response => response.json())
      .then(data => {
        // For now, select the first object in the _objects array as the "selected" object
        if (data._objects && data._objects.length > 0) {
          setObjectData(data._objects[0]);
        }
      })
      .catch(error => console.error('Error loading object data:', error));
  }, []);

  useEffect(() => {
    if (!objectData || !containerRef.current) return;

    // Create the Tweakpane
    const pane = new Tweakpane.Pane({
      title: 'Properties',
      container: containerRef.current
    });

    paneRef.current = pane;

    // Filter and process properties
    const processObject = (obj, paneInstance, path = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const fullPath = path ? `${path}.${key}` : key;

        // Skip arrays
        if (Array.isArray(value)) {
          return;
        }

        // Handle special underscore properties
        if (key === '_pos' || key === '_rot' || key === '_sca') {
          // Create a folder for these vector properties
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
    processObject(objectData, pane);

    // Listen for changes (for future POST/PUT implementation)
    pane.on('change', (event) => {
      console.log('Property changed:', event);
      console.log('Updated object:', objectData);
      // TODO: Send PUT/POST request to backend here
    });

    // Cleanup
    return () => {
      pane.dispose();
    };
  }, [objectData]);

  return (
    <div ref={containerRef} className="properties-menu"></div>
  );
};

export default PropertiesMenu;