import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefault";
import { useCurrentUser } from "../context/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

interface Profile {
  id: number;
  following_id: number | null;
  followers_count: number;
  following_count: number;
  is_owner: boolean;
  [key: string]: any;
}

interface ProfileDataContextType {
  pageProfile: { results: Profile[] };
  popularProfiles: { results: Profile[] };
}

interface SetProfileDataContextType {
  setProfileData: React.Dispatch<React.SetStateAction<ProfileDataContextType>>;
  handleFollow: (clickedProfile: Profile) => Promise<void>;
  handleUnfollow: (clickedProfile: Profile) => Promise<void>;
}


const ProfileDataContext = createContext<ProfileDataContextType | undefined>(
  undefined
);
const SetProfileDataContext = createContext<
  SetProfileDataContextType | undefined
>(undefined);

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);
  if (context === undefined) {
    throw new Error("useProfileData must be used within a ProfileDataProvider");
  }
  return context;
};

export const useSetProfileData = () => {
  const context = useContext(SetProfileDataContext);
  if (context === undefined) {
    throw new Error("useSetProfileData must be used within a ProfileDataProvider");
  }
  return context;
};

export const ProfileDataProvider: React.FC = ({ children }) => {
  const [profileData, setProfileData] = useState<ProfileDataContextType>({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });

  const currentUser = useCurrentUser();

  const handleFollow = async (clickedProfile: Profile) => {
    try {
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedProfile.id,
      });

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (clickedProfile: Profile) => {
    try {
      await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
