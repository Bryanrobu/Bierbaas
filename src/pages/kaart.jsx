import { useEffect, useState } from "react";
import {MapContainer, TileLayer, CircleMarker, Popup, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function SetView({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords]);
  return null;
}

export default function Kaart({ locaties = [] }) {
  const [position, setPosition] = useState([52.156, 5.387]); // fallback

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn("Locatie geweigerd:", err),
    );
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <SetView coords={position} />

      {/* Jouw locatie pin */}
      <CircleMarker
        center={position}
        radius={5}
        pathOptions={{
          color: "#0055ff", // rand kleur
          fillColor: "#0055ff", // vul kleur
          fillOpacity: 1,
        }}
      />

      {/* Locaties van de database */}
      {locaties
        .filter((l) => l.location?.lat && l.location?.lng)
        .map((locatie) => (
          <CircleMarker
            key={locatie.id}
            center={[locatie.location.lat, locatie.location.lng]}
            radius={8}
            pathOptions={{
              color: "#E24A4A",
              fillColor: "#E24A4A",
              fillOpacity: 1,
            }}
          >
            <Popup>
              {locatie.fullAddress}
              <br />
              {locatie.title}
              </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
