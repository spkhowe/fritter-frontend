import type {HydratedDocument, Types} from 'mongoose';
import ProfileModel from '../profile/model';
import ProfileCollection from '../profile/collection';
import UserCollection from '../user/collection';
import type {User} from '../user/model';

class MemberCollection {
    static async getAllUsers(profileHandle: string): Promise<Array<HydratedDocument<User>>> {
        const profile = await ProfileCollection.findOneByUsername(profileHandle);
        const users = []
        for (let i of profile.users) {
            const user = await UserCollection.findOneByUserId(i)
            users.push(user)
        }
        return users
    }

}

export default MemberCollection