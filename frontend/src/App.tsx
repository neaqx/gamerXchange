import NavBar from './components/NavBar';
import styles from './App.module.css';
import Container from 'react-bootstrap/Container';
import { Route, Routes } from 'react-router-dom';
import './api/axiosDefault';
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import PostCreateForm from './pages/posts/PostCreateForm';
import PostPage from './pages/posts/PostPage';
import PostsPage from './pages/posts/PostsPage';
import PostEditForm from './pages/posts/PostEditForm';
import ProfilePage from './pages/profiles/ProfilePage';
import UsernameForm from './pages/profiles/UsernameForm';
import UserPasswordForm from './pages/profiles/UsernamePasswordForm';
import ProfileEditForm from './pages/profiles/ProfileEditForm';
import NotFound from './components/NotFound';
import { CurrentUserProvider, useCurrentUser } from './context/CurrentUserContext';

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <CurrentUserProvider>
      <div className={styles.App}>
        <NavBar />
        <Container className={styles.Main}>
          <Routes>
            <Route
              path="/"
              element={
                <PostsPage message="No results found. Adjust the search keyword." />
              }
            />
            <Route
              path="/feed"
              element={
                <PostsPage
                  message="No results found. Adjust the search keyword or follow a user."
                  filter={`owner__followed__owner__profile=${profile_id}&`}
                />
              }
            />
            <Route
              path="/liked"
              element={
                <PostsPage
                  message="No results found. Adjust the search keyword or like a post."
                  filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
                />
              }
            />
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/posts/create" element={<PostCreateForm />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/posts/:id/edit" element={<PostEditForm />} />
            <Route path="/profiles/:id" element={<ProfilePage />} />
            <Route path="/profiles/:id/edit/username" element={<UsernameForm />} />
            <Route path="/profiles/:id/edit/password" element={<UserPasswordForm />} />
            <Route path="/profiles/:id/edit" element={<ProfileEditForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </div>
    </CurrentUserProvider>
  );
}

export default App;



