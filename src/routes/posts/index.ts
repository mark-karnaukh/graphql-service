import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    const posts = await fastify.db.posts.findMany();

    return reply.send(posts);
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postId = request.params.id;
      const post = await fastify.db.posts.findOne({key: 'id', equals: postId});

      if (!post) {
        return reply.notFound(`Post ${postId} - Not Found`) as any;
      }

      return reply.send(post);

    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const createdPost = await fastify.db.posts.create(request.body);
      
        return reply.send(createdPost);
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
    async function (request, reply): Promise<PostEntity> {
      try {
        const deletedPost = await fastify.db.posts.delete(request.params.id);

        return reply.send(deletedPost);
      } catch(error) {
        return reply.badRequest(`Bad request: ${(error as Error).message}`) as any;
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const updatedPost = await fastify.db.posts.change(request.params.id, request.body);

        return reply.send(updatedPost);
      } catch(error) {
        return reply.badRequest(`Bad request: ${(error as Error).message}`) as any;
      } 
    }
  );
};

export default plugin;
