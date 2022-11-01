import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import type {Profile} from '../profile/model';


export type Follow = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: Types.ObjectId; // User 
    profileId: Types.ObjectId; // Profile user follows
  };

export type PopulatedFollow = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: User; // User that liked the freet 
    profileId: Profile; // Profile user follows
}

const FollowSchema = new Schema<Follow>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    profileId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Profile'
    }
})

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
