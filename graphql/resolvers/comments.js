const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const { authorization: { checkAuth } } = require('../../util');
module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === '') {
        throw new UserInputError('Comment cannot be empty', {
          errors: {
            body: 'Comment cannot be empty'
          }
        });
      }
      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found.');
      }
    },
    deleteComment: async (_, { commentId, POSTiD }, context) => {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const commmentIndex = post.coments.findIndex(comment => comment.id === commentId);
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('You are not authorized to delete this comment');
        }
      } else {
        throw new UserInputError('Post not found.');
      }
    }
  }
};