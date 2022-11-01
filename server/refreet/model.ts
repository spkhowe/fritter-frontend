import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import type {Profile} from '../profile/model'

export type Refreet = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    ogFreet: Types.ObjectId;
    authorId: Types.ObjectId; // User who refreeted 
  };
  
  export type PopulatedRefreet = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    ogFreet: Freet;
    authorId: User;
  };

const RefreetSchema = new Schema<Refreet>({
    ogFreet: {
        type: Schema.Types.ObjectId,
        required:  true,
        ref: 'Freet'
    },
    authorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const RefreetModel = model<Refreet>('Refreet', RefreetSchema);
export default RefreetModel;