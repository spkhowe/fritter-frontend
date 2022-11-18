import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import FavoriteCollection from '../favorite/collection';
import ProfileModel from './model';
import ProfileCollection from './collection';
import UserCollection from '../user/collection';
import UserModel from '../user/model';


/**
 * Checks if a freet with freetId  exists
 */
const requiredInformation = async (req: Request, res: Response, next: NextFunction) => {
    // if (!req.body.personal) {
    //     res.status(404).json({
    //         error: {
    //             requiredInformationError: `Must specify if this is a group or personal profile.`
    //         }
    //     });
    //     return;
    // }
    if (!req.body.username) {
        res.status(404).json({
            error: {
                requiredInformationError: `Must specify a profile handle`
            }
    });
    return;
  }
  next();
};

const isValidChange = async (req:Request, res:Response, next:NextFunction) => {
  if (!req.body.username) {
    res.status(400).json({
      error: 'Provided username must be nonempty'
    })
  }
  const groupUsername = req.body.username;
  const groupProfile = await ProfileCollection.findOneByUsername(groupUsername)
  if (req.body.added_user) {
    // check that this user isn't already in the profile 
    const users = []
    for (let i of groupProfile.users) {
      const user = await UserCollection.findOneByUserId(i);
      users.push(user.username)
    }
    if (users.includes(req.body.added_user)) {
      res.status(400).json({
        error: 'This user is already in your group'
      })
    }
    next();
    return
  }
  else if (req.body.removed_user) {
    const users = []
    for (let i of groupProfile.users) {
      const user = await UserCollection.findOneByUserId(i);
      users.push(user.username)
    }
    if (!users.includes(req.body.removed_user)) {
      res.status(400).json({
        error: 'This user is not in this group'
      })
    }
    next();
    return
  }
}

/**
 * Checks if a user with userId as username in req.query exists
 */
 const isProfileExists = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.author) {
      next();
      return
    }
    if (!req.query.username) {
      res.status(400).json({
        error: 'Provided profile username must be nonempty.'
      });
      return;
    }
    const user = await ProfileCollection.findOneByUsername(req.query.username as string);
    if (!user) {
      res.status(404).json({
        error: `A profile with username ${req.query.username as string} does not exist.`
      });
      return;
    }
    next();             
  };

/**
 * Checks if user is actually a member of this profile 
 * 
 */
const isMemberOfProfile = async (req:Request, res:Response, next: NextFunction) => {
    const username = req.params.username || req.body.username || req.query.username;
    const profile = await ProfileCollection.findOneByUsername(username);
    const profileUsernames = []
    for (let i of profile.users) {
      const user = await UserCollection.findOneByUserId(i._id)
      profileUsernames.push(user.username)
    }
    // const usernames = profileUsers.map(i => i.username)
    const userId = req.session.userId;
    const user = await UserModel.findOne({_id: userId});
    const check = profileUsernames.includes(user.username);
    if (!check) {
        res.status(403).json({
            error: `You are not a member of this profile.`
        });
        return;
    }
    next();
};

const isNotPersonalProfile = async (req: Request, res:Response, next: NextFunction) => {
  const username = req.params.username || req.body.username;
  const profile = await ProfileCollection.findOneByUsername(username);
  if (profile.personal) {
    res.status(404).json({
      error: "You can't delete your personal profile page."
    })
  }
  next();
}

const isValidProfile = async (req:Request, res:Response, next: NextFunction) => {
  const profileHandle = req.body.username;
  const profile = await ProfileCollection.findOneByUsername(profileHandle);
  if (profile == null){
    res.status(400).json({
      error: "This profile doesn't exist"
    })
  }
  next();
}


export {
    requiredInformation,
    isProfileExists,
    isMemberOfProfile,
    isNotPersonalProfile,
    isValidProfile,
    isValidChange
}