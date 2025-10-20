import React, { useEffect, useRef } from "react";
import "../css/propertiesMenu.css";
import * as Tweakpane from "tweakpane";

const PropertiesMenu = () => {
  const containerRef = useRef(null);
  const paneRef = useRef(null);

  useEffect(() => {
    // Test JSON
    const itemProperties = {
      name: "PlayerSprite",
      visible: true,
      position: { x: 150, y: 220 },
      tint: { r: 255, g: 120, b: 0 }
    };

    // Create the panel and attach it to the container
    const pane = new Tweakpane.Pane({
      title: 'Properties',
      container: containerRef.current
    });

    paneRef.current = pane;

    // Add controls
    pane.addBinding(itemProperties, 'name');
    pane.addBinding(itemProperties, 'visible');

    pane.addBinding(itemProperties, 'position', {
      min: 0,
      max: 800,
      step: 1
    });

    pane.addBinding(itemProperties, 'tint');

    // Cleanup
    return () => {
      pane.dispose();
    };
  }, []);

  return <div ref={containerRef} className="properties-menu"></div>;
};

export default PropertiesMenu;