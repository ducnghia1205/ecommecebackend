const BookingModel = require('../../models/booking');
const HotelModel = require('../../models/hotel');
const utility = require('../../helper/utility');
const constants = require('../../config/constants');
const populate = [
  { path: 'hotel', select: 'name phone avatar photos' },
  { path: 'createdBy', select: 'name userName'}];

module.exports = {
  getList: async (req, res) => {
    try {
      const query = req.query;
      const option = utility.buildOptionByQuery(query);
      const [bookings, count] = await Promise.all([
          BookingModel.find({})
            .populate(populate)
            .sort({createdAt: -1})
            .limit(option.limit)
            .skip(option.offset),
        BookingModel.countDocuments({})
      ]);

      return res.success({bookings, total: count, page: option.page, limit: option.limit})
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
      const booking = await BookingModel.findById(id).populate(populate);
      if (!booking) {
        return res.error(`Booking doesn't exists.`)
      }

      handleDataBeforeResponse(booking);

      return res.success(booking);
    } catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  create: async (req, res) => {
    try {
      const body = req.body;
      const user = req.adminAccount;
      const hotel = utility.stringValidate(body.hotel);
      const startDate = utility.stringValidate(body.startDate);
      const endDate = utility.stringValidate(body.endDate);
      const note = utility.stringValidate(body.note);
      const adults = utility.numberValidate(body.adults);
      const children = utility.numberValidate(body.children);
      if (!hotel || !user || !user._id || !endDate || !startDate) {
        return res.error(`Missing require fields.`)
      }
      const hotelFound = await HotelModel.findById(hotel);

      if (!hotelFound) {
        return res.error(`Hotel doesn't exists.`)
      }

      const data = {
        hotel: hotel,
        startDate: startDate,
        endDate: endDate,
        note: note,
        adults: adults,
        children: children,
        createdBy: user._id,
      };

      const booking = await BookingModel.create(data);
      if (!booking) {
        return res.error(`Create booking fail.`)
      }

      return res.success(booking)
    } catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
      const user = req.adminAccount;
      const hotel = utility.stringValidate(body.hotel);
      const startDate = utility.stringValidate(body.startDate);
      const endDate = utility.stringValidate(body.endDate);
      const note = utility.stringValidate(body.note);
      const status = utility.stringValidate(body.status);
      const adults = utility.numberValidate(body.adults);
      const children = utility.numberValidate(body.children);
      if (!hotel || !user || !user._id || !endDate || !startDate) {
        return res.error(`Missing require fields.`)
      }
      let [hotelFound, booking] = await Promise.all([
        HotelModel.findById(hotel),
        BookingModel.findById(id)
      ]);

      if (!booking) {
        return res.error(`Booking doesn't exists.`)
      }
      if (!hotelFound) {
        return res.error(`Hotel doesn't exists.`)
      }
      if (!constants.LIST_STATUS.includes(status)) {
        return res.error(`Status invalid.`)
      }
      booking.hotel = hotel;
      booking.startDate = startDate;
      booking.endDate = endDate;
      booking.note = note;
      booking.adults = adults;
      booking.status = status;
      booking.children = children;
      await booking.save();

      return res.success(booking);
    } catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.error(`Missing require fields.`)
      }
      const booking = await BookingModel.findById(id);
      if (!booking) {
        return res.error(`Booking doesn't exists.`);
      }
      await BookingModel.remove({_id: id});

      return res.success(`Remove booking success.`)

    } catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },

};

let handleDataBeforeResponse = (user) => {
  user.createdAt = undefined;
  user.updatedAt = undefined;
  user.__v = undefined;
};
