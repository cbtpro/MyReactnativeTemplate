import { instance } from '@/services/instance';

import { User, userSchema } from './schema';

export const UserServices = {
  fetchOne: async (id: number) => {
    const response = await instance.get<IResponseBody<User>>(`users/${id}`).json();

    return userSchema.parse(response.data);
  },
};
