import express from 'express';
import type {NextFunction, Request, Response} from 'express';
import * as ProfileValidator from '../profile/middleware';
import MemberCollection from './collection'
import * as UserUtil from '../user/util';

const router = express.Router();

// get members of profile provided in req.query
router.get(
    '/',
    [
      // middleware
      ProfileValidator.isProfileExists
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await MemberCollection.getAllUsers(req.query.username as string)
      const response = users.map(UserUtil.constructUserResponse)
      res.status(200).json(response)
    }
  )

export {router as memberRouter};
