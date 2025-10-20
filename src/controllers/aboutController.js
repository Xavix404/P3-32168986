import aboutData from "../services/about.json" with { type: "json" };

export async function getAbout(req, res) {
  try {
    res.json(aboutData)
  }catch (err) {
    console.log(err)
  }
}