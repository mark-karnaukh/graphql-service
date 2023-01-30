import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import { FastifyInstance } from 'fastify';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';

const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: { type: GraphQLString },
        avatar: { type: GraphQLString },
        sex: { type: GraphQLString },
        birthday: { type: GraphQLInt },
        country: { type: GraphQLString },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        memberTypeId: { type: GraphQLString },
        userId: { type: GraphQLString }
    })
})

// Queries
export const profileQuery = {
    type: Profile,
    args: { id: { type: GraphQLString } },
    async resolve(parent: any, args: any, fastify: FastifyInstance): Promise<ProfileEntity> {
        return await fastify.db.profiles.findOne({ key: 'id', equals: args.id }) as ProfileEntity;
    }
}

export const profilesQuery = {
    type: new GraphQLList(Profile),
    resolve: async (_: any, args: any, fastify: FastifyInstance): Promise<ProfileEntity[]> => {
      return await fastify.db.profiles.findMany();
    }
};