import { SetStateAction, Dispatch } from "react";
import { MarkerType } from "../types/Marker";

interface UseAddMarkerProps {
  markers: MarkerType[];
  setMarkers: Dispatch<SetStateAction<MarkerType[]>>;
  addMarkerToFirestore: (marker: MarkerType) => void;
}

export default function useAddMarker({ markers, setMarkers, addMarkerToFirestore }: UseAddMarkerProps) {
  return (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const latLng = e.latLng;
      const newMarker: MarkerType = {
        id: +(Math.random() *  Date.now()).toFixed(0),
        markerNumber: markers.length === 0 ? 1 : Math.max(...markers.map(m => m.markerNumber)) + 1,
        time: Date.now(),
        position: { lat: latLng.lat(), lng: latLng.lng() }
      };
      setMarkers((current) => [...current, newMarker]);
      addMarkerToFirestore(newMarker);
    }
  };
};