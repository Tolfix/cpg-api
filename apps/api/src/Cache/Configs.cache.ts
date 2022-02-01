import { IConfigs } from "@ts/interfaces";

export type CacheCN = keyof IConfigs;
/**
 * @deprecated
 */
export const CacheConfig = new Map<CacheCN, IConfigs[CacheCN]>();