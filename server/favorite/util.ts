import type {HydratedDocument} from 'mongoose';
import type {FavoriteTemplate, Favorite} from '../favorite/model';

export type FavoriteResponse = {
    _id: string; 
    freetId: string; 
    userId: string;
}

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<FavoriteTemplate>} favorite - A favorite
 * @returns {FavoriteResponse} - The freet object formatted for the frontend
 */
 const constructFavoriteResponse = (favorite: HydratedDocument<FavoriteTemplate>): FavoriteResponse => {
    const favoriteCopy: Favorite = {
      ...favorite.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    // const {username} = freetCopy.authorId;
    // delete freetCopy.authorId;
    return {
      ...favoriteCopy,
      _id: favoriteCopy._id.toString(),
      freetId: favoriteCopy.freetId.toString(),
      userId: favoriteCopy.userId.toString()
    };
  };
  
  export {
    constructFavoriteResponse,
  };