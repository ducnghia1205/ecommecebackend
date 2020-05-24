const BookingModel = require('./model');
const HotelModel = require('../hotel/model');
const UserModel = require('../user/model');
const utility = require('../../helper/utility');

module.exports = {
  delete: async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) {
        return res.error('missing require fields!!');
      }
      let hotel = await HotelModel.findById(id);
      if (!hotel) {
        return res.error(`Hotel don't exists.`);
      }

      await HotelModel.deleteOne({_id: id});
      return res.success();
    }catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  create: async (req, res) => {
    try {
      const userId = req.body.userId;
      const hotelId = req.body.hotelId;
      if (!userId || !hotelId) {
        return res.error('missing require fields!!');
      }
      const [user, hotel] = await Promise.all([
        UserModel.findById(userId),
        HotelModel.findById(hotelId)]);
      if (!user || !hotel) {
        return res.error(`User or Hotel don't exists.`);
      }
      const dataBooking = {
        userId: userId,
        hotelId: hotelId,
      };
      let bookingSaved = await BookingModel.create(dataBooking);

      utility.handleUserBeforeResponse(bookingSaved);

      return res.success(bookingSaved);
    }catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  getDetail: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.error('missing require fields!!');
      }

      const booking = await BookingModel
        .findById(id)
        .populate([{ path: 'userId', model: 'User', select: '_id name userName createdAt' }, { path: 'hotelId', model: 'Hotel' }]);

      if (!booking || !booking._id) {
        return res.error('missing require fields!!');
      }

      return res.success(booking);
    }catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  getList: async (req, res) => {
    try {
      let query = utility.buildOptionByQuery(req.query);

      const bookings = await BookingModel
        .find()
        .sort({ createdAt: -1 })
        .limit(query.limit)
        .skip(query.offset);

      return res.success(bookings);
    }catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
};
