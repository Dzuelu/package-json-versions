import { buildCache } from './cache';
import { execute } from './execute';

const getLocalVersion = async (packageName: string): Promise<string> => {
  try {
    // example output:
    // your-project@0.0.1 /Users/git/your-project
    // └── <package>@2.2.2
    const version = await execute(`npm list ${packageName} --depth=0`);
    return version.trim().split('\n')[1].split('@')[1];
  } catch (error) {
    console.error(`Failed to get local version of ${packageName}`, JSON.stringify(error));
    return '?';
  }
};

export const localVersions = buildCache(getLocalVersion);
