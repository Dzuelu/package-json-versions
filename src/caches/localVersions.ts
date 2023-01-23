import { log } from '../utils';
import { buildCache } from './cache';
import { execute } from './execute';

const getLocalVersion = async ({
  packageName,
  filePath
}: {
  filePath: string; // ex: /Users/some_user/git/eslint-config/package.json
  packageName: string; // ex: @types/vscode
}): Promise<string> => {
  try {
    const separator = filePath.includes('\\') ? '\\' : '/';
    const packageJsonDir = filePath.substring(0, filePath.lastIndexOf(separator));

    // example command output:
    // your-project@0.0.1 /Users/git/your-project
    // └── <package>@2.2.2
    // We have to 'cd' to package.json directory to get the correct output too
    const versionOutput = await execute(`(cd ${packageJsonDir} && npm list ${packageName} --depth=0)`);
    const version = versionOutput.split('@').slice(-1)[0];
    log(`local '${packageName}' version ${version}`);
    return version;
  } catch (error) {
    log(`Failed to get local version of '${packageName}'\n${JSON.stringify(error)}`);
    return '?';
  }
};

export const localVersions = buildCache(getLocalVersion);
