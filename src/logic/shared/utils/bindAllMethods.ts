export const bindAll = <T extends object>(instance: T): T => {
  const proto = Object.getPrototypeOf(instance);
  const methodNames = Object.getOwnPropertyNames(proto).filter(
    (name) =>
      typeof (instance as any)[name] === 'function' && name !== 'constructor',
  );

  for (const name of methodNames) {
    (instance as any)[name] = (instance as any)[name].bind(instance);
  }

  return instance;
};
