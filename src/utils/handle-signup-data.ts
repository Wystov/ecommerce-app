import type { UserAuthOptions } from '@commercetools/sdk-client-v2';
import { LocalStorageKeys } from '@/types/enums';
import type { UserDataBundle, UserSignUp } from '@/types/types';

export const handleUserData = (data: UserSignUp): UserDataBundle => {
  const user: UserAuthOptions = {
    username: data.email,
    password: data.password,
  };
  const userFullData = data;
  const anonId = localStorage.getItem(LocalStorageKeys.AnonId);
  if (anonId) userFullData.anonymousId = anonId;
  return { user, userFullData };
};
