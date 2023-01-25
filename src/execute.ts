import { exec } from 'child_process';
import { getConfig } from './config';
import * as pLimit from 'p-limit';

const run = async (command: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(command, { shell: getConfig().shell }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr.trim());
      }
      resolve(stdout.trim());
    });
  });

let limit: pLimit.Limit;

export const execute = async (command: string): Promise<string> => {
  const instances = getConfig().shellInstances;
  if (instances != null && instances > 0) {
    if (limit == null || limit.length != instances) {
      limit = pLimit(instances);
    }
    return limit(() => run(command));
  }
  return run(command);
}
