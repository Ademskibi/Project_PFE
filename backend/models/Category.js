                                  import mongoose from "mongoose";
                                  import mongooseSequence from "mongoose-sequence";

                                  const AutoIncrement = mongooseSequence(mongoose);

                                  const categorySchema = new mongoose.Schema({
                                    categoryId: { type: Number, unique: true },
                                    name: { type: String, required: true },
                                    items: { type: Array, default: [] }
                                  });

                                  // Apply auto-increment to `categoryId`
                                  categorySchema.plugin(AutoIncrement, { inc_field: 'categoryId' });

                                  export default mongoose.model('Category', categorySchema);

