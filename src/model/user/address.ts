import { Schema, SchemaBound } from '@travetto/schema';

@Schema()
export class Address extends SchemaBound {
  street1: string;
  street2?: string;
  city: string;
  stateOrProvince: string;
  zip: string;
  country: string;
}