import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { FastifyInstance } from 'fastify';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';

const Post = new GraphQLObjectType({
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