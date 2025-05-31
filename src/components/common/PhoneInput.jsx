import React, { useState } from 'react';

const PhoneInput = ({ value, onChange, className, required }) => {
  const [countryCode, setCountryCode] = useState('+91'); // Default to India

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+81', country: 'Japan' },
    { code: '+86', country: 'China' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+61', country: 'Australia' },
  ];

  const handlePhoneChange = (e) => {
    const rawInput = e.target.value;
    // Only allow digits and limit to 10 characters
    const phoneNumber = rawInput.replace(/\D/g, '').slice(0, 10);
    onChange({ target: { name: 'phone', value: phoneNumber } });
  };

  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
  };

  // Get the phone number for display
  const displayNumber = value || '';

  return (
    <div className="relative flex">
      <select
        value={countryCode}
        onChange={handleCountryChange}
        className="absolute left-0 w-20 h-full px-2 py-3 bg-input-background border-r border-secondary/20 text-primary-strong rounded-l-lg focus:outline-none focus:ring-2 focus:ring-icon-green"
      >
        {countryCodes.map(({ code, country }) => (
          <option key={code} value={code}>
            {code} {country}
          </option>
        ))}
      </select>
      <input
        type="tel"
        value={displayNumber}
        onChange={handlePhoneChange}
        className={`w-full pl-24 pr-4 py-3 rounded-lg bg-input-background border border-secondary/20 text-primary-strong placeholder-secondary/70 focus:ring-2 focus:ring-icon-green focus:border-icon-green transition-all duration-200 ${className}`}
        placeholder="Enter phone number"
        pattern="[0-9]*"
        inputMode="numeric"
        required={required}
        maxLength="10"
      />
    </div>
  );
};

export default PhoneInput;
