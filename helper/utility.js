const { PAGINATE_LIMIT, MAX_PAGINATE_LIMIT } = require('../config/config');

let self = module.exports = {
  handleUserBeforeResponse: (data) => {
    data.updatedAt = undefined;
    data.__v = undefined;
  },
  isValidEmail: (email) => {
    let emailRegEx = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    return emailRegEx.test(email);
  },

  stringValidate: (string, isNull = 1) => {
    let currentValue = isNull ? null : undefined;
    return (string && string.length > 0 && typeof (string) === 'string') ? string.trim() : currentValue;
  },

  arrayValidate: (array)=> Array.isArray(array) && array.length > 0 ? array : null,

  numberValidate: (number) => {
    number = typeof number === 'string' ? number.trim() : number;
    number = typeof number === 'boolean' ? undefined : number;
    return (number || number === 0) && !isNaN(number) ? parseInt(number) : undefined;
  },

  limitValidate: function (limit) {
    let newNumber = this.numberValidate(limit) || PAGINATE_LIMIT;
    return newNumber <= MAX_PAGINATE_LIMIT ? newNumber : MAX_PAGINATE_LIMIT;
  },

  getMongoSkip: (page, limit) => (page - 1) * limit,

  getTotalPage: (count=0, limit=1)=> Math.ceil(count/limit),

  buildOptionByQuery: (query) => {
    let page = self.numberValidate(query.page) || 1;
    let limit = self.limitValidate(query.limit);
    let offset = self.getMongoSkip(page, limit);
    return { page, limit, offset };
  },
  limitArray: (array) => {
    return array.length <= 5;
  },

  fullTextSearch: (str) => {
    if (typeof(str) !== 'string') {
      return str;
    }
    str = str.replace(/  +/g, ' ');
    str = str.replace(/a/gi, '[AÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶ]');
    str = str.replace(/e/gi, '[EÉÈẺẼẸÊẾỀỂỄỆ]');
    str = str.replace(/i/gi, '[IÍÌỈĨỊ]');
    str = str.replace(/o/gi, '[OÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ]');
    str = str.replace(/u/gi, '[UÚÙỦŨỤƯỨỪỬỮỰ]');
    str = str.replace(/y/gi, '[YÝỲỶỸỴ]');
    str = str.replace(/d/gi, '[DĐ]');
    return str;
  },
  buildFullTextSearchObj: function (params, fieldsToFullTextSearch = [], isInsensitiveCase = false) {
    let tmp = { ...params };
    if (fieldsToFullTextSearch.length === 0) {
      return tmp;
    }
    fieldsToFullTextSearch.forEach((field) => {
      let value = tmp[field];
      if (value) {
        let regex = isInsensitiveCase ? new RegExp(value, 'i') : new RegExp(this.fullTextSearch(value), 'i');
        tmp[field] = { $regex: regex };
      }
    });
    return tmp;
  },
};
