import gql from 'graphql-tag';
import * as ReactApollo from 'react-apollo';
import * as ReactApolloHooks from 'react-apollo-hooks';
export type Maybe<T> = T | null;
export type MaybePromise<T> = Promise<T> | T;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Author = {
  __typename?: 'Author';
  id: Scalars['ID'];
  name: Scalars['String'];
  books: Array<Book>;
};

export type Book = {
  __typename?: 'Book';
  id: Scalars['ID'];
  gbId: Scalars['Int'];
  title: Scalars['String'];
  language: Scalars['String'];
  author: Author;
  fragments: Array<Fragment>;
};

export type BookFragmentOptions = {
  __typename?: 'BookFragmentOptions';
  book: Book;
  fragmentOptions: Array<FragmentOption>;
};

export type ChangePasswordInput = {
  password: Scalars['String'];
  token: Scalars['String'];
};

export type FragInput = {
  fragmentId: Scalars['Int'];
  order: Scalars['Int'];
};

export type Fragment = {
  __typename?: 'Fragment';
  id: Scalars['ID'];
  fragmentText: Scalars['String'];
  context: Scalars['String'];
  postsWhichUse?: Maybe<Array<PostFragment>>;
  book: Book;
};

export type FragmentOption = {
  __typename?: 'FragmentOption';
  order: Scalars['Int'];
  fragment: Fragment;
};

export type FragmentOptionAnon = {
  __typename?: 'FragmentOptionAnon';
  order: Scalars['Int'];
  fragment: Fragment;
};

export type FragmentOptionUser = {
  __typename?: 'FragmentOptionUser';
  order: Scalars['Int'];
  fragment: Fragment;
};

export type Mutation = {
  __typename?: 'Mutation';
  likePost: Scalars['Boolean'];
  deletePost: Scalars['Boolean'];
  makePost?: Maybe<Scalars['Int']>;
  getOptions: PostOptions;
  reorderOptions: Scalars['Boolean'];
  getNewPostOptions: PostOptionsWithTime;
  getPostOptions: PostOptionsWithTime;
  register: Scalars['Boolean'];
  resendConfirmationEmail: Scalars['Boolean'];
  confirmUser: Scalars['Boolean'];
  login?: Maybe<User>;
  changePassword: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
};

export type MutationLikePostArgs = {
  data: UserPostLikeInput;
};

export type MutationDeletePostArgs = {
  postId: Scalars['Int'];
};

export type MutationMakePostArgs = {
  data: PostInput;
};

export type MutationReorderOptionsArgs = {
  data: ReorderOptionsInput;
};

export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type MutationResendConfirmationEmailArgs = {
  email: Scalars['String'];
};

export type MutationConfirmUserArgs = {
  token: Scalars['String'];
};

export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};

export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};

export type PasswordInput = {
  password: Scalars['String'];
};

export type Portman = {
  __typename?: 'Portman';
  id: Scalars['ID'];
  name: Scalars['String'];
  posts: Array<Post>;
  author1: Author;
  author2: Author;
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  created: Scalars['DateTime'];
  creator?: Maybe<User>;
  portman: Portman;
  book1: Book;
  book2: Book;
  currentUserLiked: Scalars['Boolean'];
  currentUserOwns: Scalars['Boolean'];
  likeCount: Scalars['Int'];
  usedFragments: Array<PostFragment>;
};

export type PostFragment = {
  __typename?: 'PostFragment';
  order: Scalars['Int'];
  fragment: Fragment;
  post: Post;
};

export type PostInput = {
  fragments: Array<FragInput>;
};

export type PostOptions = {
  __typename?: 'PostOptions';
  book1Options: BookFragmentOptions;
  book2Options: BookFragmentOptions;
  portman: Portman;
};

export type PostOptionsWithTime = {
  __typename?: 'PostOptionsWithTime';
  postOptions?: Maybe<PostOptions>;
  remaining?: Maybe<RemainingLimit>;
};

export type PostsWithCursor = {
  __typename?: 'PostsWithCursor';
  cursor?: Maybe<Scalars['String']>;
  posts: Array<Post>;
};

export type Query = {
  __typename?: 'Query';
  getPostsWithCursor: PostsWithCursor;
  me?: Maybe<User>;
};

export type QueryGetPostsWithCursorArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};

