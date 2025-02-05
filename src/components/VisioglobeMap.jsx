import { useEffect, useRef, useState } from "react";

const VisioglobeMap = () => {
  const mapContainerRef = useRef(null);
  const essentialRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const initializeVisioglobe = async () => {
      if (!window.VisioWebEssential || !window.visioweb) {
        console.error(
          "VisioWeb SDK is missing. Ensure scripts are included in index.html."
        );
        return;
      }

      essentialRef.current = new window.VisioWebEssential({
        element: mapContainerRef.current,
        imagePath: "/media",
      });

      essentialRef.current.setParameters({
        parameters: {
          baseURL: "https://mapserver.visioglobe.com/",
          hash: "kf8c4780d7f58387df3e142068450cc86f28045d1",
          locale: { language: navigator.language },
          routing: { enabled: true },
        },
      });

      try {
        await essentialRef.current.createMapviewer();
        console.log("Visioglobe Map Loaded Successfully");

        setMapLoaded(true);

        addUserMarkers();
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


  const addUserMarkers = async () => {
    if (!essentialRef.current || !essentialRef.current._mapviewer) {
      console.error("Mapviewer is not available yet...");
      return;
    }

    const mapViewer = essentialRef.current._mapviewer;

    if (mapViewer.addPOI) {
      mapViewer.addPOI({
        id: "user-1",
        position: { x: -13, y: -200, z: 10 },
        zoomScaleFactor: 6,
        url: "https://cdn-icons-png.flaticon.com/512/5225/5225410.png",
      });

      mapViewer.addPOI({
        id: "user-2",
        position: { x: 200, y: -28, z: 10 },
        zoomScaleFactor: 6,
        url: "https://cdn-icons-png.flaticon.com/512/4899/4899329.png",
      });

      console.log("POIs added:", mapViewer.getPOIs());


      const srcNode = mapViewer.getRoutingNode("user-1");
      const dstNode = mapViewer.getRoutingNode("user-2");

      if (!srcNode || !dstNode) {
        console.error("Routing nodes not found for POIs.");
        return;
      }

      console.log("Computing route between:", srcNode, dstNode);

      console.log("Routing Solver:", mapViewer.routingSolver);

      /* try {
       const route = await mapViewer.computeRoute({
          src: srcNode,
          dst: dstNode,
        });

        console.log("Route computed:", route);

          mapViewer.addPolyline({
          id: "route-line",
          coordinates: route.path,
          color: "blue",
          width: 5,
        });

        console.log("Navigation line added.");
      } catch (error) {
        console.error("Error computing route:", error);
      }*/
    } else {
      console.error("addPOI function not found. Check the SDK documentation.");
    }
  };

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      className="uk-container uk-container-expand uk-position-relative uk-padding-remove"
      uk-height-viewport="expand: true"
    ></div>
  );
};

export default VisioglobeMap;
