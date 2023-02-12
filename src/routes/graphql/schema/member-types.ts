import { GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import { FastifyInstance } from 'fastify';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';

export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: {type: GraphQLString },
        discount: {type: GraphQLInt},
        monthPostsLimit: { type: GraphQLInt }
    })
})

// Queries
export const memberTypeQuery = {
    type: MemberType,
    args: { id: { type: GraphQLString } },
    async resolve(parent: any, args: any, fastify: FastifyInstance): Promise<MemberTypeEntity> {
        return await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id }) as MemberTypeEntity;
    }
}

export const memberTypesQuery = {
    type: new GraphQLList(MemberType),
    resolve: async (_: any, args: any, fastify: FastifyInstance): Promise<MemberTypeEntity[]> => {
      return await fastify.db.memberTypes.findMany();
    }
};