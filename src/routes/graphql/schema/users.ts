import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { Post } from './posts';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { Profile } from './profiles';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { MemberType } from './member-types';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';

const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
        posts: {
            type: new GraphQLList(Post),
            async resolve(parent: UserEntity, args: any, fastify: FastifyInstance): Promise<PostEntity[]> {
                return await fastify.db.posts.findMany({key: "userId", equals: parent.id});
            }
        },
        profile: {
            type: Profile,
            async resolve(parent: UserEntity, args: any, fastify: FastifyInstance): Promise<ProfileEntity> {
                return await fastify.db.profiles.findOne({key: "userId", equals: parent.id}) as ProfileEntity;
            }
        },
        memberType: {
            type: MemberType,
            async resolve(parent: UserEntity, args: any, fastify: FastifyInstance): Promise<MemberTypeEntity> {
                const userProfile = await fastify.db.profiles.findOne({key: "userId", equals: parent.id}) as ProfileEntity;

                return await fastify.db.memberTypes.findOne({ key: "id", equals: userProfile?.memberTypeId }) as MemberTypeEntity;
            }

        }
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