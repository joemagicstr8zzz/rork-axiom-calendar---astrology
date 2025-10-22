import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

export interface LicenseState {
  licensed: boolean;
  email: string | null;
  code: string | null;
  isAdmin: boolean;
}

interface LicenseAPI extends LicenseState {
  submitLicense: (email: string, code: string) => Promise<{ ok: boolean; message?: string }>;
  clearLicense: () => Promise<void>;
}

const STORAGE_KEY = 'axiom_license_v1';
const ADMIN_CODE = 'AXIOM-ADMIN-2025';

function isPlausibleCode(code: string): boolean {
  return /^AXIOM-[A-Z0-9]{6}-[A-Z0-9]{6}$/.test(code.trim());
}

export const [LicenseProvider, useLicense] = createContextHook<LicenseAPI>(() => {
  const [licensed, setLicensed] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<LicenseState>;
          setLicensed(!!parsed.licensed);
          setEmail(parsed.email ?? null);
          setCode(parsed.code ?? null);
          setIsAdmin(!!parsed.isAdmin);
        }
      } catch (e) {
        console.log('[License] load failed', e);
      }
    })();
  }, []);

  const persist = useCallback(async (next: LicenseState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.log('[License] save failed', e);
    }
  }, []);

  const submitLicense = useCallback(async (inputEmail: string, inputCode: string) => {
    const trimmedEmail = (inputEmail ?? '').trim();
    const trimmedCode = (inputCode ?? '').trim().toUpperCase();

    if (!trimmedEmail || !trimmedCode) {
      return { ok: false, message: 'Email and code required' };
    }

    let next: LicenseState;

    if (trimmedCode === ADMIN_CODE) {
      next = { licensed: true, email: trimmedEmail, code: trimmedCode, isAdmin: true };
      setLicensed(true); setEmail(trimmedEmail); setCode(trimmedCode); setIsAdmin(true);
      await persist(next);
      return { ok: true };
    }

    if (!isPlausibleCode(trimmedCode)) {
      return { ok: false, message: 'Invalid code format' };
    }

    next = { licensed: true, email: trimmedEmail, code: trimmedCode, isAdmin: false };
    setLicensed(true); setEmail(trimmedEmail); setCode(trimmedCode); setIsAdmin(false);
    await persist(next);
    return { ok: true };
  }, [persist]);

  const clearLicense = useCallback(async () => {
    setLicensed(false); setEmail(null); setCode(null); setIsAdmin(false);
    await persist({ licensed: false, email: null, code: null, isAdmin: false });
  }, [persist]);

  return useMemo(() => ({ licensed, email, code, isAdmin, submitLicense, clearLicense }), [licensed, email, code, isAdmin, submitLicense, clearLicense]);
});