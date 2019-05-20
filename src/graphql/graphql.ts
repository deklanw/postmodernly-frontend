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

export const GET_POST_OPTIONS = gql`
  mutation GetPostOptions {
    getPostOptions {
      remainingTime
      postOptions {
        book1Options {
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
        book2Options {
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
      }
    }
  }
`;

export const GET_POSTS_WITH_CURSOR = gql`
  query GetPostsWithCursor($cursor: String, $limit: Int!) {
    getPostsWithCursor(cursor: $cursor, limit: $limit) {
      cursor
      posts {
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
      }
    }
  }
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

export const GET_NEW_POST_OPTIONS = gql`
  mutation GetNewPostOptions {
    getNewPostOptions {
      remainingTime
      postOptions {
        book1Options {
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
        book2Options {
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
      }
    }
  }
`;

export const MAKE_POST = gql`
  mutation MakePost($data: PostInput!) {
    makePost(data: $data)
  }
`;
