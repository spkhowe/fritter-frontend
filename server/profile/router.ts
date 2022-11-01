import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import { Types } from 'mongoose';
import * as ProfileUtil from './util';
import ProfileCollection from './collection';
import * as ProfileValidator from '../profile/middleware'
import * as UserValidator from '../user/middleware'
import UserModel from '../user/model';

const router = express.Router();

// GET one profile by profile username -- done
// GET all profiles by a specific user -- done
// POST a new profile. When new user is created, generate a profile - done 
// DELETE a profile by name -- done
// PUT update a profiles information 

/**
 * Get a profile by username
 * 
 * @name GET /api/profiles?profileHandle=username
 * @return {ProfileResponse } - the profile request
 * @throws {403} if user is not logged in 
 * @throws {400} - If profileHandle is not given
 * @throws {404} - If no profile has given username
 */
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        // Check if username query parameter was supplied
        if (req.query.username !== undefined) {
          next();
          return;
        }
        // otherwise get all profiles the current user is a part of 
        console.log("session:", req.session)
        const userId = req.session.userId || "";
        const user = await UserModel.findOne({_id: userId});
        const allProfiles = await ProfileCollection.findAllByUser(user.username);
        const response = allProfiles.map(ProfileUtil.constructProfileResponse);
        res.status(200).json(response);
      },
    [
        UserValidator.isUserLoggedIn,
        ProfileValidator.isProfileExists
    ],
    async (req: Request, res: Response) => {
        const profile = await ProfileCollection.findOneByUsername(req.query.username as string);
        const response = ProfileUtil.constructProfileResponse(profile);
        console.log("Profile:", profile)
        res.status(200).json(response);
      }
)

/**
 * Create a new profile (specifically a group one).
 *
 * @name POST /api/profiles
 *
 * @param {string} username - the handle of the profile 
 * @return {ProfileResponse} - The created profile
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
 router.post(
    '/',
    [
        ProfileValidator.requiredInformation,
        UserValidator.isUserLoggedIn,
        UserValidator.isValidUsername,
        UserValidator.isUsernameNotAlreadyInUse
    ],
    async (req: Request, res: Response) => {
        const userId = req.session.userId as string || "";
        const profile = await ProfileCollection.addOne(userId, req.body.username, false, req.body.profileName,  req.body.bio)
        res.status(201).json({
            message: 'Your profile was created successfully.',
            freet: ProfileUtil.constructProfileResponse(profile)
      });
    }
  );

/**
 * Delete a profile.
 *
 * @name DELETE /api/profiles/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or if user isnt a member of this profile
 */
router.delete(
    '/:username?',
    [
      UserValidator.isUserLoggedIn,
      ProfileValidator.isMemberOfProfile
    ],
    async (req: Request, res: Response) => {
      ProfileCollection.deleteAllByUsername(req.params.username)
      res.status(200).json({
        message: 'Your account has been deleted successfully.'
      });
    }
  );

  export {router as profileRouter};

