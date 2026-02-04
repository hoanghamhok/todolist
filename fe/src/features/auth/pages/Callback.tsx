import { useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";


export default function GoogleCallback() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token || !auth) {
      navigate('/');
      return;
    }

    auth.loginWithToken(token).then(() => {
      navigate('/');
    });
  }, []);

  return <p>Signing in with Google...</p>;
}
