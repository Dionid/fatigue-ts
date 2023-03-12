import { pino } from "pino";

export const Logger = {
  init: (mixin: () => Record<string, unknown>): pino.Logger => {
    const pinoLogger = pino({
      mixin,
      level: process.env.LOG_LEVEL ?? "info",
    });
    pinoLogger.info = pinoLogger.info.bind(pinoLogger);
    pinoLogger.debug = pinoLogger.debug.bind(pinoLogger);
    pinoLogger.warn = pinoLogger.warn.bind(pinoLogger);
    pinoLogger.error = pinoLogger.error.bind(pinoLogger);

    return pinoLogger;
  },
  addFnStack: (logger: pino.Logger, fnName: string): pino.Logger => {
    const fnStack: string[] | undefined = logger.bindings().fnStack as
      | string[]
      | undefined;

    return logger.child({
      fnStack: fnStack ? [...fnStack, fnName] : [fnName],
    });
  },
  logRethrow: async <R>(
    logger: pino.Logger,
    fn: () => Promise<R>
  ): Promise<R> => {
    try {
      return await fn();
    } catch (e) {
      logger.error(e);
      throw e;
    }
  },
};
