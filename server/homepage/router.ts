import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import * as FreetUtil from '../freet/util';
import * as UserValidator from '../user/middleware';
import HomepageCollection from './collection';

const router = express.Router();

// GET: my homepage following view 
//     - Show the 20 most recent tweets posted by people following 
// GET: my homepage following activity view 
//     - Add capability to get likes by username 
//     - Go through up to 10 people at random that the user is following. Grab their most recently liked thing 

/**
 * Get homepage following view 
 *
 * @name GET /api/homepage
 *
 * @return {FreetResponse[]} - A list of freets for feed
 *
 */
 router.get(
    '/',
    [
        UserValidator.isUserLoggedIn,
        UserValidator.isCurrentSessionUserExists 
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.session.userId;
        const user = await UserCollection.findOneByUserId(userId);
        const feed = await HomepageCollection.getFeed(user.username) //infinittyyy
        const subsetFeed = feed.slice(0, 10);
        const response = subsetFeed.map(FreetUtil.constructFreetResponse);
        res.status(200).json(response);
        }
 )

export {router as homepageRouter};
