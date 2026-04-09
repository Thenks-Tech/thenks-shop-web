import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface AddressMapProps {
  address: string;
  lat: number | null;
  lng: number | null;
  onAddressChange: (address: string) => void;
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

const DEFAULT_CENTER: [number, number] = [-1.2921, 36.8219]; // Nairobi

export function AddressMap({
  address,
  lat,
  lng,
  onAddressChange,
  onLocationChange,
}: AddressMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [searching, setSearching] = useState(false);

  const updateMarker = useCallback(
    (latlng: [number, number], newAddress?: string) => {
      if (!mapInstance.current) return;

      if (markerRef.current) {
        markerRef.current.setLatLng(latlng);
      } else {
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:#FF9900;border-radius:50%;border:3px solid #05255E;box-shadow:0 2px 8px rgba(0,0,0,0.2)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#05255E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
        markerRef.current = L.marker(latlng, { icon }).addTo(
          mapInstance.current,
        );
      }

      mapInstance.current.flyTo(latlng, 15, { duration: 0.8 });

      if (newAddress) {
        onLocationChange(latlng[0], latlng[1], newAddress);
      } else {
        onLocationChange(latlng[0], latlng[1], address);
      }
    },
    [address, onLocationChange],
  );

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const center: [number, number] =
      lat !== null && lng !== null ? [lat, lng] : DEFAULT_CENTER;

    const map = L.map(mapRef.current, {
      center,
      zoom: lat !== null ? 15 : 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      updateMarker([clickLat, clickLng]);
      reverseGeocode(clickLat, clickLng);
    });

    mapInstance.current = map;

    if (lat !== null && lng !== null) {
      updateMarker([lat, lng]);
    }

    return () => {
      map.remove();
      mapInstance.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reverseGeocode = async (rlat: number, rlng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${rlat}&lon=${rlng}&format=json`,
      );
      const data = await res.json();
      if (data.display_name) {
        onAddressChange(data.display_name);
        onLocationChange(rlat, rlng, data.display_name);
      }
    } catch {
      // silent fail
    }
  };

  const searchAddress = async () => {
    if (!address.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      );
      const data = await res.json();
      if (data.length > 0) {
        const result = data[0];
        const newLat = parseFloat(result.lat);
        const newLng = parseFloat(result.lon);
        updateMarker([newLat, newLng], result.display_name);
        onAddressChange(result.display_name);
      }
    } catch {
      // silent fail
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchAddress();
            }}
            className="input pl-10 pr-3"
            placeholder="Type an address or click the map"
          />
        </div>
        <button
          type="button"
          onClick={searchAddress}
          disabled={searching}
          className="btn-secondary shrink-0 px-3"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={mapRef}
        className="h-48 overflow-hidden rounded-xl border border-gray-200 sm:h-56"
      />
      {lat !== null && (
        <p className="text-[10px] text-gray-400">
          {lat.toFixed(5)}, {lng?.toFixed(5)}
        </p>
      )}
    </div>
  );
}
