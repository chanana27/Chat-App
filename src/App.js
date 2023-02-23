import {useEffect, useState, useRef} from "react";
import {Box, Button, Container, VStack, Input, HStack} from "@chakra-ui/react"
import Message from "./Components/Message";
import {app} from "./firebase"; 
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut} from "firebase/auth";

import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
  } from "firebase/firestore" ;  

const auth = getAuth(app);  // for login authentication
const db = getFirestore(app);  // for creating database of messages

const loginHandler = ()=>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
}

const logoutHandler = ()=> signOut(auth);    // logout's user

function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // an array to store message

  const divForScroll = useRef(null);

  const submitHandler = async(e)=>{
    e.preventDefault();                  // to prevent loading

    try{
      setMessage("");

       await addDoc(collection(db, "Messages"), { // creating a document
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp()
      });

      divForScroll.current.scrollIntoView({behaviour: "smooth"}); 
    }
    catch(error) {
      alert(error);
    }
  };

  useEffect(()=>{
  const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onAuthStateChanged(auth, data => {
      setUser(data);
    });
 
    const unsubscribeForMessage = onSnapshot(q, (snap) =>{
      setMessages(
        snap.docs.map((item) =>{
          const id = item.id;
          return {id, ...item.data()};
        })
      );
    });

    return () =>{
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);

  return (
    <Box bg={"red.50"}>
      {
      user ? (
        <Container h={"100vh"} bg={"white"}>
        <VStack h={"full"} paddingY={"4"}>
          <Button w={"full"} colorScheme={"red"} onClick={logoutHandler} >
            Logout
          </Button>

          <VStack h={"full"} w={"full"} overflowY = {"auto"}
            css={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
            >
            {messages.map((item) =>(
              <Message 
                key={item.id} // whenever we map we have to give key.
                user = {item.uid === user.uid ? "me" : "other"}
                texttt = {item.text}
                uri = {item.uri}
              />
            ))}
            <div ref = {divForScroll}></div>
          </VStack>


          <form onSubmit={submitHandler} style = {{width: "100%"}}>
          <HStack>
            <Input value={message} onChange ={ (e)=> setMessage(e.target.value)} placeholder="Enter a message" />
            <Button colorScheme={"purple"} type={"submit"}>Send</Button>
          </HStack>
          </form>
        </VStack>
      </Container>
      ) : (
      <VStack justifyContent={"center"} h="100vh">
        <Button colorScheme={"purple"} onClick={loginHandler}>Sign In With Google</Button>
      </VStack>
    )}
    </Box>
  );
}

export default App;
