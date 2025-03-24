// lib/location/index.ts
'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export interface UserLocation {
  country: string;
  currency: string;
  timezone: string;
}

const DEFAULT_LOCATION = {
  country: 'US',
  currency: 'USD',
  timezone: 'America/New_York',
};

const LOCATION_COOKIE = 'user_location';

export function useUserLocation() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detectLocation() {
      try {
        // First check for existing cookie
        const locationCookie = Cookies.get(LOCATION_COOKIE);
        if (locationCookie) {
          setLocation(JSON.parse(locationCookie));
          setLoading(false);
          return;
        }

        // Otherwise fetch from geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const userLocation = {
          country: data.country_code || DEFAULT_LOCATION.country,
          currency: data.currency || DEFAULT_LOCATION.currency,
          timezone: data.timezone || DEFAULT_LOCATION.timezone,
        };

        Cookies.set(LOCATION_COOKIE, JSON.stringify(userLocation), { expires: 30 });
        setLocation(userLocation);
      } catch (err) {
        console.error('Location detection error:', err);
      } finally {
        setLoading(false);
      }
    }

    detectLocation();
  }, []);

  return { location, loading };
}

export function setUserLocation(newLocation) {
  const current = JSON.parse(Cookies.get(LOCATION_COOKIE) || '{}');
  Cookies.set(LOCATION_COOKIE, JSON.stringify({...current, ...newLocation}), { expires: 30 });
}