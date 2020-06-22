const HotelModel = require('../../models/hotel');
const utility = require('../../helper/utility');
const constants = require('../../config/constants');


module.exports = {
  getList: async (req, res) => {
    try {
      const query = req.query;
      const option = utility.buildOptionByQuery(query);
      const name = utility.stringValidate(query.name);

      let params = {};
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
      const hotel = await HotelModel.findById(id);
      if (!hotel) {
        return res.error(`Hotel doesn't exists.`)
      }

      handleUserBeforeResponse(hotel);

      return res.success(hotel);
    } catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  create: async (req, res) => {
    try {
      const body = req.body;
      const name = utility.stringValidate(body.name);
      const phone = utility.stringValidate(body.phone);
      const avatar = utility.stringValidate(body.avatar);
      const description = utility.stringValidate(body.description);
      const photos = utility.arrayValidate(body.photos);
      if (!name || !phone) {
        return res.error(`Missing require fields.`)
      }
      if (!utility.limitArray(photos)) {
        return res.error(`Limit of photos is 5.`)
      }

      const data = {
        name: name,
        phone: phone,
        avatar: avatar,
        description: description,
        photos: photos
      };

      const hotelCreated = await HotelModel.create(data);
      if (!hotelCreated) {
        return res.error(`Create hotel fail.`)
      }

      return res.success(hotelCreated)
    } catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
      const name = utility.stringValidate(body.name);
      const phone = utility.stringValidate(body.phone);
      const avatar = utility.stringValidate(body.avatar);
      const description = utility.stringValidate(body.description);
      const photos = utility.arrayValidate(body.photos);
      const status = utility.stringValidate(body.status);

      if (!id || !name || !phone) {
        return res.error(`Missing require fields.`)
      }
      if (!utility.limitArray(photos)) {
        return res.error(`Limit of photos is 5.`)
      }
      if (!constants.LIST_STATUS.includes(status)) {
        return res.error(`Status invalid.`)
      }
      let hotel = await HotelModel.findById(id);
      if (!hotel) {
        return res.error(`Hotel doesn't exists.`);
      }
      hotel.name = name;
      hotel.phone = phone;
      hotel.avatar = avatar;
      hotel.description = description;
      hotel.photos = photos;
      hotel.status = status;
      await hotel.save();

      return res.success(hotel);
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
      const hotel = await HotelModel.findById(id);
      if (!hotel) {
        return res.error(`Hotel doesn't exists.`);
      }
      await HotelModel.remove({_id: id});

      return res.success(`Remove hotel success.`)

    } catch (e) {
      console.log('catch ERR: ', e);
      return res.error(e, 500);
    }
  },

};

let handleUserBeforeResponse = (user) => {
  user.createdAt = undefined;
  user.updatedAt = undefined;
  user.__v = undefined;
};
