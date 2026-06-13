import ProductoController from "/backend/controller/ProductoController.js";
import { Router } from "express";
const router = Router();


// Rutas específicas primero
router.post('/productoEspecifico', ProductoController.seleccionarProductoSimilar);
router.post('/insertarProducto', ProductoController.insertarProducto);
router.post('/actualizarProducto', ProductoController.actualizarProducto);
router.post('/eliminarProducto', ProductoController.eliminarProducto);
router.get('/seleccionarProducto', ProductoController.seleccionarTodosProductos);
router.get('/seleccionarOfertas', ProductoController.seleccionarTodosProductosOferta);
router.post('/categoriaProducto', ProductoController.seleccionarProductoCategoria);
router.get('/ordenarMayor', ProductoController.seleccionarTodosProductosMayorPrecio);
router.get('/ordenarMenor', ProductoController.seleccionarTodosProductosMenorPrecio);

// Ruta con parámetro dinámico al final
router.get('/:id_producto', ProductoController.seleccionarProductoEspecifico);

export default router;
