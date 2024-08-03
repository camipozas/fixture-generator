import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // TTL de 10 minutos

export function getCachedData(key: string) {
  return cache.get(key);
}

export function setCachedData(key: string, data: any) {
  cache.set(key, data);
}
