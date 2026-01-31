import ProductRepository from "../repository/productRepository.js";
const productRepo = new ProductRepository();

export async function getProduct(req, res) {
  try {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const category = req.query.category;
    const tags = req.query.tags;
    const price_min = req.query.price_min;
    const price_max = req.query.price_max;
    const search = req.query.search;
    const rarity = req.query.rarity;
    const effects = req.query.effects;
    const element = req.query.element;

    const result = await productRepo.findProducts({
      page,
      category,
      tags,
      price_min,
      price_max,
      search,
      rarity,
      effects,
      element,
    });

    return res.status(200).json({
      status: "success",
      data: result.items,
      meta: result.meta,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}

export async function getProductById(req, res) {
  try {
    const productFound = await productRepo.getProductById(req, res);
    res.status(200).json(productFound);
  } catch (error) {
    res.status(500).json({ error: "Error getting product" });
  }
}

export async function getProductBySlug(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid product id" });
    }

    const productFound = await productRepo.getProductById(req, res);
    if (!productFound) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }

    const urlSlug = req.params.slug;
    if (urlSlug) {
      const normalize = (s) => (s || "").toString().trim().toLowerCase();
      const reqSlug = normalize(decodeURIComponent(urlSlug));
      const dbSlug = normalize(productFound.slug);
      // build canonical path including any mount path (e.g. /api/products)
      const canonical = `${req.baseUrl}/${productFound.id}-${productFound.slug}`;

      if (reqSlug !== dbSlug && canonical !== req.originalUrl) {
        return res.redirect(301, canonical);
      }
    }

    return res.status(200).json({ status: "success", data: productFound });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function createProduct(req, res) {
  try {
    req.body.slug = req.body.name.toLowerCase().replace(/ /g, "-");
    const createdProduct = await productRepo.createProduct(req, res);
    res.status(200).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const data = req.body;
    data.id = parseInt(req.params.id);

    const productChanged = await productRepo.updateProduct(data);
    res.status(200).json(productChanged);
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const productDeleted = await productRepo.deleteProduct(req, res);
    res.status(200).json(productDeleted);
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
}
