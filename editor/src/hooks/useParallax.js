import {useEffect} from "react";

export const useParallax = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Convert mouse position to percentage (-1 to 1)
      const xPercent = (mouseX / windowWidth - 0.5) * 2;
      const yPercent = (mouseY / windowHeight - 0.5) * 2;

      // Parallax speeds
      const cloudSpeedX = 10;
      const cloudSpeedY = 15;
      const mountainSpeedX = 2;

      const cloudOffsetX = xPercent * cloudSpeedX;
      const cloudOffsetY = yPercent * cloudSpeedY;
      const mountainOffsetX = xPercent * mountainSpeedX;

      document.body.style.setProperty('--cloud-transform', `translate(${cloudOffsetX}px, ${cloudOffsetY}px)`);
      document.body.style.setProperty('--mountain-transform', `translateX(${mountainOffsetX}px) translateY(57px)`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
};