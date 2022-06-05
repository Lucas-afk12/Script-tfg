/* eslint linebreak-style: ["error", "unix"] */
import { Schema, createConnection, model } from 'mongoose';

const autoIncrement = require('mongoose-auto-increment');

export const connection = createConnection('mongodb+srv://Lucas:Salmeron@cluster0.athzv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

const MangaSchema = new Schema({
  _id: { type: Number },
  Datos: { type: Object },
  Personal: { type: Object },
  Tags: { type: Array },
  tipo: { type: String },
  apiID: { type: String },
});

autoIncrement.initialize(connection);

MangaSchema.plugin(autoIncrement.plugin, 'mangas');

export const MangaModel = connection.model('mangas', MangaSchema);
