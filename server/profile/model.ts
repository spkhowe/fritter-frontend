import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Profile = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    users: [String]; // Usernames that have access to this profile.
    profileName: String; // Name that is displayed
    profileHandle: String; // defaults to username for individual profile;
    bio: String;
    personal: Boolean; // If personal, only one person can access
    followerIds: [Types.ObjectId];
  };


export type PopulatedProfile = {
    _id: Types.ObjectId;
    users: [String];
    profileName: String;
    profileHandle: String;
    bio: String;
    personal: Boolean;
    followerIds: [User];
}

const ProfileSchema = new Schema<Profile>({
    // The author userId
    users: {
      // Use Types.ObjectId outside of the schema
      type: [String],
      required: true
      },
    // The name to be displayed on the profile
    profileName: {
      type: String,
      required: false
    },
    // Profile handle
    profileHandle: {
      type: String,
      required: true
    },
    // Optional information about the profile
    bio: {
      type: String,
      required: false
    },
    personal: {
      type: Boolean,
      required: true
    },
    followerIds: {
        type: [Schema.Types.ObjectId],
        required: false,
        ref: 'User' // Is this right?
    }
  });
  
  const ProfileModel = model<Profile>('Profile', ProfileSchema);
  export default ProfileModel;
  