import FollowModel from '../follow/model';
import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from '../freet/model';
import FreetModel from '../freet/model';
import UserCollection from '../user/collection';  
import FollowCollection from '../follow/collection';
import FreetCollection from '../freet/collection';
import ProfileCollection from '../profile/collection';
import ProfileModel from '../profile/model';

class HomepageCollection {
    /**
     * Get all the freets in the database
     *
     * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
     */

    static async getFeed(username: string): Promise<Array<HydratedDocument<Freet>>> {
        const allFreets = await FreetCollection.findAll();
        const following = await FollowCollection.findAllFollowing(username);
        const followingIds = await following.map(f => f.profileId)
        const followingFreets = [];
        for (let freet of allFreets) {
            if (this.followingProfile(freet, followingIds)) {
                followingFreets.push(freet);
            }
        }

        return followingFreets;
    }

    static async followingProfile(freet: Freet, following: Types.ObjectId[]) {

        if (following.includes(freet.authorId._id)) {
            const user = await UserCollection.findOneByUserId(freet.authorId);
            return true;
        }
        return false;
    }

}



//  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
//     // Retrieves freets and sorts them from most to least recent
//     return FreetModel.find({}).sort({dateModified: -1}).populate('authorId');

export default HomepageCollection;
