import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useNavigate, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefault";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../context/CurrentUserContext";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

// Typisierung für Fehler
interface Errors {
  username?: string[];
}

const UsernameForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      navigate("/");
    }
  }, [currentUser, navigate, id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axiosRes.put("/dj-rest-auth/user/", { username });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      navigate(-1); // Geht zur vorherigen Seite zurück
    } catch (err: any) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Content}>
          <Form onSubmit={handleSubmit} className="my-2">
            <Form.Group>
              <Form.Label>Change username</Form.Label>
              <Form.Control
                placeholder="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              onClick={() => navigate(-1)}
            >
              cancel
            </Button>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              type="submit"
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;
