import RarityRepository from "../repository/rarityRepository.js";

const rarityRepo = new RarityRepository();

export async function getRarity(req, res) {
  try {
    const rarity = await rarityRepo.getAllRarity();
    res.status(200).json(rarity);
  } catch (error) {
    res.status(500).json({ error: "Error getting rarity" });
  }
}

export async function getRarityById(req, res) {
  try {
    const rarityFound = await rarityRepo.getRarityById(req, res);
    res.status(200).json(rarityFound);
  } catch (error) {
    res.status(500).json({ error: "Error getting rarity" });
  }
}

export async function createRarity(req, res) {
  try {
    const createdRarity = await rarityRepo.createRarity(req, res);
    res.status(200).json(createdRarity);
  } catch (error) {
    res.status(500).json({ error: "Error creating rarity" });
  }
}

export async function updateRarity(req, res) {
  try {
    const rarityChanged = await rarityRepo.updateRarity(req, res);
    res.status(200).json(rarityChanged);
  } catch (error) {
    res.status(500).json({ error: "Error updating rarity" });
  }
}

export async function deleteRarity(req, res) {
  try {
    const rarityDeleted = await rarityRepo.deleteRarity(req, res);
    res.status(200).json(rarityDeleted);
  } catch (error) {
    res.status(500).json({ error: "Error deleting rarity" });
  }
}
