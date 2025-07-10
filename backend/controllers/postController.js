import {uploadToCloudinary } from '../utils/cloudinary.js';
import post from "../models/postSchema.js";
import comment from '../models/commentSchema.js';
import like from '../models/likeSchema.js'
export const createPost = async (req, res) => {
  try {
    console.log(req.file, req.body)
    const { authore_id, description } = req.body;
    if (req.file) {
      const filePath=req.file?.path
      const mediaUrl = await uploadToCloudinary(filePath);
      const type = req.file.mimetype.startsWith("image/") ? "image" : "video";
      const newPost = new post({
        authore_id,
        description,
        mediaUrl,
        type,
      });
       await newPost.save();
      return res.status(200).json({
        message: "Post uploaded successfully",
      });
    } else {
      return res.status(401).json({
        message: "kindly select at least one file to  uploaded",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Failed to upload posts!",
    });
  }
};
export const posts = async (req, res) => {
  try {
    const response = await post.aggregate([
         {$lookup:{
            from:"user",
            localField:"author_id",
            foreignField:"_id",
            as:"author"
        }},
        {$lookup:{
            from:"comment",
            localField:"_id",
            foreignField:"post_id",
            as:"comments"
        }},
        {$addFields:{
            comments:{$size:"$comments"}
        }},
         {$lookup:{
            from:"like",
            localField:"_id",
            foreignField:"post_id",
            as:"likes"
        }},
        {$addFields:{
            likes:{$size:"$likes"}
        }},
        {
            $project:{
                author:{
                    _id:1,
                    fullName:1,
                    image:1
                },
                likes:1,
                comments:1
            }
        }
    
    ]);
    return res.status(200).json({
      message: response,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Failed to load posts!",
    });
  }
};
export const comments = async (req, res) => {
  try {
    const{post_id}=req.params
    const response = await comment.aggregate([
          {$match:{post_id}},
         {$lookup:{
            from:"user",
            localField:"author_id",
            foreignField:"_id",
            as:"author"
        }},
         {
            $project:{
                author:{
                    _id:1,
                    fullName:1,
                    image:1
                }
            }
        }
    ]);
    return res.status(200).json({
      message: response,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Failed to load comments!",
    });
  }
};
export const likes = async (req, res) => {
  try {
    const{post_id}=req.params
    const response = await like.aggregate([
      {$match:{post_id}},
        {$lookup:{
            from:"user",
            localField:"author_id",
            foreignField:"_id",
            as:"author"
        }},
         {
            $project:{
                author:{
                    _id:1,
                    fullName:1,
                    image:1
                }
            }
        }
    ]);
    return res.status(200).json({
      message: response,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Failed to load likes!",
    });
  }
};
export const likePost = async (req, res) => {
  try {
     const{post_id}=req.params;
    const{authore_id}=req.body;
    await like.create({post_id,authore_id});
    return res.status(200).json({
      message: "like to post successfully",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Failed to load likes!",
    });
  }
};
export const commentPost = async (req, res) => {
  try {
    const{post_id}=req.params
    const{message,authore_id}=req.body
    await comment.create({message,post_id,authore_id})
    return res.status(200).json({
      message: "comment to post successfully",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Failed to comment!",
    });
  }
};
