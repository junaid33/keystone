import { config, createSchema, list } from '@keystone-next/keystone/schema';
import { text } from '@keystone-next/fields';

export default config({
  db: {
    adapter: 'prisma_postgresql',
    url: 'postgres://keystone5:k3yst0n3@localhost:5432/todo-example',
  },
  lists: createSchema({
    User: list({ fields: { name: text() } }),
  }),
});
