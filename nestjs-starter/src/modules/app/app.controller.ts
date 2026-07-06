import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { ENV_CONFIG } from '@/config/features.config';
import { EnvConfig, getFeatureFlags } from '@/config/env.schema';
import { AppInfoDto } from './dto/app-info.dto';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(@Inject(ENV_CONFIG) private readonly env: EnvConfig) {}

  @Public()
  @Get()
  @ApiOkResponse({ type: AppInfoDto })
  getRoot(): AppInfoDto {
    return {
      name: this.env.APP_NAME,
      version: this.env.APP_VERSION,
      features: getFeatureFlags(this.env),
      docs: this.env.SWAGGER_ENABLED ? '/docs' : null,
    };
  }
}
