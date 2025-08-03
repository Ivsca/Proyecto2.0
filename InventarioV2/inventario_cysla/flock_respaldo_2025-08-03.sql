-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: flock
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add cultivo',8,'add_cultivo'),(26,'Can change cultivo',8,'change_cultivo'),(27,'Can delete cultivo',8,'delete_cultivo'),(28,'Can view cultivo',8,'view_cultivo'),(29,'Can add enfermedades',9,'add_enfermedades'),(30,'Can change enfermedades',9,'change_enfermedades'),(31,'Can delete enfermedades',9,'delete_enfermedades'),(32,'Can view enfermedades',9,'view_enfermedades'),(33,'Can add ganado',10,'add_ganado'),(34,'Can change ganado',10,'change_ganado'),(35,'Can delete ganado',10,'delete_ganado'),(36,'Can view ganado',10,'view_ganado'),(37,'Can add tabla razas',11,'add_tablarazas'),(38,'Can change tabla razas',11,'change_tablarazas'),(39,'Can delete tabla razas',11,'delete_tablarazas'),(40,'Can view tabla razas',11,'view_tablarazas'),(41,'Can add tipo documentos',12,'add_tipodocumentos'),(42,'Can change tipo documentos',12,'change_tipodocumentos'),(43,'Can delete tipo documentos',12,'delete_tipodocumentos'),(44,'Can view tipo documentos',12,'view_tipodocumentos'),(45,'Can add tipo parcela',13,'add_tipoparcela'),(46,'Can change tipo parcela',13,'change_tipoparcela'),(47,'Can delete tipo parcela',13,'delete_tipoparcela'),(48,'Can view tipo parcela',13,'view_tipoparcela'),(49,'Can add usuarios',7,'add_usuarios'),(50,'Can change usuarios',7,'change_usuarios'),(51,'Can delete usuarios',7,'delete_usuarios'),(52,'Can view usuarios',7,'view_usuarios'),(53,'Can add tipo cultivo',14,'add_tipocultivo'),(54,'Can change tipo cultivo',14,'change_tipocultivo'),(55,'Can delete tipo cultivo',14,'delete_tipocultivo'),(56,'Can view tipo cultivo',14,'view_tipocultivo'),(57,'Can add fertilizacion',15,'add_fertilizacion'),(58,'Can change fertilizacion',15,'change_fertilizacion'),(59,'Can delete fertilizacion',15,'delete_fertilizacion'),(60,'Can view fertilizacion',15,'view_fertilizacion'),(61,'Can add tabla vacunas',16,'add_tablavacunas'),(62,'Can change tabla vacunas',16,'change_tablavacunas'),(63,'Can delete tabla vacunas',16,'delete_tablavacunas'),(64,'Can view tabla vacunas',16,'view_tablavacunas');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$870000$sIlrVL3gLbvljvsFAyfXEn$2YxiEMZp8y/7bLxZBV2kJB0cvRM9nj8finRRord2AjE=','2025-03-29 21:50:32.310317',1,'yojan','','','yojan12ceballos123@gmail.com',1,1,'2025-03-29 21:27:09.071233');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cultivo`
--

DROP TABLE IF EXISTS `cultivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cultivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `fecha_siembra` date DEFAULT NULL,
  `fecha_cosecha` date DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `foto` varchar(255) NOT NULL,
  `tipo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tipo_cultivo` (`tipo_id`),
  CONSTRAINT `fk_tipo_cultivo` FOREIGN KEY (`tipo_id`) REFERENCES `tipo_cultivo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cultivo`
--

