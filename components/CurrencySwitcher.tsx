// components/CurrencySwitcher.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUserLocation, setUserLocation } from '@/lib/location';
import { Button } from '@/components/ui/button';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
];

export default function CurrencySwitcher() {
  const { location, loading } = useUserLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencyChange = (currency: string) => {
    setUserLocation({ currency });
    setIsOpen(false);
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
      >
        {location.currency}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
          {CURRENCIES.map(currency => (
            <button
              key={currency.code}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleCurrencyChange(currency.code)}
            >
              {currency.symbol} {currency.code} - {currency.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}