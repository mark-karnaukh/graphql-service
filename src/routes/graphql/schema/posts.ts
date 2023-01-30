import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';

export const Post = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        userId: { type: GraphQLString }
    })
})

// Queries
export const postQuery = {
    type: Post,
    args: { id: { type: GraphQLString } },
    async resolve(parent: any, args: any, fastify: FastifyInstance): Promise<PostEntity> {
        return await fastify.db.posts.findOne({ key: 'id', equals: args.id }) as PostEntity;
    }
}

export const postsQuery = {
    type: new GraphQLList(Post),
    resolve: async (_: any, args: any, fastify: FastifyInstance): Promise<PostEntity[]> => {
      return await fastify.db.posts.findMany();
    }
};

// Mutations
export const PostInput = new GraphQLInputObjectType({
    name: 'PostInput',
    fields: {
      userId: { type: new GraphQLNonNull(GraphQLString) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
    },
  });

export const createPostMutation = {
    type: Post,
    args: { data: { type: PostInput } },
    async resolve(_: any, { data }: Record<'data', Omit<PostEntity, 'id'>>, fastify: FastifyInstance) {
      const user = await fastify.db.users.findOne({key: 'id', equals: data.userId });

      if (!user) {
        throw new Error(`User ${data.userId} doesn't exist!`)
      }
  
      return await fastify.db.posts.create(data);
    }
  };