export type RegisterInput = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type RemainingLimit = {
  __typename?: 'RemainingLimit';
  remainingRefreshes: Scalars['Int'];
  remainingSeconds: Scalars['Int'];
};

export type ReorderOptionsInput = {
  fragments: Array<FragInput>;
};

export type Subscription = {
  __typename?: 'Subscription';
  newPost: Post;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  created: Scalars['DateTime'];
  posts?: Maybe<Array<Post>>;
  postLikes: Array<UserPostLike>;
  fragmentOptions: Array<FragmentOptionUser>;
};

export type UserPostLike = {
  __typename?: 'UserPostLike';
  user: User;
  post: Post;
};

export type UserPostLikeInput = {
  postId: Scalars['Int'];
  like: Scalars['Boolean'];
};
export type LoginUserMutationVariables = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginUserMutation = { __typename?: 'Mutation' } & {
  login: Maybe<{ __typename?: 'User' } & Pick<User, 'id' | 'email'>>;
};

export type LogoutMutationVariables = {};

export type LogoutMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'logout'
>;

export type BookOptionsFragment = { __typename?: 'BookFragmentOptions' } & {
  book: { __typename?: 'Book' } & Pick<Book, 'id' | 'title'> & {
      author: { __typename?: 'Author' } & Pick<Author, 'name'>;
    };
  fragmentOptions: Array<
    { __typename?: 'FragmentOption' } & Pick<FragmentOption, 'order'> & {
        fragment: { __typename?: 'Fragment' } & Pick<
          Fragment,
          'id' | 'fragmentText'
        >;
      }
  >;
};

export type GetPostOptionsMutationVariables = {};

export type GetPostOptionsMutation = { __typename?: 'Mutation' } & {
  getPostOptions: { __typename?: 'PostOptionsWithTime' } & {
    remaining: Maybe<
      { __typename?: 'RemainingLimit' } & Pick<
        RemainingLimit,
        'remainingRefreshes' | 'remainingSeconds'
      >
    >;
    postOptions: Maybe<
      { __typename?: 'PostOptions' } & {
        book1Options: {
          __typename?: 'BookFragmentOptions';
        } & BookOptionsFragment;
        book2Options: {
          __typename?: 'BookFragmentOptions';
        } & BookOptionsFragment;
      }
    >;
  };
};

export type PostFragmentFragment = { __typename?: 'Post' } & Pick<
  Post,
  'id' | 'created' | 'likeCount' | 'currentUserLiked' | 'currentUserOwns'
> & {
    creator: Maybe<{ __typename?: 'User' } & Pick<User, 'id'>>;
    portman: { __typename?: 'Portman' } & Pick<Portman, 'id' | 'name'>;
    book1: { __typename?: 'Book' } & Pick<Book, 'id' | 'title'> & {
        author: { __typename?: 'Author' } & Pick<Author, 'name'>;
      };
    book2: { __typename?: 'Book' } & Pick<Book, 'id' | 'title'> & {
        author: { __typename?: 'Author' } & Pick<Author, 'name'>;
      };
    usedFragments: Array<
      { __typename?: 'PostFragment' } & Pick<PostFragment, 'order'> & {
          fragment: { __typename?: 'Fragment' } & Pick<
            Fragment,
            'id' | 'context' | 'fragmentText'
          > & { book: { __typename?: 'Book' } & Pick<Book, 'id'> };
        }
    >;
  };

export type NewPostSubscriptionVariables = {};

export type NewPostSubscription = { __typename?: 'Subscription' } & {
  newPost: { __typename?: 'Post' } & PostFragmentFragment;
};

export type GetPostsWithCursorQueryVariables = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};

export type GetPostsWithCursorQuery = { __typename?: 'Query' } & {
  getPostsWithCursor: { __typename?: 'PostsWithCursor' } & Pick<
    PostsWithCursor,
    'cursor'
  > & { posts: Array<{ __typename?: 'Post' } & PostFragmentFragment> };
};

export type MeQueryVariables = {};

export type MeQuery = { __typename?: 'Query' } & {
  me: Maybe<{ __typename?: 'User' } & Pick<User, 'id' | 'email'>>;
};

export type RegisterMutationVariables = {
  data: RegisterInput;
};

export type RegisterMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'register'
>;

export type ForgotPasswordMutationVariables = {
  email: Scalars['String'];
};

