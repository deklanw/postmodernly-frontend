import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

const BOOK_OPTIONS = gql`
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

export const GET_POST_OPTIONS = gql`
  mutation GetPostOptions {
    getPostOptions {
      remainingTime
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
  ${BOOK_OPTIONS}
`;

const POST_FRAGMENT = gql`
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

export const NEW_POST_SUB = gql`
  subscription NewPost {
    newPost {
      ...PostFragment
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_POSTS_WITH_CURSOR = gql`
  query GetPostsWithCursor($cursor: String, $limit: Int!) {
    getPostsWithCursor(cursor: $cursor, limit: $limit) {
      cursor
      posts {
        ...PostFragment
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      id
      email
      created
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($data: UserPostLikeInput!) {
    likePost(data: $data)
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId)
  }
`;

export const GET_NEW_POST_OPTIONS = gql`
  mutation GetNewPostOptions {
    getNewPostOptions {
      remainingTime
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
  ${BOOK_OPTIONS}
`;

export const MAKE_POST = gql`
  mutation MakePost($data: PostInput!) {
    makePost(data: $data)
  }
`;

export const CONFIRM_USER = gql`
  mutation ConfirmUser($token: String!) {
    confirmUser(token: $token)
  }
`;
