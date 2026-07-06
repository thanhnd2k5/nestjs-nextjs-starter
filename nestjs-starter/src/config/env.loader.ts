import { EnvConfig, validateEnv } from './env.schema';

let cachedEnv: EnvConfig | undefined;

/** Validated env singleton — called once per process. */
export function getEnvConfig(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = validateEnv(process.env as Record<string, unknown>);
  }
  return cachedEnv;
}
