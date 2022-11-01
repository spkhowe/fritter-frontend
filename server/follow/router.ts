import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as favoriteValidator from '../favorite/middleware';
import * as followValidator from './middleware';
import * as profileValidator from '../profile/middleware'
import FollowCollection from './collection';
import { Types } from 'mongoose';
import * as FollowUtil from './util';
import FavoriteCollection from '../favorite/collection';


const router = express.Router();

// POST: follow a profile -- done 
// DELETE: unfollow a profile -- done 
// GET: all users following a profile
// GET: all profiles a user is following


/**
 * Get all profiles that a user is following
 *
 * @name GET /api/favorites?user=username
 *
 * @return {util.FollowReponse[]} - A list of all profiles a user is following
 * @throws {400} - If username is not given
 * @throws {404} - If invalid username
 *
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      //xCheck if profile username was given 
      if (req.query.username !== undefined) { 
        next();
        return;
      }
    },
    [
      userValidator.isUserExists
    ],
    async (req: Request, res: Response) => {
      const userFollowing = await FollowCollection.findAllFollowing(req.query.username as string);
      const response = userFollowing.map(FollowUtil.constructFollowResponse);
      res.status(200).json(response);
    }
  );


/**
//  * Get all users following a profile
//  *
//  * @name GET /api/favorites?userId=id
//  *
//  * @return {util.FollowReponse[]} - A list of all profiles a user is following
//  * @throws {400} - If userId is not given
//  * @throws {404} - If invalid userId
//  *
//  */
//  router.get(
//     '/',
//     async (req: Request, res: Response, next: NextFunction) => {
//       // Check if userId was given 
//       if (req.query.userId !== undefined) { 
//         next();
//         return;
//       }
//     },
//     [
//       userValidator.isUserExists
//     ],
//     async (req: Request, res: Response) => {
//       const profileFollowers = await FollowCollection.findAllByProfile(req.query.username as string);
//       const response = profileFollowers.map(FollowUtil.constructFollowResponse);
//       res.status(200).json(response);
//     }
//   );


/**
 * Follow a profile 
 * 
 * @name POST /api/follows
 *
 * @param {string} username - profile uesername  
 * @return {FollowResponse} - The follow 
 * @throws {400} - If profileId not given 
 * @throws {404} - If user not logged in or profile doesn't exist
 */
 router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        followValidator.isProfileExists, 
        followValidator.isNotFollowedAlready 
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const follow = await FollowCollection.addOne(userId, req.body.username);  
        res.status(200).json({
            message: 'Successfully followed this profile',
            follow: FollowUtil.constructFollowResponse(follow) //TODO 
        });

    }
);

 

/**
 * Remove a favorite from a profile
 * 
 * @name DELETE /api/follows
 *
 * @param {string} username - profile username  
 * @return {string} - Success message
 * @throws {400} - If profile username not given 
 * @throws {404} - If user not logged in or profile doesn't exist
 *
 */
 router.delete(
    '/:username?',
    [
        userValidator.isUserLoggedIn,
        followValidator.isProfileExists, 
        followValidator.isFollowing 
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        await FollowCollection.deleteOne(userId, req.params.username); 
        res.status(200).json({
            message: `Successfully unfollowed this profile ${req.params.username}`
        });

    }
);


// /**
//  * Delete all favorites for my sanity 
//  * 
//  * @name DELETE /api/favorites
//  * 
//  * @return {string} - Success message
//  */
// router.delete(
//     '/',
//     async (req: Request, res: Response) => {
//         await FavoriteCollection.deleteAll();
//         res.status(200).json({
//             message: "Successfully deleted all favorites"
//         })
//     }

// )

export {router as followRouter};
