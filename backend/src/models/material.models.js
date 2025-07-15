import {mongoose,Schema} from 'mongoose';

const materialSchema=new Schema({
serialNumber:{
    type:String,
    required:true,
},
materialName:{
type:String,
required:true
},
siteName:{
    type:String,
    required:true,
},

actualStock:{
    type:Number,
    required:true
},
usedStock:{
type:Number,
required:true,
},
costPerUnit:{
    type:Number,
    required:true,
},
buyDate:{
type:Date,
required:true,
}


},{
    timestamps:true
})

export const Material= mongoose.model("Material",materialSchema);