import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema, validate, parse, ExecutionResult } from 'graphql';
import { graphqlBodySchema } from './schema';
import { Query } from './query';
import * as depthLimit from 'graphql-depth-limit';


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

      const errors = validate(rootSchema, parse(query!), [depthLimit(6)]);

      if (errors.length > 0) {
        const result: ExecutionResult = {
          errors: errors,
          data: null,
        };

        return result;
      }

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
