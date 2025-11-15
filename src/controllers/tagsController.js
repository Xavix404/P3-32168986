import TagsRepository from "../repository/tagsRepository.js";

const tagsRepo = new TagsRepository();

export async function getTags(req, res) {
  try {
    const tags = await tagsRepo.getAllTags();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: "Error getting tags" });
  }
}

export async function getTagsById(req, res) {
  try {
    const tagsFound = await tagsRepo.getTagsById(req, res);
    res.status(200).json(tagsFound);
  } catch (error) {
    res.status(500).json({ error: "Error getting tags" });
  }
}

export async function createTags(req, res) {
  try {
    const createdTags = await tagsRepo.createTags(req, res);
    res.status(200).json(createdTags);
  } catch (error) {
    res.status(500).json({ error: "Error creating tags" });
  }
}

export async function updateTags(req, res) {
  try {
    const tagsChanged = await tagsRepo.updateTags(req, res);
    res.status(200).json(tagsChanged);
  } catch (error) {
    res.status(500).json({ error: "Error updating tags" });
  }
}

export async function deleteTags(req, res) {
  try {
    const tagsDeleted = await tagsRepo.deleteTags(req, res);
    res.status(200).json(tagsDeleted);
  } catch (error) {
    res.status(500).json({ error: "Error deleting tags" });
  }
}
