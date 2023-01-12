export type KeysMatchingType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];
