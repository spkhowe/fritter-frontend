import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import FavoriteCollection from '../favorite/collection';
import ProfileModel from './model';
import ProfileCollection from './collection';
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
    console.log("Required info middleware")
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

/**
 * Checks if a user with userId as username in req.query exists
 */
 const isProfileExists = async (req: Request, res: Response, next: NextFunction) => {
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
    const profile = await ProfileCollection.findOneByUsername(req.params.username);
    const profileUsers = profile.users;
    const userId = req.session.userId;
    const user = await UserModel.findOne({_id: userId})
    const check = profileUsers.includes(user.username);
    console.log(check)
    if (!check) {
        res.status(403).json({
            error: `Can't delete a profile you aren't a part of`
        });
        return;
    }
    next();
};

export {
    requiredInformation,
    isProfileExists,
    isMemberOfProfile
}