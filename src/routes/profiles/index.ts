import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return reply.send(await fastify.db.profiles.findMany());
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileId = request.params.id;

      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: profileId });

      if(!profile) {
        return reply.notFound(`Member Type ${profileId} - Not Found`) as any
      }

      return reply.send(profile);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { memberTypeId, userId } = request.body;

      if (!await fastify.db.memberTypes.findOne({ key: 'id', equals: memberTypeId })) {
        return reply.badRequest(`Bad request: incorrect 'memberTypeId' ${memberTypeId}`) as any;
      }

      if (await fastify.db.profiles.findOne({key: 'userId', equals: userId })) {
        return reply.badRequest(`Bad request: user ${userId} already has a profile`) as any;
      }

      try {
        const createdProfile = await fastify.db.profiles.create(request.body);
      
        return reply.send(createdProfile);
      } catch(error) {
        return reply.badRequest(`Bad request: ${(error as Error).message}`) as any;
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const deletedProfile = await fastify.db.profiles.delete(request.params.id);

        return reply.send(deletedProfile);
      } catch(error) {
        return reply.badRequest(`Bad request: ${(error as Error).message}`) as any;
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const updatedProfile = await fastify.db.profiles.change(request.params.id, request.body);

        return reply.send(updatedProfile);
      } catch(error) {
        return reply.badRequest(`Bad request: ${(error as Error).message}`) as any;
      } 
    }
  );
};

export default plugin;
