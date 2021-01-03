import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { db, auth } from "./Firebase";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="App__signup">
            <center>
              <img
                className="App__headerImage"
                src="https://www.edigitalagency.com.au/wp-content/uploads/instagram-logo-text-black-png.png"
                alt=""
              />
            </center>
            <Input
              placeholder="Username"
              value={username}
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={email}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Register</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="App__signup">
            <center>
              <img
                className="App__headerImage"
                src="https://www.edigitalagency.com.au/wp-content/uploads/instagram-logo-text-black-png.png"
                alt=""
              />
            </center>
            <Input
              placeholder="Email"
              value={email}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Login</Button>
          </form>
        </div>
      </Modal>

      <div className="App__header">
        <img
          className="App__headerImage"
          src="https://www.edigitalagency.com.au/wp-content/uploads/instagram-logo-text-black-png.png"
          alt=""
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
            <div className="app__loginController">
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
              <Button onClick={() => setOpen(true)}>Sign In</Button>
            </div>
          )}
      </div>

      <div className="App__posts">
        <div className="App__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>

        {/* <div className="App__postsRight">
          <InstagramEmbed
            url=""
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div> */}
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3>Login to upload and comment.</h3>
        )}
    </div>
  );
}

export default App;
