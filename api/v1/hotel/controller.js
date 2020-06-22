const HotelModel = require('../../../models/hotel');
const utility = require('../../../helper/utility');
const constants = require('../../../config/constants');


module.exports = {
  getList: async (req, res) => {
    try {
      const query = req.query;
      const option = utility.buildOptionByQuery(query);
      const name = utility.stringValidate(query.name);

      let params = {
        status: constants.STATUS.ACTIVE
      };
      if (name) {
        params.name = name;
        params = utility.buildFullTextSearchObj(params,['name']);
      }

      const data = await HotelModel.find(params).sort({createdAt: -1}).limit(option.limit).skip(option.offset);

      return res.success(data)
    } catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  getDetail: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.error(`Missing require fields.`);
      }
      const query = {
        _id: id,
        status: constants.STATUS.ACTIVE
      };

      const hotel = await HotelModel.findOne(query);
      if (!hotel) {
        return res.error(`Hotel doesn't exists.`)
      }

      handleUserBeforeResponse(hotel);

      return res.success(hotel);
    } catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  }
};

let handleUserBeforeResponse = (user) => {
  user.createdAt = undefined;
  user.updatedAt = undefined;
  user.__v = undefined;
};
