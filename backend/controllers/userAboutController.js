import UserAbout from '../models/user.about.js';

export const getUserAbout = async (req, res) => {
    try {
      let about = await UserAbout.findOne({ userId: req.user._id });
  
      if (!about) {
        about = new UserAbout({ userId: req.user._id });
        await about.save();
      }
  
      // Convert Mongoose document to plain JS object
      const aboutObj = about.toObject();
  
      // Remove MongoDB internal fields you don't want to expose
      delete aboutObj._id;
      delete aboutObj.userId;
  
      res.json(aboutObj);
    } catch (error) {
      console.error('Get About Error:', error);
      res.status(500).json({ message: error.message });
    }
  };
  

  export const updateUserAbout = async (req, res) => {
    try {
      const userId = req.user?._id;
  
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
      }
  
      const existingAbout = await UserAbout.findOne({ userId });
  
      if (existingAbout) {
        Object.assign(existingAbout, req.body);
        await existingAbout.save();
  
        const aboutObj = existingAbout.toObject();
        delete aboutObj._id;
        delete aboutObj.userId;
  
        res.json(aboutObj);
      } else {
        const newAbout = await UserAbout.create({
          ...req.body,
          userId,
        });
  
        const aboutObj = newAbout.toObject();
        delete aboutObj._id;
        delete aboutObj.userId;
  
        res.status(201).json(aboutObj);
      }
    } catch (error) {
      console.error('Update About Error:', error);
      res.status(500).json({ message: error.message });
    }
  };
  