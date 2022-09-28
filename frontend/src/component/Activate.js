import { useContext, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import LoginIcon from "@mui/icons-material/Login";
import Container from "@mui/material/Container";
import NavBar from "./NavBar";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import classes from "./app.module.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const Activate = () => {
  const { setAuth } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [userpassword, setUserpassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [sucess, setSucess] = useState(false);
  const [error, setError] = useState("");
  const url = "http://localhost:5000/account";
  const navigate = useNavigate();
  let suc = true;

  const activateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${url}/activate`, {
        username: username,
      });
      if (response.status === 200) {
        console.log("Account activated");
        setSuccessMsg("Account activated");
        setSuccess("Success");
        setUsername("");
        setSucess(true);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        console.log("*Invalid output");
        setErrMsg("Invalid input");
        setError("Error");
      } else if (err.response?.status === 404) {
        console.log("User not found");
        setErrMsg("User not found");
        setError("Error");
      } else {
        console.log("Activation failed");
        setErrMsg("Activation failed");
        setError("Error");
      }
    }
  };

  return (
    <div>
        <Container
          sx={{
            "& .MuiTextField-root": { m: 2, width: "40ch" },
          }}
        >
          <NavBar />
          <Typography
            sx={{ m: 2 }}
            variant="h6"
            color="textSecondary"
            component="h2"
            gutterBottom
          >
           Activate Account
          </Typography>
          {success === "Success" ? <SuccessAlert msg={successMsg} /> : null}
          {error === "Error" ? <ErrorAlert msg={errMsg} /> : null}
          <form noValidate autoComplete="off" onSubmit={activateUser}>
            <TextField
              required
              label="Username"
              variant="outlined"
              className={classes.field}
              fullWidth
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              sx={{ m: 2, mt: 1, width: 320, height: 40 }}
              type="submit"
              variant="contained"
              endIcon={<LoginIcon />}
            >
              Activate
            </Button>
          </form>
        </Container>
    </div>
  );
};

export default Activate;
