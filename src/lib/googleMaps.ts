'use client';
// Lightweight Google Maps JS API loader + geocoding helpers (no extra npm dep).
// Reads the key from NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.

let loadPromise: Promise<any> | null = null;

export function loadGoogleMaps(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Google Maps unavailable on server'));
  if ((window as any).google?.maps?.Map) return Promise.resolve((window as any).google.maps);
  if (loadPromise) return loadPromise;

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return Promise.reject(new Error('Google Maps API key missing (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)'));

  loadPromise = new Promise((resolve, reject) => {
    // callback fires only once google.maps (incl. the Map constructor) is ready.
    (window as any).__gmapsReady = () => resolve((window as any).google.maps);
    if (document.getElementById('gmaps-sdk')) {
      if ((window as any).google?.maps?.Map) resolve((window as any).google.maps);
      return;
    }
    const s = document.createElement('script');
    s.id = 'gmaps-sdk';
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=__gmapsReady`;
    s.async = true;
    s.onerror = () => { loadPromise = null; reject(new Error('Failed to load Google Maps')); };
    document.head.appendChild(s);
  });
  return loadPromise;
}

export type GeoResult = { display: string; pincode?: string; city?: string; state?: string };

function parse(result: any): GeoResult {
  const comps = result?.address_components || [];
  const get = (type: string) => comps.find((c: any) => c.types?.includes(type))?.long_name;
  return {
    display: result?.formatted_address || '',
    pincode: get('postal_code'),
    city: get('locality') || get('administrative_area_level_2') || get('sublocality') || get('administrative_area_level_3'),
    state: get('administrative_area_level_1'),
  };
}

// Reverse-geocode a coordinate to a readable address.
export async function reverseGeocode(lat: number, lng: number): Promise<GeoResult> {
  try {
    const maps = await loadGoogleMaps();
    const geocoder = new maps.Geocoder();
    const { results } = await geocoder.geocode({ location: { lat, lng } });
    if (results && results[0]) return parse(results[0]);
    return { display: `${lat.toFixed(5)}, ${lng.toFixed(5)}` };
  } catch {
    return { display: `${lat.toFixed(5)}, ${lng.toFixed(5)}` };
  }
}

// Live place suggestions (Google Places Autocomplete), India-restricted.
export async function searchPlaces(query: string): Promise<{ description: string; placeId: string }[]> {
  try {
    const maps = await loadGoogleMaps();
    const svc = new maps.places.AutocompleteService();
    return await new Promise((resolve) => {
      svc.getPlacePredictions(
        { input: query, componentRestrictions: { country: 'in' } },
        (predictions: any[], status: any) => {
          if (status === maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions.map((p) => ({ description: p.description, placeId: p.place_id })));
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch {
    return [];
  }
}

// Resolve a selected prediction (placeId) → coordinates + formatted address.
export async function placeDetails(placeId: string): Promise<{ lat: number; lng: number; display: string } | null> {
  try {
    const maps = await loadGoogleMaps();
    const geocoder = new maps.Geocoder();
    const { results } = await geocoder.geocode({ placeId });
    if (results && results[0]) {
      const r = results[0];
      return { lat: r.geometry.location.lat(), lng: r.geometry.location.lng(), display: r.formatted_address };
    }
    return null;
  } catch {
    return null;
  }
}
