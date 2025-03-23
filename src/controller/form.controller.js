const Form = require("../models/form.model");

exports.getAllForms = async (req, res) => {
    try {
        const forms = await Form.find().select("title");

        return res.status(200).json({forms});

    } catch (err) {
        return res.status(500).json({error : err.message});
    }
}

exports.createForm = async (req, res) => {
    try {
        const {title, inputFields, groupBy} = req.body;

        if(!title) {
            return res.status(400).json({
                error : "Form Title is required"
            });
        }

        if(inputFields.length > 0){
            for (const field of inputFields){
                if(!field.title){
                    return res.status(400).json({
                        error : "Each Input field must have a title"
                    });
                }
            }
        }

        if(inputFields.length > 20) {
            return res.status(400).json({
                error : "Maximum 20 input fields are allowed"
            });
        }

        const newForm = new Form ({
            title, inputFields, groupBy
        });
        await newForm.save();
        return res.status(201).json({
            message : "Form created successfully",
            form : newForm
        })
    } catch (err) {
        res.status(500).json({
            error : err.message
        });
    }
};

exports.getFormById = async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);

        if (!form) {
            return res.status(404).json({
                error : "Form not found"
            });
        };

        return res.status(200).json({
            form
        });
    } catch (err) {
        return res.status(500).json({
            error : err.message
        })
    }
}

exports.editForm = async (req, res) => {
    try {
        const formId = req.params.formId;
        const { title, inputFields, groupBy } = req.body;

        if(!title) {
            return res.status(400).json({error : "Title is required !"});
        }
        

        if (inputFields.length > 20) {
            return res.status(400).json({ error: "Maximum 20 input fields allowed" });
        }

        if(inputFields) {
            for (const field of inputFields) {
                if(!field.title){
                    return res.status(400).json({error : "Each input must have a title"})
                }
            }
        }

        const updatedForm = await Form.findByIdAndUpdate(
            req.params.formId,
            { title, inputFields, groupBy },
            { new: true }
        );

        if (!updatedForm) return res.status(404).json({ error: "Form not found" });

        res.json({ message: "Form updated successfully", form: updatedForm });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteForm = async (req, res) => {
    try {
        const deletedForm = await Form.findByIdAndDelete(req.params.formId);
        if (!deletedForm) return res.status(404).json({ error: "Form not found" });

        res.json({ message: "Form deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.receiveForm = async (req, res) => {
    try {
        const { inputFields } = req.body; 

        if (!inputFields || inputFields.length === 0) {
            return res.status(400).json({ error: "No inputs provided." });
        }


        const emptyFields = inputFields.filter(input => input.value.trim() === "");
        if (emptyFields.length > 0) {
            return res.status(400).json({
                error: "Please fill all details",
                emptyFields
            });
        }


        const validateInput = (field) => {
            const { title, type, value } = field;

            switch (type) {
                case "TEXT":
                    return typeof value === "string" && value.trim().length > 0;

                case "NUMBER":
                    return !isNaN(Number(value));

                case "EMAIL":
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

                case "PASSWORD":
                    return typeof value === "string" && value.length >= 0;

                case "DATE":
                    return !isNaN(Date.parse(value));

                case "PHONE":
                    return /^[0-9]{10,15}$/.test(value);

                default:
                    return false;
            }
        };

        for (const field of inputFields) {
            if (!validateInput(field)) {
                return res.status(400).json({ 
                    error: `Invalid input for ${field.title} (${field.type})` 
                });
            }
        }

        res.status(200).json({ 
            message: "All Okay, Response Recieved !"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

