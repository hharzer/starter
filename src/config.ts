import '@encore2/auth/opt/model';
import { Config } from '@encore2/config';

@Config('app')
export class AppConfig {
  baseUrl = 'http://localhost/rest'
}