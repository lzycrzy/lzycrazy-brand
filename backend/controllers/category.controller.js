import Category from '../models/Category.js';

export const getAllCategories = async (req, res) => {
  console.log("fetching all categories......")
  
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isActive
    } = req.query;

    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const skip = (pageNumber - 1) * pageLimit;

    const filter = {};

    // Optional isActive filter
    if (Object.prototype.hasOwnProperty.call(req.query, 'isActive')) {
      filter.isActive = isActive === 'true';
    }

    // Optional search filter on name and subcategory name
    if (search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'subcategories.name': { $regex: search, $options: 'i' } }
      ];
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [categories, total] = await Promise.all([
      Category.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageLimit)
        .populate('createdBy', 'name email'),
      Category.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        categories,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(total / pageLimit),
          totalItems: total,
          itemsPerPage: pageLimit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};



export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('createdBy', 'name email');
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching category', error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, imageData, subcategories = [], createdBy } = req.body;

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    const validSubcategories = subcategories
      .filter(
        sub =>
          sub.name &&
          sub.imageData?.name &&
          sub.imageData?.url &&
          Array.isArray(sub.formStructure)
      )
      .map(sub => ({
        name: sub.name.trim(),
        imageData: {
          name: sub.imageData.name.trim(),
          url: sub.imageData.url.trim(),
        },
        formStructure: sub.formStructure
          .filter(
            field =>
              field.label &&
              field.fieldName &&
              ['text', 'textarea', 'radio', 'checkbox', 'dropdown', 'file'].includes(field.type)
          )
          .map(field => {
            const needsOptions = ['radio', 'checkbox', 'dropdown'].includes(field.type);
            return {
              label: field.label.trim(),
              fieldName: field.fieldName.trim(),
              type: field.type,
              options: needsOptions && Array.isArray(field.options) ? field.options : [],
              required: Boolean(field.required),
            };
          }),
      }));

    const category = new Category({
      name: name.trim(),
      imageData: {
        name: imageData.name.trim(),
        url: imageData.url.trim(),
      },
      subcategories: validSubcategories,
      createdBy: createdBy || null,
    });

    await category.save();

    const formattedResponse = {
      _id: category._id,
      name: category.name,
      imageData: category.imageData,
      subcategories: category.subcategories.map(sub => ({
        name: sub.name,
        imageData: sub.imageData,
      })),
    };

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: formattedResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
};


import mongoose from 'mongoose';
import ListModel from '../models/Listing.js';

export const updateCategory = async (req, res) => {
  console.log('updating category')
  try {
    const { name, imageData, subcategories = [] } = req.body;
    const { id } = req.params;
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    // Check for name duplication
    const existingCategory = await Category.findOne({_id: id});

    if (!existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Category not found.',
      });
    }

    // Validate and clean subcategories
    const validSubcategories = subcategories
      .filter(
        sub =>
          sub.name &&
          sub.imageData?.name &&
          sub.imageData?.url &&
          Array.isArray(sub.formStructure)
      )
      .map(sub => ({
        name: sub.name.trim(),
        imageData: {
          name: sub.imageData.name.trim(),
          url: sub.imageData.url.trim(),
        },
        formStructure: sub.formStructure
          .filter(
            field =>
              field.label &&
              field.fieldName &&
              ['text', 'textarea', 'radio', 'checkbox', 'dropdown', 'file'].includes(field.type)
          )
          .map(field => {
            const needsOptions = ['radio', 'checkbox', 'dropdown'].includes(field.type);
            return {
              label: field.label.trim(),
              fieldName: field.fieldName.trim(),
              type: field.type,
              options: needsOptions && Array.isArray(field.options) ? field.options : [],
              required: Boolean(field.required),
            };
          }),
      }));

    // Perform update
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        imageData: {
          name: imageData.name.trim(),
          url: imageData.url.trim(),
        },
        subcategories: validSubcategories,
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message,
    });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    res.json({ success: true, message: 'Category deleted successfully', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
  }
};

export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error toggling status', error: error.message });
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const [totalCategories, activeCategories, inactiveCategories, totalSubcategories, recentCategories] =
      await Promise.all([
        Category.countDocuments(),
        Category.countDocuments({ isActive: true }),
        Category.countDocuments({ isActive: false }),
        Category.aggregate([{ $unwind: '$subcategories' }, { $count: 'total' }]),
        Category.find().sort({ createdAt: -1 }).limit(5).select('name createdAt subcategoryCount')
      ]);

    res.json({
      success: true,
      data: {
        totalCategories,
        activeCategories,
        inactiveCategories,
        totalSubcategories: totalSubcategories[0]?.total || 0,
        recentCategories
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
  }
};

export const subCategoryDetails = async (req, res) => {
  try {

    const {subcategory, category} = req.query;
    console.log(category, subcategory)

    if (!category || !subcategory) {
      return res.status(404).json({
        message: "Category and Subcategory required."
      })
    }

    const response = await ListModel.findOne({category: category, subcategory: subcategory});
    console.log(response);

    return res.status(200).json(response)
  } catch (error) {
    console.log(error);
  }
}