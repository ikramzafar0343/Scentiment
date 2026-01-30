export async function fetchJsonWithTimeout<T>(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    timeoutMs?: number;
  },
): Promise<T> {
  const { timeoutMs = 8000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 2,
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < retries) {
        // Exponential backoff: wait 2^i * 100ms
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 100));
      }
    }
  }

  throw lastError || new Error('Unknown error');
}
