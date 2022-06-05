/* eslint linebreak-style: ["error", "unix"] */
import { Schema, createConnection, model } from 'mongoose';

const autoIncrement = require('mongoose-auto-increment');

const connection = createConnection('mongodb+srv://Lucas:Salmeron@cluster0.athzv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

const ChapterSchema = new Schema({
  _id: { type: Number },
  chapter_id: { type: Number },
  chapter: { type: Object }
});

autoIncrement.initialize(connection);

ChapterSchema.plugin(autoIncrement.plugin,{ model:'capitulos',field: 'chapter_id'});

export const ChapterModel = connection.model('capitulos', ChapterSchema);
