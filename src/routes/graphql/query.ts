import { GraphQLObjectType } from 'graphql';

// Member types
import { memberTypeQuery, memberTypesQuery } from './schema/member-types';

// Posts
import { postQuery, postsQuery } from './schema/posts';

// Profiles
import { profileQuery, profilesQuery } from './schema/profiles';

// Users 
import { userQuery, usersQuery } from './schema/users';

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        memberType: memberTypeQuery,
        memberTypes: memberTypesQuery,
        post: postQuery,
        posts: postsQuery,
        profile: profileQuery,
        profiles: profilesQuery,
        user: userQuery,
        users: usersQuery,
    }
})