import { IConfigs } from "@interface/Admin/Configs.interface";

export type CacheCN = keyof IConfigs;
/**
 * @deprecated
 */
export const CacheConfig = new Map<CacheCN, IConfigs[CacheCN]>();