// const Company = require('../models/Company');

// exports.createCompany = async (req, res) => {
//   try {
//     const company = new Company(req.body);
//     await company.save();
//     res.status(201).json(company);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getCompanies = async (req, res) => {
//   try {
//     const companies = await Company.find();
//     res.json(companies);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
