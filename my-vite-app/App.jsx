import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, createPost, updatePost, deletePost } from './api';

function App() {
  const queryClient = useQueryClient();


  const { data: posts, isLoading, error } = useQuery(['posts'], fetchPosts);


  const createPostMutation = useMutation(createPost, {
    onSuccess: (newPost) => {
      queryClient.setQueryData(['posts'], (oldPosts) => [newPost, ...oldPosts]);
    },
  });


  const updatePostMutation = useMutation(updatePost, {
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts'], (oldPosts) =>
        oldPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
    },
  });


  const deletePostMutation = useMutation(deletePost, {
    onSuccess: (deletedPostId) => {
      queryClient.setQueryData(['posts'], (oldPosts) =>
        oldPosts.filter((post) => post.id !== deletedPostId)
      );
    },
  });

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [editingPost, setEditingPost] = useState(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleCreatePost = () => {
    console.log('Creating post with title:', newPostTitle);
    if (newPostTitle.trim() && newPostBody.trim()) {
      createPostMutation.mutate({
        title: newPostTitle,
        body: newPostBody,
        userId: 1,
      });
      setNewPostTitle('');
      setNewPostBody('');
    }
  };

  const handleUpdatePost = () => {
    console.log('Updating post:', editingPost);
    if (editingPost && newPostTitle.trim() && newPostBody.trim()) {
      updatePostMutation.mutate({
        ...editingPost,
        title: newPostTitle,
        body: newPostBody,
      });
      setEditingPost(null);
      setNewPostTitle('');
      setNewPostBody('');
    }
  };

  const handleDeletePost = (postId) => {
    console.log('Attempting to delete post with id:', postId);
    deletePostMutation.mutate(postId, {
      onError: (error) => {
        console.error('Error deleting post:', error);
      },
      onSuccess: () => {
        console.log('Successfully deleted post with id:', postId);
      },
    });
  };

  const startEditingPost = (post) => {
    setEditingPost(post);
    setNewPostTitle(post.title);
    setNewPostBody(post.body);
  };

  return (
    <div>
      <h1>Posts</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Body"
          value={newPostBody}
          onChange={(e) => setNewPostBody(e.target.value)}
        />
        {editingPost ? (
          <button onClick={handleUpdatePost}>Update Post</button>
        ) : (
          <button onClick={handleCreatePost}>Create Post</button>
        )}
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <button onClick={() => startEditingPost(post)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