LOCK TABLES `cultivo` WRITE;
/*!40000 ALTER TABLE `cultivo` DISABLE KEYS */;
INSERT INTO `cultivo` VALUES (43,'Naranja','2025-07-11','2025-10-02',60,'cultivos/c093586b774282f63a706740a447f32c_3pzGEcW.jpg',1),(47,'Maiz','2025-07-23','2025-10-01',10,'cultivos/images_7_VM5e1mm.jpeg',3),(48,'Zanahoria','2025-07-31','2025-10-08',60,'cultivos/images_4_49XrfMj.jpeg',2),(49,'Yuca','2025-07-24','2025-11-27',50,'cultivos/images_jAnT6pz.jpeg',4),(51,'Maiz','2025-07-03','2025-09-21',60,'cultivos/images_7_PqlDgsJ.jpeg',3),(52,'Aguacate','2025-07-08','2025-09-05',4,'cultivos/Palo_waflaLK.png',1),(54,'Mango','2025-05-21','2025-07-10',5,'cultivos/Palo2_mrLeTbZ.jpeg',1),(55,'Fresa','2025-06-19','2025-07-11',5,'cultivos/images_2_NVxH84w.jpeg',1),(56,'Manzana','2025-06-19','2025-09-30',60,'cultivos/Manzano-todo-lo-que-debes-saber-1_DsyL3H4.jpg',1),(57,'Platanoop','2025-07-07','2025-08-28',6,'cultivos/images_1_OytJRL9.jpeg',1),(58,'Maracuya','2025-07-08','2025-07-09',12,'cultivos/cuando_se_recogen_las_lechugas_2022_4_600_ZbUe1yN.jpg',1),(59,'Mandarina','2025-06-29','2025-07-10',6,'cultivos/c093586b774282f63a706740a447f32c_HrAMx5j.jpg',1),(60,'Mangi','2025-09-02','2025-10-02',3,'cultivos/images_5_vBTUzpF.jpeg',1);
/*!40000 ALTER TABLE `cultivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(8,'AppInventario','cultivo'),(9,'AppInventario','enfermedades'),(15,'AppInventario','fertilizacion'),(10,'AppInventario','ganado'),(11,'AppInventario','tablarazas'),(16,'AppInventario','tablavacunas'),(14,'AppInventario','tipocultivo'),(12,'AppInventario','tipodocumentos'),(13,'AppInventario','tipoparcela'),(7,'AppInventario','usuarios'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-03-28 15:50:52.982812'),(2,'auth','0001_initial','2025-03-28 15:51:14.457957'),(3,'admin','0001_initial','2025-03-28 15:51:20.720999'),(4,'admin','0002_logentry_remove_auto_add','2025-03-28 15:51:20.900050'),(5,'admin','0003_logentry_add_action_flag_choices','2025-03-28 15:51:21.218296'),(6,'contenttypes','0002_remove_content_type_name','2025-03-28 15:51:23.688535'),(7,'auth','0002_alter_permission_name_max_length','2025-03-28 15:51:24.507612'),(8,'auth','0003_alter_user_email_max_length','2025-03-28 15:51:24.788373'),(9,'auth','0004_alter_user_username_opts','2025-03-28 15:51:24.843450'),(10,'auth','0005_alter_user_last_login_null','2025-03-28 15:51:25.998156'),(11,'auth','0006_require_contenttypes_0002','2025-03-28 15:51:26.118161'),(12,'auth','0007_alter_validators_add_error_messages','2025-03-28 15:51:26.328157'),(13,'auth','0008_alter_user_username_max_length','2025-03-28 15:51:27.555898'),(14,'auth','0009_alter_user_last_name_max_length','2025-03-28 15:51:28.443235'),(15,'auth','0010_alter_group_name_max_length','2025-03-28 15:51:28.688873'),(16,'auth','0011_update_proxy_permissions','2025-03-28 15:51:28.789001'),(17,'auth','0012_alter_user_first_name_max_length','2025-03-28 15:51:29.857769'),(18,'sessions','0001_initial','2025-03-28 15:51:30.588395'),(19,'AppInventario','0001_initial','2025-06-04 16:13:12.963817'),(20,'AppInventario','0002_tipocultivo_alter_cultivo_options','2025-07-01 19:14:35.996213'),(21,'AppInventario','0003_remove_cultivo_tipo_cultivo_and_more','2025-07-01 19:14:36.011676'),(25,'AppInventario','0003_tablavacunas_remove_cultivo_tipo_cultivo_and_more','2025-07-08 21:24:05.856257');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('a4womcajr9immfxwec3k0l0biebcps8g','.eJxVjE0OwiAYBe_C2hCgUsCl-56B8P0gVQNJaVfGu2uTLnT7Zua9REzbWuLWeYkziYvQ4vS7QcIH1x3QPdVbk9jquswgd0UetMupET-vh_t3UFIv39pkDxoGbwKPGliTRcNZeZ3BaUY3AGHInJjDOSjyyJyTCtb6UWXlrHh_AAf_ONE:1tye4W:wPb0QRhxeoRr6JDGk6RLshKQChv5ulxPlwZIV1R984E','2025-04-12 21:50:32.341651'),('h4fpkhmx7lwm2go3v2bdzg9fwntqd7qw','eyJ1c3VhcmlvX2lkIjo3LCJ1c2VybmFtZSI6Ikp1bGlvXzAiLCJyb2wiOiJVc3VhcmlvIn0:1uifr2:BpNkVgLPEMtnRUo2YIJa7ieqNM4dC_DglR_PPdAU5GM','2025-08-17 21:02:52.198313'),('izt9ikbtkeev11t1ak9cnigr0t12bu7t','eyJ1c3VhcmlvX2lkIjo3LCJ1c2VybmFtZSI6Ikp1bGlvXzAiLCJyb2wiOiJVc3VhcmlvIn0:1ugl8G:56sMCFvfBdpebK8tdDt_Z95uYpxG9FpthPynkgatzqQ','2025-08-12 14:16:44.915369'),('tke9bboc9ee051j2t26ai7amd9ug84zy','.eJxVjE0OwiAYBe_C2hCgUsCl-56B8P0gVQNJaVfGu2uTLnT7Zua9REzbWuLWeYkziYvQ4vS7QcIH1x3QPdVbk9jquswgd0UetMupET-vh_t3UFIv39pkDxoGbwKPGliTRcNZeZ3BaUY3AGHInJjDOSjyyJyTCtb6UWXlrHh_AAf_ONE:1tydnA:NhEBfCvrHbY4AlrDLpA-yxrRKy-cFHEXF-itWcP9P0g','2025-04-12 21:32:36.803609');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enfermedades`
--

DROP TABLE IF EXISTS `enfermedades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enfermedades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enfermedades`
--

LOCK TABLES `enfermedades` WRITE;
/*!40000 ALTER TABLE `enfermedades` DISABLE KEYS */;
INSERT INTO `enfermedades` VALUES (1,'Fiebre Aftosa'),(2,'Brucelosis Bovina'),(3,'Tuberculosis Bovina'),(4,'Diarrea Viral Bovina (DVB)'),(5,'Mastitis'),(6,'Anaplasmosis'),(7,'Babesiosis'),(8,'Carbón Bacteridiano'),(9,'Carbón Sintomático'),(10,'Leptospirosis'),(11,'Rinotraqueitis Infecciosa Bovina (IBR)'),(12,'Neosporosis'),(13,'Enterotoxemia'),(14,'Piroplasmosis'),(15,'Estomatitis Vesicular'),(16,'Paratuberculosis'),(17,'Actinomicosis'),(18,'Rabia Bovina'),(19,'Tripanosomiasis'),(20,'Hemoparásitos');
/*!40000 ALTER TABLE `enfermedades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fertilizacion`
--

DROP TABLE IF EXISTS `fertilizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fertilizacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cultivo_id` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `fertilizante` varchar(100) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id`),
  KEY `cultivo_id` (`cultivo_id`),
  CONSTRAINT `fertilizacion_ibfk_1` FOREIGN KEY (`cultivo_id`) REFERENCES `cultivo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fertilizacion`
--

LOCK TABLES `fertilizacion` WRITE;
/*!40000 ALTER TABLE `fertilizacion` DISABLE KEYS */;
INSERT INTO `fertilizacion` VALUES (7,47,'2025-07-25','Cols',''),(8,49,'2025-08-02','hiiy','HOLAAAAAAAAA'),(9,47,'2025-07-29','Cols',''),(10,48,'2025-08-09','hiiy',''),(11,48,'2025-08-12','hiiy',''),(13,51,'2025-07-16','hiiy',''),(14,52,'2025-07-09','Hola',''),(15,43,'2025-07-18','hiiy',''),(16,55,'2025-07-01','Hola',''),(17,56,'2025-07-08','Hola',''),(18,54,'2025-07-09','Cols','Le eché 30 gramos'),(19,57,'2025-07-16','Cols','Se aplico 30 g'),(20,58,'2025-07-09','Cols',''),(21,58,'2025-07-09','Holaaaa','puse tal cosa'),(22,59,'2025-07-02','Cols','');
/*!40000 ALTER TABLE `fertilizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ganado`
--

DROP TABLE IF EXISTS `ganado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ganado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `CodigoCria` varchar(12) NOT NULL,
  `Foto` varchar(255) NOT NULL,
  `Crias` varchar(2) NOT NULL,
  `CodigosCrias` varchar(255) NOT NULL,
  `CodigoPapa` varchar(12) NOT NULL,
  `CodigoMama` varchar(12) NOT NULL,
  `Edad` varchar(2) NOT NULL,
  `InfoVacunas` text NOT NULL,
  `Enfermedades` varchar(255) NOT NULL,
  `Estado` enum('Activa','Muerta','Vendida') NOT NULL,
  `IdParcela` int NOT NULL,
  `Razas` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IdParcela` (`IdParcela`),
  CONSTRAINT `IdParcela` FOREIGN KEY (`IdParcela`) REFERENCES `tipoparcela` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ganado`
--

LOCK TABLES `ganado` WRITE;
/*!40000 ALTER TABLE `ganado` DISABLE KEYS */;
INSERT INTO `ganado` VALUES (8,'ivannaa','','3','[\"12345678\",\"VC004\",\"VC003\"]','VC001','VC002','12','[]','[{\"disease\":\"Fiebre Aftosa\",\"date\":\"2025-02-12\"},{\"disease\":\"Leptospirosis\",\"date\":\"2025-12-12\"},{\"disease\":\"Mastitis\",\"date\":\"2025-12-12\"}]','Activa',6,'Brahman con Girolando'),(9,'Yojan','ganado/20100516_Vacas_Vilarromarís,_Oroso-8-1.jpg','1','[\"ivanna\"]','ivanna','ivanna','9','[]','[]','Activa',3,'Brahman con Brahman'),(10,'juan cachon','ganado/Vaca-encerrada-en-un-corral.jpeg','1','[\"Yojan\"]','Yojan','ivanna','10','[]','[]','Activa',6,'Brahman con Brahman'),(11,'hijo de juan','ganado/la-boca-y-nariz-de-una-vaca-sierra-encerrada-contra-un-cielo-azul-claro-mira-cerca-cámara-319101131.webp','3','[\"ivanna\",\"Yojan\",\"juan cachon\"]','ivanna','juan cachon','10','[]','[{\"disease\":\"Fiebre Aftosa\",\"date\":\"2025-02-20\"},{\"disease\":\"Fiebre Aftosa\",\"date\":\"2025-02-20\"}]','Activa',6,'Brahman con Brangus'),(12,'isabel','ganado/vaaaaaaa.webp','3','[\"juan cachon\",\"Yojan\",\"hijo de juan\"]','juan cachon','hijo de juan','12','[{\"vaccine\":\"Fiebre Aftosa\",\"amount\":\"123\",\"date\":\"2025-02-02\",\"type\":\"via oral\"}]','[{\"disease\":\"Fiebre Aftosa\",\"date\":\"2025-02-10\"}]','Vendida',6,'Angus con Romosinuano'),(13,'cachon','ganado/vaca1.jpeg','0','[]','Yojan','ivanna','5','[{\"vaccine\":\"Fiebre Aftosa\",\"amount\":\"7\",\"date\":\"2025-05-03\",\"type\":\"via oral\"}]','[]','Activa',3,'Lucerna con Brahman'),(14,'Vas122','ganado/mis_vecinas.avif','2','[\"juan cachon\",\"ivannaa\"]','ivannaa','Yojan','4','[{\"vaccine\":\"Fiebre Aftosa\",\"amount\":\"1\",\"date\":\"2025-10-21\",\"type\":\"inyeccion\"}]','[{\"disease\":\"Fiebre Aftosa\",\"date\":\"2025-03-12\"},{\"disease\":\"Actinomicosis\",\"date\":\"2025-04-23\"}]','Activa',2,'Normando con Cebú'),(15,'Vas127','ganado/1000_F_304679251_WVESPzYrsu4FFfIwJFhaWg5kAsLsYnuu.jpg','1','[\"hijo de juan\"]','Yojan','ivannaa','4','[{\"vaccine\":\"Tricomoniasis bovina\",\"amount\":\"8\",\"date\":\"2025-09-09\",\"type\":\"inyeccion\"}]','[{\"disease\":\"Rabia Bovina\",\"date\":\"2025-09-08\"}]','Activa',3,'Brahman con Brahman'),(16,'Cola123','ganado/chino.webp','1','[\"Yojan\"]','isabel','juan cachon','11','[{\"vaccine\":\"Carbón sintomático\",\"amount\":\"5\",\"date\":\"2025-08-29\",\"type\":\"via oral\"}]','[{\"disease\":\"Estomatitis Vesicular\",\"date\":\"2025-08-27\"}]','Activa',6,'Cebú con Brahman');
/*!40000 ALTER TABLE `ganado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tablarazas`
--

DROP TABLE IF EXISTS `tablarazas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tablarazas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tablarazas`
--

LOCK TABLES `tablarazas` WRITE;
/*!40000 ALTER TABLE `tablarazas` DISABLE KEYS */;
INSERT INTO `tablarazas` VALUES (1,'Brahman'),(2,'Normando'),(3,'Holstein'),(4,'Jersey'),(5,'Gyr'),(6,'Girolando'),(7,'Simmental'),(8,'Brangus'),(9,'Beefmaster'),(10,'Charolais'),(11,'Angus'),(12,'Cebú'),(13,'Lucerna'),(14,'Romosinuano'),(15,'Sanmartinero'),(16,'Blanco Orejinegro (BON)'),(17,'Pardo Suizo'),(18,'Guzerat'),(19,'Senepol'),(20,'Limousin'),(21,'Zanahoria'),(22,'ivanna');
/*!40000 ALTER TABLE `tablarazas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tablavacunas`
--

DROP TABLE IF EXISTS `tablavacunas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tablavacunas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tablavacunas`
--

LOCK TABLES `tablavacunas` WRITE;
/*!40000 ALTER TABLE `tablavacunas` DISABLE KEYS */;
INSERT INTO `tablavacunas` VALUES (1,'Fiebre Aftosa'),(2,'Brucelosis bovina'),(3,'Rabia bovina'),(4,'Carbón sintomático'),(5,'Enterotoxemia (Clostridium perfringens tipo C y D)'),(6,'Leptospirosis bovina'),(7,'Mannheimia haemolytica / Pasteurella'),(8,'IBR (Rinotraqueítis Infecciosa Bovina)'),(9,'BVD (Diarrea Viral Bovina)'),(10,'Parainfluenza-3 (PI-3)'),(11,'Virus Respiratorio Sincitial Bovino (BRSV)'),(12,'Campylobacteriosis bovina (vibriosis)'),(13,'Tricomoniasis bovina'),(14,'Vacuna combinada reproductiva'),(15,'Vacuna combinada respiratoria');
/*!40000 ALTER TABLE `tablavacunas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_cultivo`
--

DROP TABLE IF EXISTS `tipo_cultivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_cultivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_cultivo`
--

LOCK TABLES `tipo_cultivo` WRITE;
/*!40000 ALTER TABLE `tipo_cultivo` DISABLE KEYS */;
INSERT INTO `tipo_cultivo` VALUES (1,'Fruta'),(2,'Verdura'),(3,'Legumbre'),(4,'Tuberculo'),(12,'frutaSSSS'),(13,'salchichon');
/*!40000 ALTER TABLE `tipo_cultivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_documentos`
--

DROP TABLE IF EXISTS `tipo_documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_documentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_documentos`
--

LOCK TABLES `tipo_documentos` WRITE;
/*!40000 ALTER TABLE `tipo_documentos` DISABLE KEYS */;
INSERT INTO `tipo_documentos` VALUES (1,'Cédula de Ciudadanía'),(2,'Tarjeta de Identidad'),(3,'Pasaporte'),(4,'Carné de Extranjería'),(5,'Permiso de Residencia');
/*!40000 ALTER TABLE `tipo_documentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipoparcela`
--

DROP TABLE IF EXISTS `tipoparcela`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipoparcela` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Estado` enum('Activo','Desactivo') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipoparcela`
--

LOCK TABLES `tipoparcela` WRITE;
/*!40000 ALTER TABLE `tipoparcela` DISABLE KEYS */;
INSERT INTO `tipoparcela` VALUES (1,'Parcela 1','Activo'),(2,'Parcela 2','Activo'),(3,'Parcela 3','Activo'),(4,'Parcela 4','Desactivo'),(5,'Zanahoria','Desactivo'),(6,'juan','Activo'),(7,'Holaaaaaa','Activo');
/*!40000 ALTER TABLE `tipoparcela` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `UserName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Nombres` varchar(120) NOT NULL,
  `Apellidos` varchar(70) NOT NULL,
  `Correo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IdTipoDocumento` int NOT NULL,
  `NumeroDocumento` varchar(12) NOT NULL,
  `Rol` enum('Usuario','Admin') NOT NULL,
  `Clave` varchar(100) NOT NULL,
  `Estado` enum('Usuario','Solicitud') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IdTipoDocumento` (`IdTipoDocumento`),
  CONSTRAINT `IdTipoDocumento` FOREIGN KEY (`IdTipoDocumento`) REFERENCES `tipo_documentos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'','Yojan esneyder','ceballos higuita','yojan@gmail.com',1,'1234567891','Admin','mi_mama_me_mima','Usuario'),(2,'','juan carlos','alcala martinez','juan@gmail.com',2,'12331231','Usuario','juan_baila','Usuario'),(3,'Ivanna_06','Ivanna123','Sarmiento','ivasarca@gmail.com',1,'1025648106','Usuario','12345Aa','Usuario'),(4,'Julio0987','Julio','Castaño','Julio@gmail.com',1,'2356678789','Usuario','Hola12345','Usuario'),(5,'prueba1','prueba','Cyslas','cysla1@gmail.com',1,'1234567787','Usuario','Cysla123','Usuario'),(6,'Ivanna_06','Ivanna','Sarmiento','ivasarca@gmail.com',1,'1025648106','Usuario','Iva12345','Solicitud'),(7,'Julio_0','Julio','Sarmiento','Julio@gmail.com',1,'2356678789','Usuario','Julio123','Usuario');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-03 21:16:21
