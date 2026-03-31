import { useEffect, useState } from "react";
import { useParams, Outlet, Link } from "react-router-dom";
import {
  fetchPublicProfile,
  type PublicProfileResponse,
} from "../../services/api";
import { PublicProfileContext } from "../../context/PublicProfileContext";
import PublicSiteHeader from "../../components/PublicSiteHeader/PublicSiteHeader";
import "../PublicProfile/PublicProfile.css";

export default function PublicLayout() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<PublicProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;
    fetchPublicProfile(username)
      .then(({ data: d }) => setData(d))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="pub-loading">
        <span className="auth-loading-spinner" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="pub-not-found">
        <p className="pub-not-found_code">404</p>
        <h1 className="pub-not-found_heading">Profile not found</h1>
        <Link to="/login" className="pub-not-found_link">
          ← Back to login
        </Link>
      </div>
    );
  }

  return (
    <PublicProfileContext.Provider value={{ ...data, username: username! }}>
      <PublicSiteHeader />
      <Outlet />
    </PublicProfileContext.Provider>
  );
}
