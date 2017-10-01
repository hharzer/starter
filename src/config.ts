import '@travetto/auth/opt/model';
import { Config } from '@travetto/config';

@Config('app')
export class AppConfig {
  baseUrl = 'http://localhost/rest'
}