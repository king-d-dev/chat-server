import mongoose from 'mongoose';

interface MessageAttrs {
  text: string;
  from: string;
  to: string;
}

export interface MessageDoc extends mongoose.Document {
  text: string;
  from: string;
  to: string;
}

interface MessageModel extends mongoose.Model<MessageDoc> {
  build: (attrs: MessageAttrs) => MessageDoc;
}

const MessageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

MessageSchema.statics.build = (attrs: MessageAttrs) => new Message(attrs);

const Message = mongoose.model<MessageDoc, MessageModel>(
  'Message',
  MessageSchema
);

export { Message };
