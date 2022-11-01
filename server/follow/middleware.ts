import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import FavoriteCollection from '../favorite/collection';
import FavoriteModel from './model';
import ProfileModel from '../profile/model';
import ProfileCollection from '../profile/collection';
import FollowModel from './model';

/**
 * Checks if a profile with given username exists
 */
const isProfileExists = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username || req.params.username;
  const profile = await ProfileCollection.findOneByUsername(username);
  if (!profile) {
    res.status(404).json({
      error: {
        profileNotFound: `Profile with username ${username} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * checks if the user isn't already following the profile
 */
const isNotFollowedAlready = async (req:Request, res:Response, next: NextFunction) => {
    const userId = req.session.userId;
    const username = req.body.username || req.query.username;
    const profile = await ProfileCollection.findOneByUsername(username);
    const follow = await FollowModel.findOne({userId: userId, profileId: profile._id});
    if (follow) {
        res.status(403).json({
            error: {
                alreadyFollowing: `You are already following this profile with username ${username}`
            }
        });
        return;
    }
    next();
}

/**
 * check if user is already following profile
 */
const isFollowing = async (req:Request, res:Response, next:NextFunction) => {
    const userId = req.session.userId;
    const username = req.body.username || req.params.username;
    const profile = await ProfileCollection.findOneByUsername(username);
    const follow = await FollowModel.findOne({userId: userId, profileId: profile._id});
    if (!follow) {
        res.status(403).json({
            error: {
                alreadyFollowing: `You are not following this profile with username ${username}`
            }
        });
        return;
    }
    next();
}

export {
    isProfileExists,
    isNotFollowedAlready,
    isFollowing
  };