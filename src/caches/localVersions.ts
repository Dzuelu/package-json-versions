import { buildCache } from './cache';
import { execute } from './execute';

const getLocalVersion = async ({
  packageName,
  filePath
}: {
  filePath: string; // ex: /Users/some_user/git/eslint-config/package.json
  packageName: string; // ex: jest
}): Promise<string> => {
  try {
    const separator = filePath.includes('\\') ? '\\' : '/';
    const packageJsonDir = filePath.substring(0, filePath.lastIndexOf(separator));

    // example command output:
    // your-project@0.0.1 /Users/git/your-project
    // └── <package>@2.2.2
    // We have to 'cd' to package.json directory to get the correct output too
    const version = await execute(`(cd ${packageJsonDir} && npm list ${packageName} --depth=0)`);
    console.log(`local ${packageName} version output ${version}`);
    return version.trim().split('@').slice(-1)[0];
  } catch (error) {
    console.error(`Failed to get local version of ${packageName}`, JSON.stringify(error));
    return '?';
  }
};

export const localVersions = buildCache(getLocalVersion);
