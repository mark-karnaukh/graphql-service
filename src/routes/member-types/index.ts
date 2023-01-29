import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return reply.send(await fastify.db.memberTypes.findMany());
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberTypeId = request.params.id;

      const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: memberTypeId });

      if(!memberType) {
        return reply.notFound(`Member Type ${memberTypeId} - Not Found`) as any
      }

      return reply.send(memberType);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      try {
        const updatedMemberType = await fastify.db.memberTypes.change(request.params.id, request.body);

        return reply.send(updatedMemberType);
      } catch (error) {
        return reply.badRequest(`Bad request: ${(error as Error).message}`) as any;
      }
    }
  );
};

export default plugin;
