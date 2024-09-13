import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefault";

import styles from "../../styles/CommentCreateEditForm.module.css";

// Typisierung der Props
interface CommentEditFormProps {
  id: number;
  content: string;
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  setComments: React.Dispatch<
    React.SetStateAction<{
      results: { id: number; content: string; updated_at: string }[];
    }>
  >;
}

const CommentEditForm: React.FC<CommentEditFormProps> = ({
  id,
  content,
  setShowEditForm,
  setComments,
}) => {
  const [formContent, setFormContent] = useState<string>(content);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormContent(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) =>
          comment.id === id
            ? { ...comment, content: formContent.trim(), updated_at: "now" }
            : comment
        ),
      }));
      setShowEditForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button
          className={styles.Button}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </button>
        <button
          className={styles.Button}
          disabled={!formContent.trim()}
          type="submit"
        >
          save
        </button>
      </div>
    </Form>
  );
};

export default CommentEditForm;
