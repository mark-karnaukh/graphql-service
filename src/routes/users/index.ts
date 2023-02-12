import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return reply.send(await fastify.db.users.findMany());
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = request.params.id;

      const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

      if(!user) {
        return reply.notFound(`Member Type ${userId} - Not Found`) as any
      }

      return reply.send(user);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const createdUser = await fastify.db.users.create(request.body);
      
        return reply.send(createdUser);
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
    async function (request, reply): Promise<UserEntity> {
      const userId = request.params.id;

      try {
        const deletedUser = await fastify.db.users.delete(userId);
        const relatedPosts = await fastify.db.posts.findMany({ key: 'userId', equals: userId });
        const relatedProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: userId });
        const subscribedUsers = await fastify.db.users.findMany({key: 'subscribedToUserIds', inArray: userId });

        relatedPosts.length && (await Promise.all(relatedPosts.map(post => fastify.db.posts.delete(post.id))));
        relatedProfile && relatedProfile.id && (await fastify.db.profiles.delete(relatedProfile.id));
        subscribedUsers.length && (await Promise.all(subscribedUsers.map(user => {
          fastify.db.users.change(user.id, {subscribedToUserIds: user.subscribedToUserIds.filter(id => id !== userId)});
        })))

        return reply.send(deletedUser);
      } catch(error) {
        return reply.badRequest(`Bad request: ${(error as Error).message}`) as any;
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const userId = request.params.id;
        const { userId: followerId } = request.body;
  
        const follower = await fastify.db.users.findOne({ key: 'id', equals: followerId });
        const updatedUser = await fastify.db.users.change(followerId, { subscribedToUserIds: follower?.subscribedToUserIds?.concat(userId)} );

        return reply.send(updatedUser);
      } catch (error) {
        return reply.badRequest(`Bad request: ${(error as Error).message}`) as any;
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const userId = request.params.id;
        const { userId: followerId } = request.body;
  
        const follower = await fastify.db.users.findOne({ key: 'id', equals: followerId });

        if (!follower?.subscribedToUserIds?.find((id) => id === userId)) {
          return reply.badRequest(`Bad request: user ${followerId} isn't subscribed to user ${userId}`) as any;
        }

        const updatedUser = await fastify.db.users.change(followerId, { subscribedToUserIds: follower?.subscribedToUserIds?.filter((id) => id !== userId)} );

        return reply.send(updatedUser);
      } catch (error) {
        return reply.badRequest(`Bad request: ${(error as Error).message}`) as any;
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const updatedUser = await fastify.db.users.change(request.params.id, request.body);
      
        return reply.send(updatedUser);
      } catch(error) {
        return reply.badRequest(`Bad request: ${(error as Error).message}`) as any;
      }
    }
  );
};

export default plugin;
