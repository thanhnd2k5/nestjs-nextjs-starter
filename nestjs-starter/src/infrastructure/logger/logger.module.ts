import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ENV_CONFIG } from '@/config/features.config';
import { EnvConfig } from '@/config/env.schema';
import { REQUEST_ID_HEADER } from '@/common/constants/http.constants';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ENV_CONFIG],
      useFactory: (env: EnvConfig) => ({
        pinoHttp: {
          level: env.NODE_ENV === 'production' ? 'info' : 'debug',
          transport:
            env.NODE_ENV !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                  },
                }
              : undefined,
          autoLogging: false,
          genReqId: (req, res) => {
            const header = req.headers[REQUEST_ID_HEADER] ?? req.headers['x-request-id'];
            const existing = Array.isArray(header) ? header[0] : header;
            const requestId = existing ?? crypto.randomUUID();
            res.setHeader(REQUEST_ID_HEADER, requestId);
            return requestId;
          },
        },
      }),
    }),
  ],
  exports: [LoggerModule],
})
export class AppLoggerModule {}