export type ForgotPasswordMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'forgotPassword'
>;

export type ResendConfirmationMutationVariables = {
  email: Scalars['String'];
};

export type ResendConfirmationMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'resendConfirmationEmail'
>;

export type ChangePasswordMutationVariables = {
  data: ChangePasswordInput;
};

export type ChangePasswordMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'changePassword'
>;

export type LikePostMutationVariables = {
  data: UserPostLikeInput;
};

export type LikePostMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'likePost'
>;

export type DeletePostMutationVariables = {
  postId: Scalars['Int'];
};

export type DeletePostMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deletePost'
>;

export type GetNewPostOptionsMutationVariables = {};

export type GetNewPostOptionsMutation = { __typename?: 'Mutation' } & {
  getNewPostOptions: { __typename?: 'PostOptionsWithTime' } & {
    remaining: Maybe<
      { __typename?: 'RemainingLimit' } & Pick<
        RemainingLimit,
        'remainingRefreshes' | 'remainingSeconds'
      >
    >;
    postOptions: Maybe<
      { __typename?: 'PostOptions' } & {
        book1Options: {
          __typename?: 'BookFragmentOptions';
        } & BookOptionsFragment;
        book2Options: {
          __typename?: 'BookFragmentOptions';
        } & BookOptionsFragment;
      }
    >;
  };
};

export type MakePostMutationVariables = {
  data: PostInput;
};

export type MakePostMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'makePost'
>;

export type ConfirmUserMutationVariables = {
  token: Scalars['String'];
};

export type ConfirmUserMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'confirmUser'
>;
export const BookOptionsFragmentDoc = gql`
  fragment BookOptions on BookFragmentOptions {
    book {
      id
      title
      author {
        name
      }
    }
    fragmentOptions {
      order
      fragment {
        id
        fragmentText
      }
    }
  }
`;
export const PostFragmentFragmentDoc = gql`
  fragment PostFragment on Post {
    id
    created
    creator {
      id
    }
    portman {
      id
      name
    }
    book1 {
      id
      title
      author {
        name
      }
    }
    book2 {
      id
      title
      author {
        name
      }
    }
    usedFragments {
      order
      fragment {
        id
        context
        fragmentText
        book {
          id
        }
      }
    }
    likeCount
    currentUserLiked
    currentUserOwns
  }
`;
export const LoginUserDocument = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`;
export type LoginUserMutationFn = ReactApollo.MutationFn<
  LoginUserMutation,
  LoginUserMutationVariables
>;

export function useLoginUserMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    LoginUserMutation,
    LoginUserMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    LoginUserMutation,
    LoginUserMutationVariables
  >(LoginUserDocument, baseOptions);
}
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = ReactApollo.MutationFn<
  LogoutMutation,
  LogoutMutationVariables
>;

export function useLogoutMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    baseOptions
  );
}
export const GetPostOptionsDocument = gql`
  mutation GetPostOptions {
    getPostOptions {
      remaining {
        remainingRefreshes
        remainingSeconds
      }
      postOptions {
        book1Options {
          ...BookOptions
        }
        book2Options {
          ...BookOptions
        }
      }
    }
  }
  ${BookOptionsFragmentDoc}
`;
export type GetPostOptionsMutationFn = ReactApollo.MutationFn<
  GetPostOptionsMutation,
  GetPostOptionsMutationVariables
>;

export function useGetPostOptionsMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    GetPostOptionsMutation,
    GetPostOptionsMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    GetPostOptionsMutation,
    GetPostOptionsMutationVariables
  >(GetPostOptionsDocument, baseOptions);
}
export const NewPostDocument = gql`
  subscription NewPost {
    newPost {
      ...PostFragment
    }
  }
  ${PostFragmentFragmentDoc}
`;

export function useNewPostSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    NewPostSubscription,
    NewPostSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    NewPostSubscription,
    NewPostSubscriptionVariables
  >(NewPostDocument, baseOptions);
}
export const GetPostsWithCursorDocument = gql`
  query GetPostsWithCursor($cursor: String, $limit: Int!) {
    getPostsWithCursor(cursor: $cursor, limit: $limit) {
      cursor
      posts {
        ...PostFragment
      }
    }
  }
  ${PostFragmentFragmentDoc}
