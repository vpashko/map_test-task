import { SetStateAction, Dispatch } from "react";
import { MarkerType } from "../types/Marker";

interface UseRemoveMarkerProps {
  setMarkers: Dispatch<SetStateAction<MarkerType[]>>;
  removeMarkerFromFirestore: (marker: MarkerType) => void;
}

const useRemoveMarker = ({ setMarkers, removeMarkerFromFirestore }: UseRemoveMarkerProps) => {
  return (marker: MarkerType) => {
    setMarkers((current) => current.filter(m => m.id !== marker.id));
    removeMarkerFromFirestore(marker);
  };
};

export default useRemoveMarker;