import Category from '../models/Category.js';

export const getAllCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isActive
    } = req.query;

    const filter = {};

    //  Filter only if isActive is present in query
    if (req.query.hasOwnProperty('isActive')) {
      filter.isActive = isActive === 'true';
    }

    //  Search by name or subcategory name
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'subcategories.name': { $regex: search, $options: 'i' } }
      ];
    }

    //  Sorting logic
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    //  Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    //  Fetch categories + count in parallel
    const [categories, total] = await Promise.all([
      Category.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email'),
      Category.countDocuments(filter)
    ]);

    //  Send response
    res.json({
      success: true,
      data: {
        categories,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
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
    const { name, icon, subcategories = [], createdBy } = req.body;

    // Check duplicate
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return res.status(409).json({ success: false, message: 'Category with this name already exists' });
    }

    // Filter valid subcategories
    const validSubcategories = subcategories.filter(
      sub => sub.name && sub.icon?.name && sub.icon?.component
    );

    // Create and save category
    const category = new Category({
      name,
      icon,
      subcategories: validSubcategories,
      createdBy: createdBy || null
    });

    await category.save();

    // Format response to show name, icon, and list of subcategories (name + icon only)
    const formattedResponse = {
      name: category.name,
      icon: category.icon,
      subcategories: category.subcategories.map(sub => ({
        name: sub.name,
        icon: sub.icon
      }))
    };

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: formattedResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating category', error: error.message });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const { name, icon, subcategories = [] } = req.body;

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: req.params.id }
    });

    if (existingCategory)
      return res.status(409).json({ success: false, message: 'Another category with this name already exists' });

    const validSubcategories = subcategories.filter(sub => sub.name && sub.icon?.name && sub.icon?.component);

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        icon,
        subcategories: validSubcategories
      },
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    res.json({ success: true, message: 'Category updated successfully', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating category', error: error.message });
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
