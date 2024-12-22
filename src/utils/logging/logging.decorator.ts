import { SetMetadata } from '@nestjs/common';

export const SKIP_LOGGING = 'skipLogging';
export const SkipLogging = () => SetMetadata(SKIP_LOGGING, true);
