import type {HydratedDocument, Types} from 'mongoose';
import type {Follow, PopulatedFollow} from './model';
import FavoriteModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from 'freet/collection';
import UserModel from '../user/model';
import FollowModel from './model';
import ProfileCollection from '../profile/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Favorite> is the output of the FavoriteModel() constructor,
 * and contains all the information in Favorite. https://mongoosejs.com/docs/typescript.html
 */
 class FollowCollection {
    /**
     * Add a follow to a profile
     * @param {Types.ObjectId} userId - user 
     * @param {Types.ObjectId} username - profile to follow 
     * @return {Promise<HydratedDocument<Follow>>}
     */
         static async addOne(userId: Types.ObjectId | string, username: string): Promise<HydratedDocument<Follow>> {
            const profile = await ProfileCollection.findOneByUsername(username);
            const follow = new FollowModel({
                userId: userId,
                profileId: profile._id
            })
            await follow.save(); // saves follow to mongoDB
            return follow.populate('userId profileId');
         }
    
    /**
     * Unfollow a profile 
     * @param {Types.ObjectId} userId - user 
     * @param {string} username - profile to follow 
     * @return {Promise<Boolean>}
     */
    static async deleteOne(userId: Types.ObjectId | string, username: string): Promise<boolean> {
        const profile = await ProfileCollection.findOneByUsername(username);
        const follow = await FollowModel.deleteOne({userId: userId, profileId: profile._id});
        return follow !== null;
    }

    /**
     * Find all followers of a profile 
     * @param {string} username - profile 
     * @return {Promise<HydratedDocument<Follow[]>>}
     */
    static async findAllByProfile(username: string): Promise<Array<HydratedDocument<Follow>>> {
        const profile = await ProfileCollection.findOneByUsername(username)
        return FollowModel.find({profileId: profile._id})
    }

    /**
     * Find all profiles a user is following
     * @param {string} username - user 
     * @return {Promise<HydratedDocument<Follow[]>>}
     */
         static async findAllFollowing(username: string): Promise<Array<HydratedDocument<Follow>>> {
            const user = await UserCollection.findOneByUsername(username)
            return FollowModel.find({userId: user._id})
        }
}

 export default FollowCollection;
