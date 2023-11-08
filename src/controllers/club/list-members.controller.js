import MemberLogic from '../../business-logic/member';
import { returnErrorResponse } from '../../errors/error-response';

/**
 * List members
 * @param {Express.Request} req - Express request
 * @param {string} req.userId - User id extracted from token
 * @param {Express.Response} res - Express response
 * @returns {Express.Response} 200 with a list of members
 */
async function listMembers(req, res) {
  try {
    const { userId, params } = req;
    const { clubId } = params;

    const members = await MemberLogic.listByClub({ clubId, userId });

    return res.status(200).send({ members });
  } catch (error) {
    return returnErrorResponse({ error, res });
  }
}

export default listMembers;
