import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';


export type FavoriteTemplate = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    freetId: Types.ObjectId; // Freet that was liked
    userId: Types.ObjectId; // User that liked the freet 
  };

export type Favorite = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    freetId: Freet; // Freet that was liked
    userId: User; // User that liked the freet 
}

const FavoriteSchema = new Schema<FavoriteTemplate>({
    freetId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Freet'
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const FavoriteModel = model<FavoriteTemplate>('Favorite', FavoriteSchema);
export default FavoriteModel;
