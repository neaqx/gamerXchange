import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom"; // useParams from react-router-dom for v6
import { axiosReq } from "../../api/axiosDefault";
import Post from "./Posts";
import Comment from "../comments/comment";

import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../context/CurrentUserContext";

import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Assets";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

// Define types for post and comments
interface CommentData {
  id: number;
  content: string;
  profile_id: number;
  profile_image: string; // Add profile_image property
  owner: string; // Add owner property
  updated_at: string; // Add updated_at property
  [key: string]: any; // Include other possible comment properties
}

interface PostPageParams {
  id: string;
  [key: string]: string | undefined;
}

interface PostProps {
  id: number;
  owner: string;
  title: string;
  content: string;
  image: string;
  comments_count: number;
  likes_count: number;
  like_id?: number;
  setPost: React.Dispatch<React.SetStateAction<{ results: PostProps[] }>>;
  postPage?: boolean;
  [key: string]: any;
}

const PostPage: React.FC = () => {
  const { id } = useParams<PostPageParams>(); // TypeScript knows `id` is a string
  const [post, setPost] = useState<{ results: PostProps[] }>({ results: [] });
  const currentUser = useCurrentUser() as { username: string; profile_id: number; profile_image: string };
  const profile_image = currentUser?.profile_image || "";
  const [comments, setComments] = useState<{ results: CommentData[]; next?: string }>({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: post }, { data: comments }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
          axiosReq.get(`/comments/?post=${id}`),
        ]);
        setPost({ results: [post] });
        setComments(comments);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        {post.results.length > 0 && (
          <Post {...post.results[0]} setPost={setPost} postPage={true} />
        )}
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={parseInt(id ?? "")}
              setPost={setPost}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            <InfiniteScroll
              dataLength={comments.results.length}
              next={() => fetchMoreData(comments, setComments)}
              hasMore={!!comments.next}
              loader={<Asset spinner />}
            >
              {comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setPost={setPost}
                  setComments={setComments}
                />
              ))}
            </InfiniteScroll>
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span>
          ) : (
            <span>No comments... yet</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
};

export default PostPage;



