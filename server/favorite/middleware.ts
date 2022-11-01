import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import FavoriteCollection from '../favorite/collection';
import FavoriteModel from './model';

/**
 * Checks if a freet with freetId  exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const freetId = req.body.freetId || req.query.freetId;
  const validFormat = Types.ObjectId.isValid(freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.freetId} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * 
 * Check if user already favorited this freet so that allowed to delete fav
 */
const isFavoritedAlready = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req.session.userId as string) ?? '';
  const favorite =  await FavoriteCollection.findOne(req.params.freetId, user);
  if (!favorite) {
    res.status(404).json({
      error: {
        favoriteNotFound: 'User has not favorited this freet yet'
      }
    });
    return;
  }
  next();
};

/**
 * 
 * Check if this has favorited this freet
 */
 const isNotFavoritedAlready = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req.session.userId as string) ?? '';
  const favorite =  await FavoriteCollection.findOne(req.body.freetId, user);
  if (favorite) {
    res.status(404).json({
      error: {
        favoriteNotFound: "You can't favorite a freet twice."
      }
    });
    return;
  }
  next();
};


export {
    isFreetExists,
    isFavoritedAlready,
    isNotFavoritedAlready
  };