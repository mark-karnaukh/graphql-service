import { GraphQLObjectType } from 'graphql';

// Member types
// import { memberTypeQuery, memberTypesQuery } from './schema/member-types';

// Posts
import { createPostMutation } from './schema/posts';

// Profiles
// import { profileQuery, profilesQuery } from './schema/profiles';

// Users 
import { createUserMutation } from './schema/users';

export const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: createUserMutation,
        createPost: createPostMutation,
    }
})