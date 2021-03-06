const path = require("path");
const AWS = require("aws-sdk");
const { json } = require("body-parser");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "productos";

const getProductos = async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };
    const productos = await dynamoClient.scan(params).promise();
    res.status(200).json(productos.Items);
  } catch (error) {
    return res.status(500).json({ erro: "Algo salio mal." });
  }
};

const getProductoPorId = async (req, res) => {
  try {
    const idProducto = req.params.id;

    if (!idProducto) {
      return res.status(400).json({
        mensaje: "Id invalido",
      });
    }

    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: idProducto,
      },
    };
    let response = await dynamoClient.get(params).promise();
    return res.status(200).json(response.Item);
  } catch (error) {
    return res.status(500).json({ erro: "Algo salio mal." });
  }
};

const crearProducto = async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const clasificacion = req.body.clasificacion;
    const precio = req.body.precio;
    const imagen = req.body.imagen;
    let errores = [];
    if (!nombre || !descripcion || !clasificacion || !precio || !imagen) {
      if (!nombre) {
        errores.push("Por favor complete el campo nombre. ");
      }

      if (!descripcion) {
        errores.push("Por favor complete el campo descripcion. ");
      }

      if (!clasificacion) {
        errores.push("Por favor complete el campo clasificacion. ");
      }

      if (!precio) {
        errores.push("Por favor complete el campo precio. ");
      }

      if (!imagen) {
        errores.push("Por favor complete el campo imagen.");
      }

      return res.status(400).json(errores);
    }

    req.body.id = uuidv4();
    const params = {
      TableName: TABLE_NAME,
      Item: req.body,
    };
    await dynamoClient.put(params).promise();
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).json({ erro: "Algo salio mal." });
  }
};

const modificarProducto = async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Item: req.body,
    };
    await dynamoClient.put(params).promise();
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ erro: "Algo salio mal." });
  }
};

const borrarProducto = async (req, res) => {
  try {
    const idProducto = req.params.id;
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: idProducto,
      },
    };

    await dynamoClient.delete(params).promise();

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ erro: "Algo salio mal." });
  }
};

module.exports = {
  dynamoClient,
  getProductos,
  getProductoPorId,
  crearProducto,
  modificarProducto,
  borrarProducto,
};
