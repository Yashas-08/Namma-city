'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  selectable?: boolean;
  selectedLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: Array<{
    id: string;
    name: string;
    category?: string;
    lat: number;
    lng: number;
    address?: string;
  }>;
  className?: string;
}

export default function LeafletMap({
  center = [12.9352, 77.6245],
  zoom = 15,
  selectable = false,
  selectedLocation,
  onLocationSelect,
  markers = [],
  className = 'w-full h-full',
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(center, zoom);

      mapInstanceRef.current = map;

      // Add clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Custom Teal Icon for selected point
      const createTealIcon = (label?: string) =>
        L.divIcon({
          className: 'custom-teal-pin',
          html: `
            <div style="display:flex; flex-direction:column; align-items:center;">
              ${label ? `<div style="background:#176B68; color:white; font-size:10px; font-weight:bold; padding:2px 8px; border-radius:12px; margin-bottom:4px; box-shadow:0 2px 4px rgba(0,0,0,0.2); white-space:nowrap;">${label}</div>` : ''}
              <div style="background:#176B68; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
                <div style="background:white; width:8px; height:8px; border-radius:50%;"></div>
              </div>
              <div style="width:2px; height:6px; background:#176B68;"></div>
            </div>
          `,
          iconSize: [40, 50],
          iconAnchor: [20, 48],
        });

      // Custom icons for nearby places
      const createCategoryIcon = (category?: string) => {
        let bg = '#176B68';
        let symbol = '🏛️';
        if (category === 'POLICE') {
          bg = '#1E3A8A';
          symbol = '🛡️';
        } else if (category === 'HOSPITAL') {
          bg = '#DC2626';
          symbol = '🏥';
        } else if (category === 'TRANSPORT') {
          bg = '#059669';
          symbol = '🚌';
        } else if (category === 'POST_OFFICE') {
          bg = '#D97706';
          symbol = '📮';
        }

        return L.divIcon({
          className: 'civic-marker-pin',
          html: `
            <div style="background:${bg}; width:32px; height:32px; border-radius:50%; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center; font-size:14px; color:white;">
              ${symbol}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
      };

      // Add nearby markers
      markers.forEach((m) => {
        const marker = L.marker([m.lat, m.lng], {
          icon: createCategoryIcon(m.category),
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family:sans-serif; padding:2px;">
            <strong style="color:#172322; font-size:12px;">${m.name}</strong>
            ${m.address ? `<p style="color:#687674; font-size:11px; margin:2px 0 0;">${m.address}</p>` : ''}
          </div>
        `);
      });

      // Add selected location marker
      const initialPin = selectedLocation || { lat: center[0], lng: center[1] };
      const selectedMarker = L.marker([initialPin.lat, initialPin.lng], {
        icon: createTealIcon('Koramangala 5th Block'),
        draggable: selectable,
      }).addTo(map);

      markerInstanceRef.current = selectedMarker;

      if (selectable && onLocationSelect) {
        selectedMarker.on('dragend', (e: any) => {
          const latlng = e.target.getLatLng();
          onLocationSelect(latlng.lat, latlng.lng);
        });

        map.on('click', (e: any) => {
          selectedMarker.setLatLng(e.latlng);
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        });
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, selectable, markers]);

  // Update selected location when prop changes
  useEffect(() => {
    if (markerInstanceRef.current && selectedLocation) {
      markerInstanceRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo([selectedLocation.lat, selectedLocation.lng]);
      }
    }
  }, [selectedLocation]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
