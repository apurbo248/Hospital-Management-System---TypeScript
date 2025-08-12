import Department from "../models/departmentSchema.js";

export const addDepartment = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    //check duplicate and case sensitive department name
    const existingDepartment = await Department.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    // Create new department
    else {
      const newDepartment = new Department({
        name,
        description,
        image,
      });

      await newDepartment.save();

      res.status(201).json({
        message: "Department added successfully",
        department: newDepartment.name,
      });
      console.log(newDepartment.name, "department added successfully:");
    }
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
