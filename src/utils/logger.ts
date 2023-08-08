import { writeFile } from 'node:fs/promises';

interface LogType {
    type?: 0 | 1 | 2 | 3 | 'info' | 'success' | 'warning' | 'error',
    message?: string,
    noLogFile?: boolean
}


export default async function log({ type, message, noLogFile }: LogType) {
    const logLevel =
        type === 0 || type === 'info' ? "INFO"
            : type === 1 || type === 'success' ? "SUCCESS"
                : type === 2 || type === 'warning' ? "WARNING"
                    : type === 3 || type === 'error' ? "ERROR"
                        : 'UNKNOWN';

    const finalLog = `[${(new Date().toLocaleString())}][${logLevel}] ${message ?? "Unknown!"}`;

    console.log(finalLog);

    if (!noLogFile) {
        try {
            await writeFile('./log.txt', finalLog + "\n", { flag: 'a+' });
        } catch (e) {
            log({
                type: 3,
                message: "Cannot write log to file!",
                noLogFile: true
            });
        }
    }
}