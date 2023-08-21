import { useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { userApi } from '../../redux/api/auth/userApi';
import FullScreenLoader from '../../components/FullScreenLoader';

const RequireUser = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const [cookies] = useCookies(['access_token']);
  const location = useLocation();

  const {
    data: user,
    isLoading,
    isFetching,
  } = userApi.endpoints.getMe.useQuery(null, {
    skip: !cookies.access_token, // Skip fetching if access_token is not available
    refetchOnMountOrArgChange: false, // Do not refetch on mount or argument change
  });

  console.log(cookies.access_token);
  console.log(location);
  console.log(user);
  console.log(isLoading);
  console.log(isFetching);
  console.log(allowedRoles);
  console.log('RequireUser');

  // const user = useSelector((state: RootState) => state.auth.user);
  // const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  // const isFetching = useSelector((state: RootState) => state.auth.isFetching);
  // const allowedRoles = useSelector((state: RootState) => state.auth.allowedRoles);
  // const user = useSelector((state: RootState) => state.auth.user);
  // const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  // const isFetching = useSelector((state: RootState) => state.auth.isFetching);

  const loading = isLoading || isFetching;

  const isAuthorized = useMemo(() => {
    if (!user) {
      return false;
    }
    return allowedRoles.includes(user.role as string);
  }, [allowedRoles, user]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return isAuthorized ? (
    <Outlet />
  ) : cookies.access_token && user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireUser;
