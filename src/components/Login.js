import { AuthContext } from "../providers/AuthContext";
import { useContext } from "react";
import { signInWithGoogle } from "../services/firebase";
import { Box } from "@mui/system";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import lamejs from "lamejs"

export default function Login(props) {
    const { user } = useContext(AuthContext);
    console.log(props);
    const path = !props.location.state?.from ? "/dashboard" : props.location.state.from.pathname; 
    return (
        <Box>
          {!!user ? (
            <Redirect to={{ pathname: path }} />
          ) : (
            <div>
              <p>Please Sign In</p>
              <button onClick={signInWithGoogle} > Sign In With Google </button>
            </div>
          )}
        </Box>
      );
}