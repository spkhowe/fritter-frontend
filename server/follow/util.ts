import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from './model';

export type FollowResponse = {
    _id: string; 
    userId: string;
    profileId: string;
}

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowResponse} - The freet object formatted for the frontend
 */
 const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse  => {
    const followCopy: PopulatedFollow = {
      ...follow.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    return {
      ...followCopy,
      _id: followCopy._id.toString(),
      userId: followCopy.userId.toString(),
      profileId: followCopy.profileId.toString()
    };
  };
  
  export {
    constructFollowResponse
};