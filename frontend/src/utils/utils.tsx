import jwtDecode from "jwt-decode";
import { axiosReq } from "../api/axiosDefault";

interface Profile {
  id: number;
  followers_count: number;
  following_id: number | null;
  following_count: number;
  is_owner: boolean;
  [key: string]: any;
}

interface Resource<T> {
  next: string | null;
  results: T[];
}

export const fetchMoreData = async <T extends { id: number }>(
  resource: Resource<T>,
  setResource: React.Dispatch<React.SetStateAction<Resource<T>>>
) => {
  try {
    const { data } = await axiosReq.get(resource.next as string);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc: T[], cur: T) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {
    console.error(err);
  }
};

export const followHelper = (profile: Profile, clickedProfile: Profile, following_id: number): Profile => {
  return profile.id === clickedProfile.id
    ? {
        ...profile,
        followers_count: profile.followers_count + 1,
        following_id,
      }
    : profile.is_owner
    ? {
        ...profile,
        following_count: profile.following_count + 1,
      }
    : profile;
};

export const unfollowHelper = (profile: Profile, clickedProfile: Profile): Profile => {
  return profile.id === clickedProfile.id
    ? {
        ...profile,
        followers_count: profile.followers_count - 1,
        following_id: null,
      }
    : profile.is_owner
    ? {
        ...profile,
        following_count: profile.following_count - 1,
      }
    : profile;
};

export const setTokenTimestamp = (data: { refresh_token: string }) => {
  const refreshTokenTimestamp = (jwtDecode(data.refresh_token) as { exp: number }).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp.toString());
};

export const shouldRefreshToken = (): boolean => {
  return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};