import { SetStateAction, Dispatch } from "react";
import { MarkerType } from "../types/Marker";

interface UseMarkerDragEndProps {
  setMarkers: Dispatch<SetStateAction<MarkerType[]>>;
  updateMarkerInFirestore: (marker: MarkerType) => void;
}

const useMarkerDragEnd = ({ setMarkers, updateMarkerInFirestore }: UseMarkerDragEndProps) => {
  return (marker: MarkerType, e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const latLng = e.latLng;
      const updatedMarker: MarkerType = {
        ...marker,
        time: Date.now(),
        position: { lat: latLng.lat(), lng: latLng.lng() }
      };
      setMarkers((current) => current.map(m => m.id === marker.id ? updatedMarker : m));
      updateMarkerInFirestore(updatedMarker);
    }
  };
};

export default useMarkerDragEnd;