import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    roomNumber: {type: String, require: true},
    roomType: {type: String, enum: ["דלוקס","רגיל","סוויטה"], require: true},
    price: {type: Number, require: true},
    view: {type: String, enum: ["ים","בריכה","עיר"], require: true},
    availability: {type: Boolean, default: true},
    active: {type: Boolean, default: true},
    imageUrl: {type: String, require: true},
    roomSize: { type: Number },
    bedType: { type: String, enum: ["מיטה זוגית", "מיטת יחיד"] },
    airConditioning: { type: Boolean, default: true },
    dailyCleaning: { type: Boolean, default: true },
    smokingAllowed: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    maxOccupancy: { type: Number },
    bathroomType: { type: String, enum: ["מקלחת", "אמבטיה", "אמבטיה/מקלחת"] },
    floor: { type: Number },
    balcony: { type: Boolean, default: false },
})

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);