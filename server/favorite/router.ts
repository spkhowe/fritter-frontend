import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as favoriteValidator from '../favorite/middleware';
import FavoriteCollection from './collection';
import { Types } from 'mongoose';
import * as util from './util';


const router = express.Router();

// get user favorites by freet
// get favorites by user 
// post new favorite --done
// delete favorite --done

/**
 * Get all favorites
 *
 * @name GET /api/favorites
 *r
 * @return {util.FavoriteResponse[]} - A list of all favorites
 */
/**
 * Get favorites by freet.
 *
 * @name GET /api/favorites?freetId=id
 *
 * @return {util.FavoriteResponse[]} - A list of all favorites of a particular freet
 * @throws {400} - If freetId is not given
 * @throws {404} - If invalid freetId
 *
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if freetId query parameter was supplied
      if (req.query.freetId !== undefined) { 
        next();
        return;
      }
      const allFavorites = await FavoriteCollection.findAll(); 
      const response = allFavorites.map(util.constructFavoriteResponse);

      res.status(200).json(response);

    },
    [
      favoriteValidator.isFreetExists 
    ],
    async (req: Request, res: Response) => {
    //   const freetFavs = await FavoriteCollection.findAllByFreet(req.query.freetId as string);
    //   const response = freetFavs.map(util.constructFavoriteResponse);
      const favorite = await FavoriteCollection.findOne(req.query.freetId as string, req.session.userId);
      if (favorite) {
          res.status(200).json({'message': true})
      } else {
          res.status(200).json({'message': false})
      }
    }
  );


/**
 * Add a favorite to a freet by a user 
 * 
 * @name POST /api/favorites
 *
 * @param {Types.ObjectId} freetId 
 * @return {FavoriteResponse} - The favorite 
 * @throws {400} - If userId or freetId is not given 
 * @throws {404} - If no user has given userId or no freet has the given freetId
 *
 */
 router.post(
    '/',
    [
        favoriteValidator.isFreetExists,
        userValidator.isUserLoggedIn,
        favoriteValidator.isNotFavoritedAlready
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const fav = await FavoriteCollection.addOne(req.body.freetId as string, userId); 
        res.status(200).json({
            message: 'Successfully favorited freet',
            favorite: util.constructFavoriteResponse(fav)
        });

    }
);

/**
 * Remove a favorite from a freet
 * 
 * @name DELETE /api/favorites/:id
 *
 * @return {string} - Success message
 * @throws {400} - If user not logged in or if user didn't favorite freet
 * @throws {404} - If freet id not valid 
 *
 */
 router.delete(
    '/:freetId?',
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.params.freetId !== undefined) {
            next();
            return;
        }
        await FavoriteCollection.deleteAll(); //otherwise delete all favorites (this is dangerous but for now do)
        res.status(200).json({
            message: "Successfully deleted all favorites"
        })
    },
    [
        freetValidator.isFreetExists,
        userValidator.isUserLoggedIn,
        favoriteValidator.isFavoritedAlready
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        await FavoriteCollection.deleteOne(req.params.freetId as string, userId); 
        res.status(200).json({
            message: 'Successfully removed favorite from Freet.'
        });

    }
);


/**
 * Delete all favorites for my sanity 
 * 
 * @name DELETE /api/favorites
 * 
 * @return {string} - Success message
 */
router.delete(
    '/',
    async (req: Request, res: Response) => {
        await FavoriteCollection.deleteAll();
        res.status(200).json({
            message: "Successfully deleted all favorites"
        })
    }

)

export {router as favoriteRouter};
