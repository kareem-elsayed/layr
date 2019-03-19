export function getFromOneOrMany(value, index) {
  if (value === undefined) {
    return undefined;
  }
  if (index !== undefined) {
    const values = value;
    if (!Array.isArray(value)) {
      throw new Error('Expected an array');
    }
    return values[index];
  }
  return value;
}

export function callWithOneOrMany(value, func) {
  if (Array.isArray(value)) {
    const values = value;
    for (let index = 0; index < values.length; index++) {
      const value = values[index];
      func(value, index);
    }
    return;
  }
  func(value);
}

export function mapFromOneOrMany(value, func) {
  if (Array.isArray(value)) {
    const values = value;
    return values.map((value, index) => func(value, index));
  }
  return func(value);
}

export function findFromOneOrMany(value, func) {
  if (Array.isArray(value)) {
    const values = value;
    for (let index = 0; index < values.length; index++) {
      const value = values[index];
      if (func(value, index)) {
        return value;
      }
    }
    return undefined;
  }
  return func(value) ? value : undefined;
}