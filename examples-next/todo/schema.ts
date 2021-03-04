import { createSchema, list } from '@keystone-next/keystone/schema';
import { text } from '@keystone-next/fields';

export const lists = createSchema({
  User: list({ fields: { name: text() } }),
});
