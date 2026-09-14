import { createClient } from '@supabase/supabase-js';

function resolveSupabaseConfig() {
  let url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  let anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  // If URL and Key are accidentally swapped
  if (url.startsWith('eyJ') && !anonKey.startsWith('eyJ')) {
    const temp = url;
    url = anonKey;
    anonKey = temp;
  }

  // If URL is not valid HTTP/HTTPS, attempt to extract project ref from JWT
  const isValidUrl = (val: string) => {
    try {
      const parsed = new URL(val);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  if (!isValidUrl(url)) {
    // If it's a domain like xxxx.supabase.co
    if (url.includes('.supabase.co')) {
      url = `https://${url}`;
    } else {
      // Try decoding the project reference from the JWT key
      let extractedRef = '';
      const candidateKeys = [anonKey, url];
      for (const k of candidateKeys) {
        if (k && k.includes('.')) {
          try {
            const payloadBase64 = k.split('.')[1];
            // Base64 decode supporting URL-safe base64
            const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const parsed = JSON.parse(jsonPayload);
            if (parsed && typeof parsed.ref === 'string') {
              extractedRef = parsed.ref;
              break;
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      if (extractedRef) {
        url = `https://${extractedRef}.supabase.co`;
      } else {
        url = 'https://jchhgdisnegzquisajpn.supabase.co'; // Fallback to verified project ref
      }
    }
  }

  if (!anonKey) {
    anonKey = 'placeholder-key';
  }

  return { url, anonKey };
}

const { url: supabaseUrl, anonKey: supabaseAnonKey } = resolveSupabaseConfig();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

