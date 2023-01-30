import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema } from 'graphql';
import { graphqlBodySchema } from './schema';
import { Query } from './schema/member-types'


export const rootSchema = new GraphQLSchema({
  query: Query
});

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { query, variables } = request.body;

      return graphql({
        schema: rootSchema,
        source: query!,
        variableValues: variables,
        contextValue: fastify,
      });
    }
  );
};

export default plugin;
