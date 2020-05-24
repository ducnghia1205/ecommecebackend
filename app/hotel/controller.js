const HotelModel = require('./model');
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
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const name = req.body.name;
      const description = req.body.description;
      const phone = req.body.phone;
      const avatar = req.body.avatar;
      const photos = req.body.photos;
      if (!id || !name || !description || !phone || !avatar || (!photos && !photos.length)) {
        return res.error('missing require fields!!');
      }
      let isValidate = utility.limitArray(photos);
      if (!isValidate) {
        return res.error('photos maximum is 5!!');
      }

      let hotel = await HotelModel.findById(id);
      if (!hotel) {
        return res.error(`Hotel don't exists.`);
      }

      hotel.name = name;
      hotel.description = description;
      hotel.phone = phone;
      hotel.avatar = avatar;
      hotel.photos = photos;

      await hotel.save();
      return res.success(hotel);
    }catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  create: async (req, res) => {
    try {
      const name = req.body.name;
      const description = req.body.description;
      const phone = req.body.phone;
      const avatar = req.body.avatar;
      const photos = req.body.photos;
      if (!name || !description || !phone || !avatar || (!photos && !photos.length)) {
        return res.error('missing require fields!!');
      }
      let isValidate = utility.limitArray(photos);
      if (!isValidate) {
        return res.error('photos maximum is 5!!');
      }
      const dataHotel = {
        name: name,
        description: description,
        phone: phone,
        avatar: avatar,
        photos: photos
      };
      const hotelSaved = await HotelModel.create(dataHotel);

      utility.handleUserBeforeResponse(hotelSaved);

      return res.success(hotelSaved);
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

      const hotel = await HotelModel.findById(id);

      if (!hotel || !hotel._id) {
        return res.error('missing require fields!!');
      }

      return res.success(hotel);
    }catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  getList: async (req, res) => {
    try {
      let query = utility.buildOptionByQuery(req.query);
      let name = utility.fullTextSearch(req.query.name);
      let params = {};
      if (name) {
        params.name = { $regex: name};
      }
      const hotels = await HotelModel
        .find(params)
        .sort({ createdAt: -1 })
        .limit(query.limit)
        .skip(query.offset);

      return res.success(hotels);
    }catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
};
