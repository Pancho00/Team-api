import ClubLogic from '../../business-logic/club';
import { returnErrorResponse } from '../../errors/error-response';

/**
 * List clubs
 * @param {Express.Request} _req - Express request
 * @param {Express.Response} res - Express response
 * @returns {Express.Response} 200 with a list of clubs
 */
async function list(_req, res) {
  try {
    const clubs = await ClubLogic.list();
    
    return res.status(200).send({ clubs});
  } catch (error) {
    return returnErrorResponse({ error, res });
  }
}

export default list;
