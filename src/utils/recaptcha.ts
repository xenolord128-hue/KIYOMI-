// Utility to verify reCAPTCHA tokens against the secure server-side endpoint

export interface RecaptchaVerificationResult {
  success: boolean;
  error?: string;
  timestamp?: string;
  hostname?: string;
}

export const verifyRecaptchaToken = async (
  token: string
): Promise<RecaptchaVerificationResult> => {
  if (!token || !token.trim()) {
    return {
      success: false,
      error: 'Please complete the reCAPTCHA security verification.',
    };
  }

  try {
    const response = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token.trim() }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        timestamp: data.timestamp,
        hostname: data.hostname,
      };
    }

    return {
      success: false,
      error: data.error || 'Security verification failed. Please try again.',
    };
  } catch (error: any) {
    console.error('Network error during reCAPTCHA verification:', error);
    return {
      success: false,
      error: 'Unable to reach security verification service. Please try again.',
    };
  }
};
