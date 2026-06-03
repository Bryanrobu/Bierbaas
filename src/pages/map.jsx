import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../config/firebase.js";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./css/map.css";
import {onAuthStateChanged} from "firebase/auth";

const Default_Center = [52.156, 5.387];

{/* center the map on your location, only once */}

function SetView({ coords }) {
  const map = useMap();
  const centered = useRef(false);

  useEffect(() => {
    if (!centered.current) {
      map.setView(coords, 13);
      centered.current = true;
    }
  }, [coords, map]);
  return null;
}

{/* maakt een svg pin icoon */}
function CreatePinIcon(color, size = 32) {
  return L.divIcon({
    className: "",
    html: `
      <svg width="${size}" height="${size * 1.4}" viewBox="0 0 32 45" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="#1a0905" stroke-width="2"/>
        <polygon points="9,26 23,26 16,44" fill="${color}"/>
      </svg>
    `,
    iconSize: [size, size * 1.4],
    iconAnchor: [size / 2, size * 1.4],
    popupAnchor: [0, -size * 1.4],
  });
}

{/* zorgt voor het groter maken van de pins met hover en click */}
function PinMarker({ position, color, children }) {
  const [hoverd, setHoverd] = useState(false);
  const [selected, setSelected] = useState(false);

  const size = hoverd || selected ? 44 : 32;

  return (
    <Marker
      position={position}
      icon={CreatePinIcon(color, size)}
      eventHandlers={{
        mouseover: () => setHoverd(true),
        mouseout: () => setHoverd(false),
        click: () => setSelected((prev) => !prev),
        popupclose: () => setSelected(false),
      }}
    >
      {children}
    </Marker>
  );
}


export default function MapPage() {
  const [position, setPosition] = useState(null);
  const [locaties, setLocaties] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Listen for login/logout and save the ID
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  {/* haalt de locaties uit de database */}
  useEffect(() => {

    if (!userId) return;

    return onSnapshot(collection(db, "posts"), (snapshot) => {
      setLocaties(snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(locatie => locatie.user === userId)
      );
    });
  }, [userId]);

  {/* geeft locatie van gebruiker terug */}
  useEffect(() => {
    const samples = [];
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        samples.push([pos.coords.latitude, pos.coords.longitude]);
        const recent = samples.slice(-5);
        const avg = [
          recent.reduce((sum, p) => sum + p[0], 0) / recent.length,
          recent.reduce((sum, p) => sum + p[1], 0) / recent.length,
        ];
        setPosition(avg);
      },
      (err) => console.warn("Locatie geweigerd:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return (
    <MapContainer
      center={Default_Center}
      zoom={13}
      style={{ height: "calc(100vh - 152px)", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {position && <SetView coords={position} />}

      {/* Jouw locatie */}
      {position && <PinMarker position={position} color="#0055ff" />}

      {/* Database locaties */}
      {locaties
        .filter((l) => l.location?.lat && l.location?.lng)
        .map((locatie) => (
          <PinMarker
            key={locatie.id}
            position={[locatie.location.lat, locatie.location.lng]}
            color="#e8890c"
          >
            <Popup className="beer_map_popup">
              <div className="popup_card">
                <span className="popup_address">{locatie.fullAddress}</span>
                <span className="popup_beer">{locatie.beer}</span>
                <span className="popup_link" onClick={() => Navigate('')}>Bekijk review ➡️</span> {/* TODO nog linken */}
              </div>
            </Popup>
          </PinMarker>
        ))}
    </MapContainer>
  );
}