`;

export function useGetPostsWithCursorQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    GetPostsWithCursorQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    GetPostsWithCursorQuery,
    GetPostsWithCursorQueryVariables
  >(GetPostsWithCursorDocument, baseOptions);
}
export const MeDocument = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

export function useMeQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<MeQueryVariables>
) {
  return ReactApolloHooks.useQuery<MeQuery, MeQueryVariables>(
    MeDocument,
    baseOptions
  );
}
export const RegisterDocument = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data)
  }
`;
export type RegisterMutationFn = ReactApollo.MutationFn<
  RegisterMutation,
  RegisterMutationVariables
>;

export function useRegisterMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    RegisterMutation,
    RegisterMutationVariables
  >(RegisterDocument, baseOptions);
}
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;
export type ForgotPasswordMutationFn = ReactApollo.MutationFn<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>;

export function useForgotPasswordMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(ForgotPasswordDocument, baseOptions);
}
export const ResendConfirmationDocument = gql`
  mutation ResendConfirmation($email: String!) {
    resendConfirmationEmail(email: $email)
  }
`;
export type ResendConfirmationMutationFn = ReactApollo.MutationFn<
  ResendConfirmationMutation,
  ResendConfirmationMutationVariables
>;

export function useResendConfirmationMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    ResendConfirmationMutation,
    ResendConfirmationMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    ResendConfirmationMutation,
    ResendConfirmationMutationVariables
  >(ResendConfirmationDocument, baseOptions);
}
export const ChangePasswordDocument = gql`
  mutation ChangePassword($data: ChangePasswordInput!) {
    changePassword(data: $data)
  }
`;
export type ChangePasswordMutationFn = ReactApollo.MutationFn<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;

export function useChangePasswordMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument, baseOptions);
}
export const LikePostDocument = gql`
  mutation LikePost($data: UserPostLikeInput!) {
    likePost(data: $data)
  }
`;
export type LikePostMutationFn = ReactApollo.MutationFn<
  LikePostMutation,
  LikePostMutationVariables
>;

export function useLikePostMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    LikePostMutation,
    LikePostMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    LikePostMutation,
    LikePostMutationVariables
  >(LikePostDocument, baseOptions);
}
export const DeletePostDocument = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId)
  }
`;
export type DeletePostMutationFn = ReactApollo.MutationFn<
  DeletePostMutation,
  DeletePostMutationVariables
>;

export function useDeletePostMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DeletePostMutation,
    DeletePostMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    DeletePostMutation,
    DeletePostMutationVariables
  >(DeletePostDocument, baseOptions);
}
export const GetNewPostOptionsDocument = gql`
  mutation GetNewPostOptions {
    getNewPostOptions {
      remaining {
        remainingRefreshes
        remainingSeconds
      }
      postOptions {
        book1Options {
          ...BookOptions
        }
        book2Options {
          ...BookOptions
        }
      }
    }
  }
  ${BookOptionsFragmentDoc}
`;
export type GetNewPostOptionsMutationFn = ReactApollo.MutationFn<
  GetNewPostOptionsMutation,
  GetNewPostOptionsMutationVariables
>;

export function useGetNewPostOptionsMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    GetNewPostOptionsMutation,
    GetNewPostOptionsMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    GetNewPostOptionsMutation,
    GetNewPostOptionsMutationVariables
  >(GetNewPostOptionsDocument, baseOptions);
}
export const MakePostDocument = gql`
  mutation MakePost($data: PostInput!) {
    makePost(data: $data)
  }
`;
export type MakePostMutationFn = ReactApollo.MutationFn<
  MakePostMutation,
  MakePostMutationVariables
>;

export function useMakePostMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    MakePostMutation,
    MakePostMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    MakePostMutation,
    MakePostMutationVariables
  >(MakePostDocument, baseOptions);
}
export const ConfirmUserDocument = gql`
  mutation ConfirmUser($token: String!) {
    confirmUser(token: $token)
  }
`;
export type ConfirmUserMutationFn = ReactApollo.MutationFn<
  ConfirmUserMutation,
  ConfirmUserMutationVariables
>;

export function useConfirmUserMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    ConfirmUserMutation,
    ConfirmUserMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    ConfirmUserMutation,
    ConfirmUserMutationVariables
  >(ConfirmUserDocument, baseOptions);
}
