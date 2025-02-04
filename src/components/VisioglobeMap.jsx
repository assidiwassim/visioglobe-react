import { useEffect, useRef, useState } from "react";

const VisioglobeMap = () => {
  const mapContainerRef = useRef(null);
  const essentialRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const initializeVisioglobe = async () => {
      if (!window.VisioWebEssential || !window.visioweb) {
        console.error("VisioWeb SDK is missing. Ensure scripts are included in index.html.");
        return;
      }

      essentialRef.current = new window.VisioWebEssential({
        element: mapContainerRef.current,
        imagePath: "/static/img",
      });

      essentialRef.current.setParameters({
        parameters: {
          baseURL: "https://mapserver.visioglobe.com/",
          hash: "kf8c4780d7f58387df3e142068450cc86f28045d1",
          locale: { language: navigator.language },
        },
      });

      try {
        await essentialRef.current.createMapviewer();
        console.log("Visioglobe Map Loaded Successfully");
        setMapLoaded(true);
      } catch (error) {
        console.error("Could not load the map. Check your config:", error);
      }
    };

    if (!mapLoaded) {
      initializeVisioglobe();
    }

    return () => {
      if (essentialRef.current) {
        essentialRef.current = null;
      }
    };
  }, [mapLoaded]);

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      className="uk-container uk-container-expand uk-position-relative uk-padding-remove"
      uk-height-viewport="expand: true"
    />
  );
};

export default VisioglobeMap;
