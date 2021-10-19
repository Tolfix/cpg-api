import { IConfigs } from "../Interfaces/Admin/Configs";

export type CacheCN = keyof IConfigs;
export const CacheConfig = new Map<CacheCN, IConfigs[CacheCN]>();