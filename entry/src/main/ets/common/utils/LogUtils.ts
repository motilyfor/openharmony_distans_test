import BaseModel from './BaseModel';

const TAG = "HYC:"
/**
 * Log level
 */
let LogLevel = {
  /**
     * debug
     */
  DEBUG: 3,

  /**
     * info
     */
  INFO: 4,

  /**
     * warn
     */
  WARN: 5,

  /**
     * error
     */
  ERROR: 6,

  /**
     * fatal
     */
  FATAL: 7,
};

const LOG_LEVEL = LogLevel.INFO

/**
 *  log package tool class
 */
export class LogUtil extends BaseModel {
  debug(msg): void {
    if (LogLevel.DEBUG >= LOG_LEVEL) {
      console.info(TAG+msg);
    }
  }

  log(msg): void {
    if (LogLevel.INFO >= LOG_LEVEL) {
      console.log(TAG+msg);
    }
  }

  info(msg): void {
    if (LogLevel.INFO >= LOG_LEVEL) {
      console.info(TAG+msg);
    }
  }

  warn(msg): void {
    if (LogLevel.WARN >= LOG_LEVEL) {
      console.warn(TAG+msg);
    }
  }

  error(msg): void {
    if (LogLevel.ERROR >= LOG_LEVEL) {
      console.error(TAG+msg);
    }
  }
}

let mLogUtil = new LogUtil();
export default mLogUtil as LogUtil
;
