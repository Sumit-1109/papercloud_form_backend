const express = require("express");
const { getAllForms, getFormById, createForm, editForm, deleteForm, receiveForm } = require("../controller/form.controller");
const router = express.Router();

router.get('/', getAllForms);
router.get('/:formId', getFormById);
router.post('/create', createForm);
router.put('/edit/:formId', editForm);
router.delete('/delete/:formId', deleteForm);
router.post('/recieve', receiveForm)

module.exports = router;