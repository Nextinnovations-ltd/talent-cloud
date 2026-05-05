const yup = require('yup');
const schema = yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/);
schema.isValid('000111222.@gG').then(console.log).catch(console.error);
