import { Config } from '@encore2/config';

@Config('app')
export class AppConfig {
  baseUrl = 'http://localhost/rest'
}