import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    console.log('Fetched posts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createPost = async (newPost) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, newPost, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    console.log('Created post:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (updatedPost) => {
  try {
    const response = await axios.put(`${API_URL}/posts/${updatedPost.id}`, updatedPost, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    console.log('Updated post:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    await axios.delete(`${API_URL}/posts/${postId}`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    console.log('Deleted post with id:', postId);
    return postId;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
