import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Profile, PopulatedProfile} from './model';

// Update this if you add a property to the Freet type!
type ProfileResponse = {
  _id: string;
  users: string[];
  profileName: string;
  profileHandle: string;
  bio: string;
  personal: string;
  followerIds: string[];
};


/**
 * Transform a raw Profile object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Profile>} freet - A freet
 * @returns {ProfileResponse} - The freet object formatted for the frontend
 */
const constructProfileResponse = (profile: HydratedDocument<Profile>): ProfileResponse => {
  const profileCopy: PopulatedProfile = {
    ...profile.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const usernames = profileCopy.users.map(i => i.username)
  return {
    ...profileCopy,
    _id: profileCopy._id.toString(),
    users: usernames,
    profileName: profileCopy.profileName,
    profileHandle: profileCopy.profileHandle,
    bio: profileCopy.bio,
    personal: profileCopy.personal.toString(),
    followerIds: profileCopy.followerIds.map(toString)
  };
};

export {
    constructProfileResponse
};
