
import React from 'react';
import { renderHook } from '@testing-library/react';
import { useFormattedDate } from './time';
import { UserPreferencesContext } from '../../context/UserPreferencesContext';

describe('useFormattedDate', () => {
  const mockPreferences = {
    TZ: 'Europe/Paris',
    Date_Format: '24h',
  };

  const wrapper = ({ children }) => (
    <UserPreferencesContext.Provider value={{ preferences: mockPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );

  it('should format a valid date', () => {
    const { result } = renderHook(() => useFormattedDate(), { wrapper });
    const formattedDate = result.current.formatADate('2024-01-01T12:00:00Z');
    expect(formattedDate).toBe('01/01/2024 13:00');
  });

  it('should return an empty string for an invalid date', () => {
    const { result } = renderHook(() => useFormattedDate(), { wrapper });
    const formattedDate = result.current.formatADate('invalid-date');
    expect(formattedDate).toBe('');
  });

  it('should return an empty string for a null date', () => {
    const { result } = renderHook(() => useFormattedDate(), { wrapper });
    const formattedDate = result.current.formatADate(null);
    expect(formattedDate).toBe('');
  });

  it('should use the default time zone if none is provided', () => {
    const wrapper = ({ children }) => (
        <UserPreferencesContext.Provider value={{ preferences: {} }}>
          {children}
        </UserPreferencesContext.Provider>
      );
    const { result } = renderHook(() => useFormattedDate(), { wrapper });
    const formattedDate = result.current.formatADate('2024-01-01T12:00:00Z');
    expect(formattedDate).toBe('01/01/2024 13:00');
  });

  it('should use the 12h format if specified', () => {
    const mockPreferences = {
        TZ: 'Europe/Paris',
        Date_Format: '12h',
      };
      const wrapper = ({ children }) => (
        <UserPreferencesContext.Provider value={{ preferences: mockPreferences }}>
          {children}
        </UserPreferencesContext.Provider>
      );
    const { result } = renderHook(() => useFormattedDate(), { wrapper });
    const formattedDate = result.current.formatADate('2024-01-01T12:00:00Z');
    expect(formattedDate).toBe('01/01/2024 01:00 PM');
  });
});
