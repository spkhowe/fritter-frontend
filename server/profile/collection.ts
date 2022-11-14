import type {HydratedDocument, Types} from 'mongoose';
import type {Profile} from './model';
import ProfileModel from './model';
import UserCollection from '../user/collection';
import UserModel from '../user/model';
import { userRouter } from '../user/router';
import { isUserLoggedOut } from '../user/middleware';

class ProfileCollection {
    /**
    * Add a Profile to the collection
    *
    * @param {string} user - The user to initiate the profile with (username)
    * @param {string} profileName - the name to display the profile as
    * @param {string} username - the handle of the profile 
    * @param {string} bio - bio of the profile (optional)
    * @param {boolean} personal - whether this is a personal profile or not
    * @return {Promise<HydratedDocument<Profile>>} - The newly created profile
    */
    static async addOne(userId: Types.ObjectId | string, username: string, personal:boolean, profileName?: string,  bio?: string): Promise<HydratedDocument<Profile>> {
        const userobj = await UserCollection.findOneByUserId(userId);
        const profile = new ProfileModel({
            users: [userobj._id],
            profileName: profileName,
            profileHandle: username,
            bio: bio,
            personal: personal,
            followerIds: []
        });
        await profile.save(); // Saves profile to MongoDB
        return profile.populate('users');
        // return profile.populate('users');
    }

    // static async addUserToProfile(username: string, profileHandle:string): Promise<HydratedDocument<Profile>> {
    //     const profile = await ProfileModel.findOne({profileHandle: profileHandle});
    //     // const user = await UserModel.findOne({username: username});
    //     profile.users.push(username);
    //     await profile.save();
    //     return profile.populate('users');
    // }

    static async findOneByUsername(profileHandle: string): Promise<HydratedDocument<Profile>> {
        return ProfileModel.findOne({profileHandle: profileHandle});
    }

    static async findAllByUser(userId: Types.ObjectId): Promise<Array<HydratedDocument<Profile>>> {
        // const abc = await ProfileModel.find({users: username})
        // const allprofiles = await ProfileModel.find({profileHandle: "spkhowee"});
        // const wrd = await UserModel.find({username: "spkhowee"})
        return ProfileModel.find({ users: userId }); // Find all profiles that a user belongs to
    }

    static async deleteAllByUsername(profileHandle:string): Promise<void> {
        await ProfileModel.deleteMany({profileHandle: profileHandle});
    }

    static async updateOne(userId: Types.ObjectId | string, profileDetails: any): Promise<HydratedDocument<Profile>> {
    // updates can include: change_username, add_user, remove_user  
        const user = await UserCollection.findOneByUserId(userId);
        const oldUsername = user.username;
        const personalProfile = await ProfileModel.findOne({users: oldUsername, personal: true});

        if (profileDetails.username) {
            personalProfile.profileHandle = profileDetails.username as string;
        }

        if (profileDetails.added_user) {
            personalProfile.users.push(profileDetails.added_user)
        }

        if (profileDetails.removed_user) {
            delete personalProfile.users[profileDetails.removed_user]
        }

        await personalProfile.save();
        return personalProfile

    }
}

export default ProfileCollection; 