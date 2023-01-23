import { log } from '../utils';
import { buildCache } from './cache';
import { execute } from './execute';

const getRemoteVersion = async (packageName: string): Promise<string> => {
  try {
    const version = await execute(`npm view ${packageName} version`);
    log(`remote '${packageName}' version ${version}`);
    return version;
  } catch (error) {
    log(`Failed to get remote version of '${packageName}'\n${JSON.stringify(error)}`);
    return '?';
  }
};

export const remoteVersions = buildCache(getRemoteVersion);
