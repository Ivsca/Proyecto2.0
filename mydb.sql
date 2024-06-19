-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 19-06-2024 a las 01:11:29
-- Versión del servidor: 5.7.15-log
-- Versión de PHP: 5.6.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mydb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `idAdmin` int(11) NOT NULL,
  `Usuario` varchar(45) NOT NULL,
  `Contraseña` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `animal`
--

CREATE TABLE `animal` (
  `idVacas` int(11) NOT NULL,
  `TipoAnimal` varchar(45) NOT NULL,
  `Marca` varchar(20) NOT NULL,
  `Raza` varchar(45) NOT NULL,
  `IdParients` int(11) NOT NULL,
  `Vacuna` varchar(245) NOT NULL,
  `Nombre` varchar(45) DEFAULT 'No tiene nombre',
  `Edad` int(11) NOT NULL,
  `Uso` varchar(45) NOT NULL,
  `ParelaAccinada` varchar(45) DEFAULT NULL,
  `Cantidad` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `animal`
--

INSERT INTO `animal` (`idVacas`, `TipoAnimal`, `Marca`, `Raza`, `IdParients`, `Vacuna`, `Nombre`, `Edad`, `Uso`, `ParelaAccinada`, `Cantidad`) VALUES
(1, 'Vaca', '544sa', 'Simental', 0, '2', 'vacanuca', 5, 'lechera', '5', '5');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `corrales`
--

CREATE TABLE `corrales` (
  `idCorrar` int(11) NOT NULL,
  `Descripcion` varchar(45) NOT NULL,
  `Uso` varchar(205) NOT NULL,
  `CantidadAnimales` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `corrales`
--

INSERT INTO `corrales` (`idCorrar`, `Descripcion`, `Uso`, `CantidadAnimales`) VALUES
(1, 'principal', 'vacunación ', 0),
(2, 'secundario ', 'mancar', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cultivos`
--

CREATE TABLE `cultivos` (
  `idCultivos` int(11) NOT NULL,
  `TipoCultivo` varchar(45) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Descripcion` varchar(205) NOT NULL,
  `IdFertilizante` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `cultivos`
--

INSERT INTO `cultivos` (`idCultivos`, `TipoCultivo`, `Nombre`, `Descripcion`, `IdFertilizante`, `Cantidad`) VALUES
(1, 'Vegetal', 'Zanahoria', 'Los cuidados de las zanahorias son esenciales para garantizar una cosecha exitosa. Estos cultivos prosperan en suelos sueltos, bien drenados y libres de piedras, lo que ayuda a evitar deformidades en las r', 0, 100),
(2, 'Fruta', 'Cereza', 'Los cerezos necesitan cuidados específicos para prosperar y producir frutos de calidad. Ubicarlos en un suelo bien drenado y con exposición solar directa es esencial. Durante la temporada de crecimiento, e', 0, 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eliminados`
--

CREATE TABLE `eliminados` (
  `idEliminados` int(11) NOT NULL,
  `Animal_idVacas` int(11) NOT NULL,
  `Parcela_idParcela` int(11) NOT NULL,
  `Fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `idEstado` int(11) NOT NULL,
  `Descripcion` varchar(45) NOT NULL,
  `Vacas_idVacas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestionar`
--

CREATE TABLE `gestionar` (
  `idGestionar` int(11) NOT NULL,
  `FECHAyHORA` datetime NOT NULL,
  `Gestion` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modificar`
--

CREATE TABLE `modificar` (
  `idModificar` int(11) NOT NULL,
  `FECHA` date NOT NULL,
  `Descripción` varchar(250) NOT NULL,
  `Animal_idVacas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `parcela`
--

CREATE TABLE `parcela` (
  `idParcela` int(11) NOT NULL,
  `Descripcion` varchar(45) NOT NULL,
  `Daños` varchar(205) NOT NULL DEFAULT 'No tiene daños',
  `CantidadAnimales` int(11) DEFAULT '0',
  `Estado` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `parcela`
--

INSERT INTO `parcela` (`idParcela`, `Descripcion`, `Daños`, `CantidadAnimales`, `Estado`) VALUES
(1, 'Es para animales', 'No tiene daños', 10, 'Activa'),
(2, 'Es para cultivos ', 'No tiene daños', 120, 'Activa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `parientes`
--

CREATE TABLE `parientes` (
  `idParientes` int(11) NOT NULL,
  `NombrePadre` varchar(50) NOT NULL,
  `NombreMadre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `parientes`
--

INSERT INTO `parientes` (`idParientes`, `NombrePadre`, `NombreMadre`) VALUES
(1, 'vaco', 'cavas'),
(2, 'cavo', 'vaca');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajador`
--

CREATE TABLE `trabajador` (
  `idTrabajador` int(11) NOT NULL,
  `Usuario` varchar(45) NOT NULL,
  `Contraseña` varchar(45) DEFAULT NULL,
  `Usuarios_idUsuarios` int(11) NOT NULL,
  `Usuarios_Roles_idRoles` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `uso`
--

CREATE TABLE `uso` (
  `idUso` int(11) NOT NULL,
  `Descripcion` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `uso`
--

INSERT INTO `uso` (`idUso`, `Descripcion`) VALUES
(2, 'lechera'),
(3, 'Engorde'),
(4, 'lechera'),
(5, 'Engorde');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idUsuarios` int(11) NOT NULL,
  `TiposDocumentos` varchar(50) NOT NULL,
  `Nombres` varchar(50) NOT NULL,
  `Apellidos` varchar(50) NOT NULL,
  `Rol` varchar(45) NOT NULL,
  `Correo` varchar(40) NOT NULL,
  `Contraseña` varchar(10) NOT NULL,
  `Roles_idRoles` int(11) NOT NULL,
  `Admin_idAdmin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacunas`
--

CREATE TABLE `vacunas` (
  `idVacunas` int(11) NOT NULL,
  `Descripcion` varchar(200) DEFAULT 'No tiene',
  `Dosis` int(11) DEFAULT '0',
  `PrimeraDosis` date DEFAULT NULL,
  `SegundaDosis` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `vacunas`
--

INSERT INTO `vacunas` (`idVacunas`, `Descripcion`, `Dosis`, `PrimeraDosis`, `SegundaDosis`) VALUES
(1, 'Vacuna contra la fiebre aftosa', 2, '2024-05-01', '2024-06-01');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`idAdmin`);

--
-- Indices de la tabla `animal`
--
ALTER TABLE `animal`
  ADD PRIMARY KEY (`idVacas`),
  ADD UNIQUE KEY `idVacas_UNIQUE` (`idVacas`),
  ADD UNIQUE KEY `IdParients_UNIQUE` (`IdParients`),
  ADD UNIQUE KEY `Marca_UNIQUE` (`Marca`);

--
-- Indices de la tabla `corrales`
--
ALTER TABLE `corrales`
  ADD PRIMARY KEY (`idCorrar`),
  ADD UNIQUE KEY `idtable1_UNIQUE` (`idCorrar`);

--
-- Indices de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  ADD PRIMARY KEY (`idCultivos`);

--
-- Indices de la tabla `eliminados`
--
ALTER TABLE `eliminados`
  ADD PRIMARY KEY (`idEliminados`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`idEstado`),
  ADD UNIQUE KEY `idEstado_UNIQUE` (`idEstado`);

--
-- Indices de la tabla `gestionar`
--
ALTER TABLE `gestionar`
  ADD PRIMARY KEY (`idGestionar`);

--
-- Indices de la tabla `modificar`
--
ALTER TABLE `modificar`
  ADD PRIMARY KEY (`idModificar`);

--
-- Indices de la tabla `parcela`
--
ALTER TABLE `parcela`
  ADD PRIMARY KEY (`idParcela`),
  ADD UNIQUE KEY `idParcela_UNIQUE` (`idParcela`),
  ADD UNIQUE KEY `Descripcion_UNIQUE` (`Descripcion`);

--
-- Indices de la tabla `parientes`
--
ALTER TABLE `parientes`
  ADD PRIMARY KEY (`idParientes`);

--
-- Indices de la tabla `trabajador`
--
ALTER TABLE `trabajador`
  ADD PRIMARY KEY (`idTrabajador`);

--
-- Indices de la tabla `uso`
--
ALTER TABLE `uso`
  ADD PRIMARY KEY (`idUso`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUsuarios`);

--
-- Indices de la tabla `vacunas`
--
ALTER TABLE `vacunas`
  ADD PRIMARY KEY (`idVacunas`),
  ADD UNIQUE KEY `idVacunas_UNIQUE` (`idVacunas`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admin`
--
ALTER TABLE `admin`
  MODIFY `idAdmin` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `animal`
--
ALTER TABLE `animal`
  MODIFY `idVacas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `corrales`
--
ALTER TABLE `corrales`
  MODIFY `idCorrar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  MODIFY `idCultivos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `eliminados`
--
ALTER TABLE `eliminados`
  MODIFY `idEliminados` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `idEstado` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `gestionar`
--
ALTER TABLE `gestionar`
  MODIFY `idGestionar` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `modificar`
--
ALTER TABLE `modificar`
  MODIFY `idModificar` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `parcela`
--
ALTER TABLE `parcela`
  MODIFY `idParcela` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `parientes`
--
ALTER TABLE `parientes`
  MODIFY `idParientes` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `trabajador`
--
ALTER TABLE `trabajador`
  MODIFY `idTrabajador` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `uso`
--
ALTER TABLE `uso`
  MODIFY `idUso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idUsuarios` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `vacunas`
--
ALTER TABLE `vacunas`
  MODIFY `idVacunas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
