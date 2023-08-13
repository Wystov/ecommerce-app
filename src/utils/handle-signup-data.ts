import { LocalStorageKeys } from '@/types/enums';
import type { UserSignUp, DefaultAddressProps } from '@/types/types';

export const handleUserData = (data: UserSignUp, props: DefaultAddressProps): UserSignUp => {
  const userFullData = data;

  const anonId = localStorage.getItem(LocalStorageKeys.AnonId);
  if (anonId) userFullData.anonymousId = anonId;

  const billingId = userFullData.addresses.length > 1 ? 1 : 0;
  userFullData.shippingAddresses = [0];
  userFullData.billingAddresses = [billingId];

  if (props.defaultShipping) userFullData.defaultShippingAddress = 0;
  if (props.defaultBilling) userFullData.defaultBillingAddress = billingId;

  return userFullData;
};
