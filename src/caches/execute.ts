import { exec } from 'child_process';

export const execute = async (command: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr.trim());
      }
      resolve(stdout.trim());
    });
  });
