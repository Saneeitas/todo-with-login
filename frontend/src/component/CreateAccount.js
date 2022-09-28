import { useState } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import CreateIcon from "@mui/icons-material/Create";
import NavBar from "./NavBar";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";
import classes from "./app.module.css";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userpassword, setUserpassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [suc, setSuc] = useState(false);
  const [error, setError] = useState(false);
  const url = "http://localhost:5000/account";

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright � "}
        <Link color="inherit" href="#">
          Northino
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  const theme = createTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    setFullname(data.get("fullname"));
    setPhonenumber(data.get("number"));
    setEmail(data.get("email"));
    setUsername(data.get("username"));
    setUserpassword(data.get("password"));

    console.log(fullname, phonenumber, email, username, userpassword);

    try {
      const response = await axios.post(`${url}/create`, {
        full_name: fullname,
        phone_number: phonenumber,
        email: email,
        username: username,
        userpassword: userpassword,
      });
      if (response.status === 200) {
        console.log("Account created");
        setSuccess(
          `Your account was created successfully. 
          Kindly activate and login with your username @ ${response.data.username}`
        );
        setSuc(true);
        return JSON.parse(localStorage.getItem("user"));
      }
      setFullname("");
      setPhonenumber("");
      setEmail("");
      setUsername("");
      setUserpassword("");
    } catch (err) {
      if (err.response?.status === 400) {
        console.log("Invalid output");
        setErrMsg("Invalid input");
        setError(true);
      } else if (err.response?.status === 401) {
        console.log("User Already exist");
        setErrMsg("User Already Exist");
        setError(true);
      } else {
        console.log("Registration failed");
        setErrMsg("Registration failed");
        setError(true);
      }
    }
  };

  const activateAccount = async () => {
    try {
      const response = await axios.post(`${url}/sendEmail`, {
        message: "Kindly activate your account",
      });

      if (response.status === 200) {
        console.log("Activation was send to your email");
        navigate("/user/activate");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <p>{error ? <Alert severity="error">{errMsg}</Alert> : null}</p>
            <p>{suc ? <Alert severity="success">{success}</Alert> : null}</p>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="fullname"
                  required
                  fullWidth
                  id="fullname"
                  label="FullName"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="number"
                  label="Phone Number"
                  name="number"
                  type="Number"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  label="Username"
                  id="username"
                  autoComplete="new-username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I agree & accept the terms and condition to create an account with this platform."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="./login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default CreateAccount;
