import { exec } from 'child_process';
import { getConfig } from '../utils';

export const execute = async (command: string): Promise<string> =>
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
