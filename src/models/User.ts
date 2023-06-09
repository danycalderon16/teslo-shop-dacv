import { IUser } from '@/interfaces';
import mongoose, { Schema, model, Model } from 'mongoose'


const userSchema = new Schema({
  name: { type: 'string', require: true },
  email: { type: 'string', require: true, unique: true },
  password: { type: 'string', require: true },
  role: {
    type: 'string',
    enum: {
      values: ['admin', 'client','super-user', 'SEO'],
      messages: ['{VALUES} no es un role válido'],
      default: 'client',
      required: true
    }
  }
}, {
  timestamps: true
})

const User:Model<IUser> = mongoose.models.User || model('User',userSchema)

export default User;