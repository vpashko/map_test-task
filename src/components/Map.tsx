import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer } from "@react-google-maps/api";
import { getFirestore, addDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore/lite';
import React, { useEffect, useState } from "react";
import { MarkerType } from "../types/Marker";

import './firebaseConfig';
import useRemoveMarker from "../hooks/useRemoveMarker";
import useMarkerDragEnd from "../hooks/useMarkerDragEnd";
import useAddMarker from "../hooks/useAddMarker";


const containerStyle = {
  width: 1000,
  height: 700,
};

const center = {
  lat: 49.8397,
  lng: 24.0297
};

export const Map: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  const db = getFirestore();

  useEffect(() => {
    const fetchMarkers = async () => {
      const markersCollection = collection(db, "markers");
      const markersSnapshot = await getDocs(markersCollection);
      const markersData = markersSnapshot.docs.map(doc => doc.data() as MarkerType);
      setMarkers(markersData);
    };
    fetchMarkers();
  }, [db]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBLKLrOpNK1kZP_GIrsfhe_ebcROpsoQ_s',
  });

  const addMarkerToFirestore = async (marker: MarkerType) => {
    await addDoc(collection(db, "markers"), marker);
  };

  const removeMarkerFromFirestore = async (marker: MarkerType) => {
    const q = query(collection(db, "markers"), where("id", "==", marker.id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  const updateMarkerInFirestore = async (marker: MarkerType) => {
    const q = query(collection(db, "markers"), where("id", "==", marker.id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    await addDoc(collection(db, "markers"), marker);
  };

  const addMarker = useAddMarker({ markers, setMarkers, addMarkerToFirestore });

  const removeMarker = useRemoveMarker({ setMarkers, removeMarkerFromFirestore });

  const onMarkerDragEnd = useMarkerDragEnd({ setMarkers, updateMarkerInFirestore });

  const removeAllMarkers = async () => {
    setMarkers([]);
    const markersCollection = collection(db, "markers");
    const markersSnapshot = await getDocs(markersCollection);
    markersSnapshot.docs.forEach(async doc => {
      await deleteDoc(doc.ref);
    });
  };

  return isLoaded ? (
    <>
      <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onClick={addMarker}
    >
      <MarkerClusterer>
        {(clusterer) => (
          <div>
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                label={{
                  text: `${marker.markerNumber}`,
                  color: 'white',
                } as google.maps.MarkerLabel}
                clusterer={clusterer}
                onClick={() => removeMarker(marker)}
                onDragEnd={(e: google.maps.MapMouseEvent) => onMarkerDragEnd(marker, e)}
                draggable />
            ))}
          </div>
        )}
      </MarkerClusterer>
    </GoogleMap>

    <button onClick={removeAllMarkers}>Remove all markers</button>
    </>
  ) : <></>;
};

export default Map;
