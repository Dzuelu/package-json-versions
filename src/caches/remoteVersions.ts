import { buildCache } from './cache';
import { execute } from './execute';

const getRemoteVersion = async (packageName: string): Promise<string> => {
  try {
    const version = await execute(`npm view ${packageName} version`);
    return version.trim();
  } catch (error) {
    console.error(`Failed to get remote version of ${packageName}`, error);
    return '?';
  }
};

export const remoteVersions = buildCache(getRemoteVersion);
