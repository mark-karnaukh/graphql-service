import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { FastifyInstance } from 'fastify';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';

const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: {type: GraphQLString },
        discount: {type: GraphQLInt},
        monthPostsLimit: { type: GraphQLInt }
    })
})

// Queries

// query($id: String){
//     memberType(id: $id) {
//         id
//         discount
//         monthPostsLimit
//     }
// }

const memberTypeQuery = {
    type: MemberType,
    args: { id: { type: GraphQLString } },
    async resolve(parent: any, args: any, fastify: FastifyInstance): Promise<MemberTypeEntity> {
        return await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id }) as MemberTypeEntity;
    }
}

// query {
//     memberTypes {
//         id
//         discount
//         monthPostsLimit
//     }
// }

export const memberTypesQuery = {
    type: new GraphQLList(MemberType),
    resolve: async (_: any, args: any, fastify: FastifyInstance): Promise<MemberTypeEntity[]> => {
      return await fastify.db.memberTypes.findMany();
    }
};

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        memberType: memberTypeQuery,
        memberTypes: memberTypesQuery
    }
})