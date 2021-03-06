import axios from 'axios';
import React, { useState } from 'react';

export default ({ postId }) => {
  const [content, setContent] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`http://post.com/posts/${postId}/comments`, {
      content,
    });
    setContent('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          ></input>
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
