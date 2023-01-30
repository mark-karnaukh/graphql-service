import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';

const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        subscribedToUserIds: { type: new GraphQLList(GraphQLString) }
    })
})

// Queries
export const userQuery = {
    type: User,
    args: { id: { type: GraphQLString } },
    async resolve(parent: any, args: any, fastify: FastifyInstance): Promise<UserEntity> {
        return await fastify.db.users.findOne({ key: 'id', equals: args.id }) as UserEntity;
    }
}

export const usersQuery = {
    type: new GraphQLList(User),
    resolve: async (_: any, args: any, fastify: FastifyInstance): Promise<UserEntity[]> => {
      return await fastify.db.users.findMany();
    }
};