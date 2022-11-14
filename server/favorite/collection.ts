import type {HydratedDocument, Types} from 'mongoose';
import type {Favorite, FavoriteTemplate} from './model';
import FavoriteModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import UserModel from '../user/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Favorite> is the output of the FavoriteModel() constructor,
 * and contains all the information in Favorite. https://mongoosejs.com/docs/typescript.html
 */
 class FavoriteCollection {
    /**
     * Find all favorites by freet.
     * 
     * @param {string} freetId - The id of the freet 
     * @return {Promise<HydratedDocument<FavoriteTemplate>[]>} - An array of all the favorites
     */
    static async findAllByFreet(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<FavoriteTemplate>>> {
        return FavoriteModel.find({freetId: freetId}).populate('freetId userId');
    }
    
    /**
     * Find all favorites in database
     * 
     * @return {Promise<HydratedDocument<FavoriteTemplate>[]>}
     */
    static async findAll(): Promise<Array<HydratedDocument<FavoriteTemplate>>> {
        return FavoriteModel.find({}).populate('freetId userId');
    }

    /**
     * Delete all favorites in database 
     * 
     * @return {Promise<void>} - true if the favorites have been deleted, false otherwise
    */
    static async deleteAll(): Promise<void> {
        await FavoriteModel.remove({});
    }


     /**
     * Find a favorite by freetid and userid
     *
     * @param {string} freetId 
     * @param {string} userId
     * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The favorite with the given freetId and freetId, if any
     */
    static async findOne(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Favorite>> {
            return FavoriteModel.findOne({freetId: freetId, userId: userId}).populate('freetId userId');
        }

    /**
     * Add a favorite to a freet 
     * 
     * @param {Types.ObjectId} freetId - id of the freet 
     * @param {Types.ObjectId} userId - id of the user favoriting the freet 
     * @return {Promise<HydratedDocument<FavoriteTemplate>>}
     */
    static async addOne(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<FavoriteTemplate>> {
        const fav = new FavoriteModel({
            freetId,
            userId: userId
        })
        await fav.save(); // saves favorite to mongoDB
        return fav.populate('freetId userId');
        // return favorite.populate('userId');
        }

    /**
     * Delete a freet with given freetId.
     *
     * @param {string} freetId - The freetId
     * @param {string} userId - The user who favorited the freet 
     * @return {Promise<Boolean>} - true if the fav has been deleted, false otherwise
     */
    static async deleteOne(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<boolean> {
        const f = await FavoriteModel.findOne({freetId: freetId, userId: userId});
        const favorite = await FavoriteModel.deleteOne({_id: f._id});
        return favorite !== null;
    }
 }
  
export default FavoriteCollection;
  
