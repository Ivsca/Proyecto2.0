-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 03-10-2024 a las 15:08:54
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto_sena`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cultivo`
--

CREATE TABLE `cultivo` (
  `id` int NOT NULL,
  `CategoriaCultivo` enum('FRUTA','VEGETAL') NOT NULL,
  `Tipo_Cultivo_id` int NOT NULL,
  `Descripcion` text NOT NULL,
  `cantidad` int NOT NULL,
  `fecha_cultivado` date NOT NULL,
  `fecha_cosechado` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `cultivo`
--

INSERT INTO `cultivo` (`id`, `CategoriaCultivo`, `Tipo_Cultivo_id`, `Descripcion`, `cantidad`, `fecha_cultivado`, `fecha_cosechado`) VALUES
(15, 'FRUTA', 2, 'todo con sal', 12123, '2024-09-10', '2024-09-05'),
(17, 'FRUTA', 1, 'esta fue hecha por js y django', 10, '2024-09-04', '2024-09-27'),
(19, 'VEGETAL', 2, 'tyrfy', 2134, '2024-09-04', '2024-09-21'),
(21, 'FRUTA', 1, 'El problema con tu alerta es que estás utilizando document.getElementById(\'swal-form2\').innerHTML para insertar el contenido del formulario en el modal de SweetAlert. Sin embargo, al hacer esto, el formulario pierde su funcionalidad, ya que los elementos del DOM que incluyen JavaScript, eventos o referencias directas no se copian correctamente con innerHTML.', 5, '2024-09-05', '2024-09-26'),
(22, 'FRUTA', 1, 'hfhhk', 5, '2024-09-05', '2024-09-26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ganado`
--

CREATE TABLE `ganado` (
  `id` int NOT NULL,
  `codigo` varchar(8) NOT NULL,
  `ImagenVacuno` varchar(255) DEFAULT NULL,
  `crias` int NOT NULL,
  `CodigoPapa` varchar(8) NOT NULL,
  `CodigoMama` varchar(8) NOT NULL,
  `raza_id` int NOT NULL,
  `edad` varchar(2) NOT NULL,
  `proposito` enum('CARNE','LECHE','VENTA') NOT NULL,
  `estado` enum('MUERTA','INACTIVA','VENDIDA','ACTIVA') NOT NULL,
  `vacunas` text NOT NULL,
  `Dia_vacunada` date NOT NULL,
  `Dia_caduca_vacunada` date NOT NULL,
  `parcela_id` int NOT NULL,
  `alimentacion` text NOT NULL,
  `enfermedades` text NOT NULL,
  `origen` enum('CRIADA','REGALADA','COMPRADA') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `ganado`
--

INSERT INTO `ganado` (`id`, `codigo`, `ImagenVacuno`, `crias`, `CodigoPapa`, `CodigoMama`, `raza_id`, `edad`, `proposito`, `estado`, `vacunas`, `Dia_vacunada`, `Dia_caduca_vacunada`, `parcela_id`, `alimentacion`, `enfermedades`, `origen`) VALUES
(11, '1212', '/VacaGorda.png', 98, '000', '000', 2, '12', 'CARNE', 'INACTIVA', 'ninguna', '2024-09-06', '2024-09-12', 2, 'pollo frito', 'todas', 'CRIADA'),
(12, '123', '/vaca_comiendo_pasto.jfif', 13, '45', '231', 4, '12', 'LECHE', 'ACTIVA', '2221333333333333333333', '2024-10-21', '2024-10-30', 2, '|123333333333333', '313222222222222222', 'REGALADA'),
(13, 'rew', '/animales-comiendo-lechera-prado.jpg', 13, '45', 'erwwwww', 4, '12', 'VENTA', 'VENDIDA', 'eeeeweeeeeee', '2024-10-31', '2024-10-31', 4, '231rewwwwwwwwwwwww', 'wwwwrweeeeee', 'REGALADA'),
(15, '22222', '/fdf2e5cffd6b49e6badc92fcd2874bae.jpg', 13, '45', 'd2', 4, '12', 'VENTA', 'INACTIVA', 'd22', '2024-10-23', '2024-10-29', 2, 'd22222', '2ddd', 'REGALADA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipocultivo`
--

CREATE TABLE `tipocultivo` (
  `id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `foto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tipocultivo`
--

INSERT INTO `tipocultivo` (`id`, `nombre`, `foto`) VALUES
(1, 'Tomate', ''),
(2, 'Zanahoria', ''),
(3, 'Lechuga', ''),
(4, 'Papa', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipoparcela`
--

CREATE TABLE `tipoparcela` (
  `id` int NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tipoparcela`
--

INSERT INTO `tipoparcela` (`id`, `nombre`) VALUES
(1, 'A1'),
(2, 'A2'),
(3, 'A3'),
(4, 'A4'),
(5, 'A5');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiporaza`
--

CREATE TABLE `tiporaza` (
  `id` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `ImagenRaza` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tiporaza`
--

INSERT INTO `tiporaza` (`id`, `nombre`, `ImagenRaza`) VALUES
(1, 'Angus', ''),
(2, 'Hereford', ''),
(3, 'Limousin', ''),
(4, 'Charolais', ''),
(5, 'Brahman', ''),
(6, 'Holstein', ''),
(7, 'Jersey', ''),
(8, 'Guernsey', ''),
(9, 'Ayrshire', ''),
(10, 'Pardo Suizo', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cultivo`
--
ALTER TABLE `cultivo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Tipo_Cultivo_id` (`Tipo_Cultivo_id`);

--
-- Indices de la tabla `ganado`
--
ALTER TABLE `ganado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `raza_id` (`raza_id`),
  ADD KEY `parcela_id` (`parcela_id`);

--
-- Indices de la tabla `tipocultivo`
--
ALTER TABLE `tipocultivo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipoparcela`
--
ALTER TABLE `tipoparcela`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tiporaza`
--
ALTER TABLE `tiporaza`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cultivo`
--
ALTER TABLE `cultivo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `ganado`
--
ALTER TABLE `ganado`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `tipocultivo`
--
ALTER TABLE `tipocultivo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipoparcela`
--
ALTER TABLE `tipoparcela`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tiporaza`
--
ALTER TABLE `tiporaza`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cultivo`
--
ALTER TABLE `cultivo`
  ADD CONSTRAINT `cultivo_ibfk_1` FOREIGN KEY (`Tipo_Cultivo_id`) REFERENCES `tipocultivo` (`id`);

--
-- Filtros para la tabla `ganado`
--
ALTER TABLE `ganado`
  ADD CONSTRAINT `ganado_ibfk_1` FOREIGN KEY (`raza_id`) REFERENCES `tiporaza` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ganado_ibfk_2` FOREIGN KEY (`parcela_id`) REFERENCES `tipoparcela` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
