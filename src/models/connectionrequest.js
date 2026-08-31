const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        require: true,
        ref:'User'
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        require: true,
        ref:'User'
    },
    status: {
        type: String,
        require: true,
        enum: {
            values: ['accepted', 'ignored', 'intrested', 'rejected'],
            message: "validation failed for {PATH} with {VALUE} please eneter correct status"
        }
    }
},{timestamps:true})
connectionRequestSchema.pre('save', function() {
    const fromUserId = this?.fromUserId;
    const toUserId = this?.toUserId;
    if (fromUserId.equals(toUserId)) {
        throw new Error("User can't send connection request to himself!");
    }
})
// compounding index
connectionRequestSchema.index({fromUserId:1,toUserId:1})

const ConnectionReuestModel = mongoose.model('Connectionrequest', connectionRequestSchema);

module.exports = ConnectionReuestModel;