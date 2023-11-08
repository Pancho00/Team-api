import UserModel from '../../models/user/user.model';

/**
 * Get a user from the input query
 * @param {object} args.query - Query object
 * @param {string[]} args.select - String of fields to select
 * @returns {User} User found
 */
async function getOne({ query, select }) {
  const getUserQuery = UserModel.findOne(query);

  if (select && select.length) {
    getUserQuery.select(select.join(' '));
  }

  const user = await getUserQuery;

  return user;
}

export default getOne;
