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
  const [newPassword, setNewPassword] = useState("");
  const [passOpen, setPassOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [user, setUser] = useState(null);
  const [openRename, setOpenRename] = useState(false);
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

  const handleChange = (val) => {
    if (val === "updatePassword") {
      setPassOpen(true);
    }
    if (val === "rename") {
      setOpenRename(true);
    }
    if (val === "logout") {
      auth.signOut();
    }
  }

  const updateUsername = (event) => {
    event.preventDefault();
    user.updateProfile({
      displayName: newName,
    }).then(function () {
      alert('Username updated!');
    }).catch(function (error) {
      alert(error);
    });
    setOpenRename(false);
    setUsername(newName);
  }


  const resetPassword = (event) => {
    event.preventDefault();
    user.updatePassword(newPassword).then(function () {
      alert('Password Changed successfully!')
    }).catch(function (error) {
      alert(error);
    });
    setPassOpen(false);
  }

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

      <Modal open={passOpen} onClose={() => setPassOpen(false)}>
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
              placeholder="New Password"
              value={newPassword}
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button onClick={resetPassword}>Update</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openRename} onClose={() => setOpenRename(false)}>
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
              placeholder="New Username"
              value={newName}
              type="text"
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button onClick={updateUsername}>Update</Button>
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
          <div className='App__dropDown'>
            {/* <Button onClick={() => auth.signOut()}>{`${user.displayName}, Logout`}</Button> */}
            <select onChange={(e) => handleChange(e.target.value)}>
              <option value="name">Welcome, {`${user.displayName}`}</option>
              <option value="rename"> Update username</option>
              <option value="updatePassword">Update password</option>
              <option value="logout">Logout</option>
            </select>
          </div>
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
