CREATE TABLE IF NOT EXISTS `content_article` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `title` varchar(120) NOT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `content` text,
  `sort` int NOT NULL DEFAULT 0,
  `status` tinyint NOT NULL DEFAULT 1,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_content_article_type_status` (`type`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_message` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'system',
  `title` varchar(120) NOT NULL,
  `content` varchar(500) NOT NULL,
  `biz_type` varchar(30) DEFAULT NULL,
  `biz_id` bigint unsigned DEFAULT NULL,
  `is_read` tinyint NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_message_user_read` (`user_id`, `is_read`),
  CONSTRAINT `fk_user_message_user_id` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reward_goods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(120) NOT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `points` int NOT NULL DEFAULT 0,
  `stock` int NOT NULL DEFAULT 0,
  `description` text,
  `sort` int NOT NULL DEFAULT 0,
  `status` tinyint NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reward_goods_status_sort` (`status`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reward_redeem_order` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_no` varchar(50) NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `goods_id` bigint unsigned NOT NULL,
  `points` int NOT NULL DEFAULT 0,
  `status` tinyint NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reward_redeem_order_no` (`order_no`),
  KEY `idx_reward_redeem_order_user` (`user_id`),
  KEY `idx_reward_redeem_order_goods` (`goods_id`),
  CONSTRAINT `fk_reward_redeem_order_user_id` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`),
  CONSTRAINT `fk_reward_redeem_order_goods_id` FOREIGN KEY (`goods_id`) REFERENCES `reward_goods` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `point_record` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `type` varchar(20) NOT NULL,
  `change_value` int NOT NULL,
  `balance_value` int NOT NULL DEFAULT 0,
  `remark` varchar(255) DEFAULT NULL,
  `biz_type` varchar(30) DEFAULT NULL,
  `biz_id` bigint unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_point_record_user_created` (`user_id`, `created_at`),
  CONSTRAINT `fk_point_record_user_id` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_favorite` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `target_type` varchar(20) NOT NULL,
  `target_id` bigint unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_favorite` (`user_id`, `target_type`, `target_id`),
  KEY `idx_user_favorite_user_created` (`user_id`, `created_at`),
  CONSTRAINT `fk_user_favorite_user_id` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_certificate` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `title` varchar(120) NOT NULL,
  `issuer` varchar(120) DEFAULT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `issued_at` datetime DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_certificate_user_status` (`user_id`, `status`),
  CONSTRAINT `fk_user_certificate_user_id` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`),
  CONSTRAINT `fk_user_certificate_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `learning_record` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `title` varchar(120) NOT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `progress` int NOT NULL DEFAULT 0,
  `duration_minutes` int NOT NULL DEFAULT 0,
  `last_study_at` datetime DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_learning_record_user_status` (`user_id`, `status`),
  CONSTRAINT `fk_learning_record_user_id` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`),
  CONSTRAINT `fk_learning_record_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_feedback` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'suggestion',
  `content` varchar(1000) NOT NULL,
  `contact` varchar(100) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_feedback_status_created` (`status`, `created_at`),
  CONSTRAINT `fk_user_feedback_user_id` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `agent_review` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `agent_user_id` bigint unsigned NOT NULL,
  `score` tinyint NOT NULL DEFAULT 5,
  `content` varchar(255) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_agent_review_user_status` (`agent_user_id`, `status`),
  CONSTRAINT `fk_agent_review_user_id` FOREIGN KEY (`agent_user_id`) REFERENCES `app_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `content_article` (`type`, `title`, `summary`, `category`, `content`, `sort`, `status`, `published_at`)
SELECT 'news', '校园迎新季活动攻略', '新学期热门活动参与指南', '校园资讯', '这里是校园迎新季活动攻略内容。', 100, 1, NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `content_article` WHERE `type` = 'news' AND `title` = '校园迎新季活动攻略'
);

INSERT INTO `content_article` (`type`, `title`, `summary`, `category`, `content`, `sort`, `status`, `published_at`)
SELECT 'help', '如何参加活动并获得奖励', '用户常见问题与参与说明', '帮助中心', '这里是帮助中心示例内容。', 100, 1, NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `content_article` WHERE `type` = 'help' AND `title` = '如何参加活动并获得奖励'
);

INSERT INTO `reward_goods` (`title`, `points`, `stock`, `description`, `sort`, `status`)
SELECT '瑞幸咖啡券', 199, 100, '199积分兑换瑞幸咖啡券一张', 100, 1
WHERE NOT EXISTS (
  SELECT 1 FROM `reward_goods` WHERE `title` = '瑞幸咖啡券'
);
