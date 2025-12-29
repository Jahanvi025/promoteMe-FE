import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
export default function Root() {
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  isAuthenticated ? navigate("/feed") : navigate("/login");
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed");
    } else {
      navigate("/login");
    }
  }, []);
  return <></>;
}
