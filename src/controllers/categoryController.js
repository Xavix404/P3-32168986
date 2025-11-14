import CategoryRepository from "../repository/categoryRepository.js";

const categoryRepo = new CategoryRepository();

export async function getCategories(req, res) {
  try {
    const categories = await categoryRepo.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error getting categories" });
  }
}

export async function getCategoryById(req, res) {
  try {
    const categoryFound = await categoryRepo.getCategoryById(req, res);
    res.status(200).json(categoryFound);
  } catch (error) {
    res.status(500).json({ error: "Error getting category" });
  }
}

export async function createCategory(req, res) {
  try {
    const createdCategory = await categoryRepo.createCategory(req, res);
    res.status(200).json(createdCategory);
  } catch (error) {
    res.status(500).json({ error: "Error creating category" });
  }
}

export async function updateCategory(req, res) {
  try {
    const categoryChanged = await categoryRepo.updateCategory(req, res);
    res.status(200).json(categoryChanged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const categoryDeleted = await categoryRepo.deleteCategory(req, res);
    res.status(200).json(categoryDeleted);
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
}
