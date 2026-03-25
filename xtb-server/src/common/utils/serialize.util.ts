export function serializeValue<T>(value: T): T {
  if (typeof value === 'bigint') {
    return value.toString() as T;
  }

  if (value instanceof Date) {
    return value.toISOString() as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item)) as T;
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      result[key] = serializeValue(item);
    }
    return result as T;
  }

  return value;
}

