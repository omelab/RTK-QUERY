import { useAppSelector } from '../../redux/store';

export const ProfilePage = () => {
  const user = useAppSelector((state) => state.authState.user);

  return (
    <h1>
      Welcome to <strong>Full Name:</strong> {user?.name}
    </h1>
  );
};

export default ProfilePage;
