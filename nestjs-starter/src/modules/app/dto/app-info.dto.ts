import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FeatureFlagsDto {
  @ApiProperty()
  prisma!: boolean;

  @ApiProperty()
  redis!: boolean;

  @ApiProperty()
  bullmq!: boolean;

  @ApiProperty()
  auth!: boolean;
}

export class AppInfoDto {
  @ApiProperty({ example: 'nestjs-starter' })
  name!: string;

  @ApiProperty({ example: '1.0.0' })
  version!: string;

  @ApiProperty({ type: FeatureFlagsDto })
  features!: FeatureFlagsDto;

  @ApiPropertyOptional({ example: '/docs', nullable: true })
  docs!: string | null;
}
