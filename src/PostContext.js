import { createContext, useContext, useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';

// 1) CREATE A CONTEXT
const PostContext = createContext();

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchedPosts, searchQuery]);
  // 2) PROVIDE VALUE TO THE CHILD COMPONENTS
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

function usePost() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error('PostContext was used outside of the PostProvider');
  return context;
}

export { usePost, PostProvider };
