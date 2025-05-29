export const bindAll = <T extends object>(instance: T): T => {
  const proto = Object.getPrototypeOf(instance) as Record<string, unknown>;

  const methodNames = Object.getOwnPropertyNames(proto).filter((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(proto, name);
    return name !== 'constructor' && typeof descriptor?.value === 'function';
  });

  for (const name of methodNames) {
    const fn = proto[name];
    if (typeof fn === 'function') {
      (instance as Record<string, unknown>)[name] = fn.bind(instance);
    }
  }

  return instance;
};
