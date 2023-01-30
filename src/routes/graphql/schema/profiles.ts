import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { FastifyInstance } from 'fastify';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';

export const Profile = new GraphQLObjectType({
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

// Mutations
export const ProfileInput = new GraphQLInputObjectType({
    name: 'ProfileInput',
    fields: {
      userId: { type: new GraphQLNonNull(GraphQLString) },
      avatar: { type: new GraphQLNonNull(GraphQLString) },
      sex: { type: new GraphQLNonNull(GraphQLString) },
      birthday: { type: new GraphQLNonNull(GraphQLInt) },
      country: { type: new GraphQLNonNull(GraphQLString) },
      street: { type: new GraphQLNonNull(GraphQLString) },
      city: { type: new GraphQLNonNull(GraphQLString) },
      memberTypeId: { type: new GraphQLNonNull(GraphQLString) }
    },
});

export const createProfileMutation = {
    type: Profile,
    args: { data: { type: ProfileInput } },
    async resolve(_: any, { data }: Record<'data', Omit<ProfileEntity, 'id'>>, fastify: FastifyInstance) {
        const user = await fastify.db.users.findOne({key: 'id', equals: data.userId });
        const memberType = await fastify.db.memberTypes.findOne({key: 'id', equals: data.memberTypeId });
        const userProfile = await fastify.db.profiles.findOne({ key: "userId", equals: data.userId });

        if (!user) {
            return fastify.httpErrors.badRequest(`User ${data.userId} doesn't exist!`);
        }

        if (!memberType) {
            return fastify.httpErrors.badRequest(`Member Type ${data.memberTypeId} doesn't exist!`);
        }
  
        if (userProfile) {
            return fastify.httpErrors.badRequest(`Profile for the user ${data.userId} already exist!`);
        }
  
        return await fastify.db.profiles.create(data);
    }
};