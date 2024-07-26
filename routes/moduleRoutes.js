const express = require('express');
const moduleController = require('../controller/moduleController')
const moduleRoutes = express.Router();

moduleRoutes.post('/',moduleController.createModule);
moduleRoutes.get('/',moduleController.getAllModule)
moduleRoutes.put('/:id',moduleController.updateModule);
moduleRoutes.delete('/:id',moduleController.deleteModule);

moduleRoutes.patch('/:id/assignlecture',moduleController.assignlecture);
moduleRoutes.get('/:id/getModuleLectures',moduleController.getModuleLectures)

module.exports = moduleRoutes; 