import SubscriptionLogic from '../../business-logic/subscription';
import { returnErrorResponse } from '../../errors/error-response';

/**
 * List subscriptions
 * @param {Express.Request} req - Express request
 * @param {string} req.userId - User id extracted from token
 * @param {Express.Response} res - Express response
 * @returns {Express.Response} 200 with a list of subscriptions
 */
async function listSubscriptions(req, res) {
  try {
    const { userId, params } = req;
    const { clubId } = params;

    const subscriptions = await SubscriptionLogic.listByClub({ clubId, userId });

    return res.status(200).send({ subscriptions });
  } catch (error) {
    return returnErrorResponse({ error, res });
  }
}

export default listSubscriptions;
